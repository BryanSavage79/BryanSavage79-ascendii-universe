/**
 * ritual-tracker.jsx
 * Ascendii Universe — Ritual Tracker
 *
 * Tracks on-chain and off-chain rituals tied to the AquaVitaRitual contract.
 * Supports faction filtering, XP accumulation, charity-donation logging, and
 * a visual history chart — all self-contained for embedding in the Nexus UI.
 *
 * Dependencies (loaded via CDN in the host HTML):
 *   react@18, react-dom@18, @babel/standalone, recharts@2, tailwindcss
 */

const { useState, useMemo, useCallback } = React;
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = Recharts;

// ─── Constants ────────────────────────────────────────────────────────────────

const RITUAL_TYPES = [
  { id: "cross_chain_mint", label: "Cross-Chain Mint", xp: 300, description: "Prove a cross-chain minting event on the AquaVitaRitual contract." },
  { id: "charity_donation", label: "Charity Donation", xp: 200, description: "Donate to the root charity address via donateToCharity()." },
  { id: "ritual_proof",     label: "Ritual Proof",     xp: 150, description: "Submit an off-chain proof of a completed personal rite." },
  { id: "initiation",       label: "Initiation Quest", xp: 50,  description: "Complete the First Offering and register as a Nexus participant." },
  { id: "volunteer_hours",  label: "Volunteer Hours",  xp: 350, description: "Log verified volunteer hours with an approved partner org." },
  { id: "research_note",    label: "Research Note",    xp: 500, description: "Publish a short research note about equitable digital systems." },
];

const FACTIONS = [
  { id: "all",    label: "All Factions",    color: "#a78bfa", signature: null },
  { id: "f-blade", label: "The Bladesong",  color: "#f87171", signature: "edge" },
  { id: "f-ward",  label: "The Wardens",    color: "#34d399", signature: "shield" },
  { id: "f-loom",  label: "The Loom",       color: "#60a5fa", signature: "weave" },
];

const STATUS = {
  proven:  { label: "Proven",  bg: "bg-emerald-900", text: "text-emerald-300", dot: "bg-emerald-400" },
  pending: { label: "Pending", bg: "bg-yellow-900",  text: "text-yellow-300",  dot: "bg-yellow-400" },
  failed:  { label: "Failed",  bg: "bg-red-900",     text: "text-red-300",     dot: "bg-red-400"     },
};

const SEED_RITUALS = [
  { id: 1, type: "cross_chain_mint", faction: "f-blade", status: "proven",  performer: "0xA1B2...C3D4", txHash: "0xabc1",   xp: 300, charityAmount: 0,    timestamp: Date.now() - 86400000 * 3, note: "Genesis mint across Polygon bridge." },
  { id: 2, type: "charity_donation", faction: "f-ward",  status: "proven",  performer: "0xE5F6...G7H8", txHash: "0xdef2",   xp: 200, charityAmount: 0.05, timestamp: Date.now() - 86400000 * 2, note: "0.05 ETH routed to AquaVita root." },
  { id: 3, type: "volunteer_hours",  faction: "f-loom",  status: "proven",  performer: "0xI9J0...K1L2", txHash: null,       xp: 350, charityAmount: 0,    timestamp: Date.now() - 86400000 * 1, note: "8 hrs verified at local community hub." },
  { id: 4, type: "ritual_proof",     faction: "f-blade", status: "pending", performer: "0xM3N4...O5P6", txHash: null,       xp: 150, charityAmount: 0,    timestamp: Date.now() - 3600000,      note: "Off-chain proof awaiting oracle confirm." },
  { id: 5, type: "initiation",       faction: "f-ward",  status: "proven",  performer: "0xQ7R8...S9T0", txHash: "0xghi5",   xp: 50,  charityAmount: 0,    timestamp: Date.now() - 7200000,      note: "First Offering placed on the forge." },
];

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

const IconFlame = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const IconShield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconWeave = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3 L21 21 M3 21 L21 3"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconStar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconPlus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconDroplet = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function factionById(id) {
  return FACTIONS.find(f => f.id === id) || FACTIONS[0];
}

function ritualTypeById(id) {
  return RITUAL_TYPES.find(r => r.id === id) || RITUAL_TYPES[0];
}

function formatAddress(addr) {
  if (!addr) return "—";
  return addr.length > 12 ? addr.slice(0, 6) + "…" + addr.slice(-4) : addr;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function FactionBadge({ factionId }) {
  const f = factionById(factionId);
  const Icon = f.signature === "edge" ? IconFlame : f.signature === "shield" ? IconShield : IconWeave;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: f.color + "22", color: f.color, border: `1px solid ${f.color}55` }}>
      <Icon size={11} />
      {f.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Log Ritual Modal ─────────────────────────────────────────────────────────

function LogRitualModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    type:          RITUAL_TYPES[0].id,
    faction:       FACTIONS[1].id,
    performer:     "",
    txHash:        "",
    charityAmount: "",
    note:          "",
    status:        "pending",
  });

  const ritualInfo = ritualTypeById(form.type);

  const handleChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.performer.trim()) return;
    onSubmit({
      ...form,
      charityAmount: parseFloat(form.charityAmount) || 0,
      xp:            ritualTypeById(form.type).xp,
      timestamp:     Date.now(),
    });
  }, [form, onSubmit]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-800">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <IconFlame size={18} /> Log a Ritual
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Ritual type */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Ritual Type</label>
            <select
              value={form.type}
              onChange={e => handleChange("type", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {RITUAL_TYPES.map(r => (
                <option key={r.id} value={r.id}>{r.label} (+{r.xp} XP)</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 italic">{ritualInfo.description}</p>
          </div>

          {/* Faction */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Faction</label>
            <div className="flex gap-2 flex-wrap">
              {FACTIONS.filter(f => f.id !== "all").map(f => (
                <button
                  key={f.id}
                  onClick={() => handleChange("faction", f.id)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: form.faction === f.id ? f.color + "33" : "transparent",
                    color: f.color,
                    border: `1px solid ${form.faction === f.id ? f.color : f.color + "44"}`,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Performer address */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Performer Address <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="0x…"
              value={form.performer}
              onChange={e => handleChange("performer", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Tx hash */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tx Hash (optional)</label>
            <input
              type="text"
              placeholder="0x… (leave blank for off-chain)"
              value={form.txHash}
              onChange={e => handleChange("txHash", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Charity amount (visible only for charity donation type) */}
          {form.type === "charity_donation" && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Charity Amount (ETH)</label>
              <input
                type="number"
                min="0"
                step="0.001"
                placeholder="0.00"
                value={form.charityAmount}
                onChange={e => handleChange("charityAmount", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Initial Status</label>
            <div className="flex gap-2">
              {["pending", "proven", "failed"].map(s => (
                <button
                  key={s}
                  onClick={() => handleChange("status", s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-all ${
                    form.status === s
                      ? s === "proven"  ? "bg-emerald-900 text-emerald-300 border-emerald-600"
                      : s === "failed"  ? "bg-red-900 text-red-300 border-red-600"
                      :                   "bg-yellow-900 text-yellow-300 border-yellow-600"
                      : "bg-transparent text-gray-500 border-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Note</label>
            <textarea
              rows={2}
              placeholder="Describe the rite performed…"
              value={form.note}
              onChange={e => handleChange("note", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.performer.trim()}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-purple-700 hover:bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <IconCheck size={14} /> Record Ritual
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const RitualTracker = () => {
  const [rituals, setRituals]           = useState(SEED_RITUALS);
  const [activeFaction, setActiveFaction] = useState("all");
  const [activeStatus, setActiveStatus]   = useState("all");
  const [showModal, setShowModal]         = useState(false);
  const [nextId, setNextId]               = useState(SEED_RITUALS.length + 1);

  // ── Derived stats ──────────────────────────────────────────────────────────

  const totalXP = useMemo(() => rituals.filter(r => r.status === "proven").reduce((s, r) => s + r.xp, 0), [rituals]);
  const totalCharity = useMemo(() => rituals.reduce((s, r) => s + r.charityAmount, 0), [rituals]);
  const provenCount  = useMemo(() => rituals.filter(r => r.status === "proven").length, [rituals]);
  const pendingCount = useMemo(() => rituals.filter(r => r.status === "pending").length, [rituals]);

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return rituals
      .filter(r => activeFaction === "all" || r.faction === activeFaction)
      .filter(r => activeStatus  === "all" || r.status  === activeStatus)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [rituals, activeFaction, activeStatus]);

  // ── Bar-chart data: XP per ritual type ────────────────────────────────────

  const chartData = useMemo(() => {
    return RITUAL_TYPES.map(rt => ({
      name:  rt.label.split(" ").slice(0, 2).join(" "),
      xp:    rituals.filter(r => r.type === rt.id && r.status === "proven").reduce((s, r) => s + r.xp, 0),
      count: rituals.filter(r => r.type === rt.id).length,
    }));
  }, [rituals]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddRitual = useCallback((data) => {
    setRituals(prev => [...prev, { ...data, id: nextId }]);
    setNextId(n => n + 1);
    setShowModal(false);
  }, [nextId]);

  const cycleStatus = useCallback((id) => {
    const order = ["pending", "proven", "failed"];
    setRituals(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next = order[(order.indexOf(r.status) + 1) % order.length];
      return { ...r, status: next };
    }));
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {showModal && (
        <LogRitualModal onClose={() => setShowModal(false)} onSubmit={handleAddRitual} />
      )}

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Ritual Tracker
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Ascendii Universe · AquaVitaRitual Contract · Nexus of Equity
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-sm font-semibold transition-all shadow-lg shadow-purple-900"
          >
            <IconPlus size={16} /> Log Ritual
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total XP Earned",     value: totalXP.toLocaleString(), icon: <IconStar size={20} />,    color: "text-yellow-400" },
          { label: "Proven Rituals",        value: provenCount,               icon: <IconCheck size={20} />,  color: "text-emerald-400" },
          { label: "Awaiting Proof",       value: pendingCount,              icon: <IconFlame size={20} />,  color: "text-yellow-400" },
          { label: "Charity (ETH)",        value: totalCharity.toFixed(3),   icon: <IconDroplet size={20} />, color: "text-blue-400" },
        ].map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-1">
            <div className={`${card.color} flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide`}>
              {card.icon} {card.label}
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
          </div>
        ))}
      </div>

      {/* XP Chart */}
      <div className="max-w-5xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">XP by Ritual Type (Proven)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#e5e7eb" }}
              itemStyle={{ color: "#a78bfa" }}
            />
            <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={["#a78bfa", "#f87171", "#34d399", "#60a5fa", "#fbbf24", "#fb7185"][i % 6]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto flex flex-wrap gap-3 mb-5">
        {/* Faction filter */}
        <div className="flex gap-1.5 flex-wrap">
          {FACTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFaction(f.id)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: activeFaction === f.id ? f.color + "33" : "transparent",
                color: activeFaction === f.id ? f.color : "#9ca3af",
                border: `1px solid ${activeFaction === f.id ? f.color : "#374151"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 ml-auto">
          {["all", "proven", "pending", "failed"].map(s => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all border ${
                activeStatus === s
                  ? "bg-purple-900 text-purple-300 border-purple-600"
                  : "text-gray-500 border-gray-700 hover:text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Ritual list */}
      <div className="max-w-5xl mx-auto space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600 text-sm">
            No rituals match this filter. Log one to begin.
          </div>
        )}

        {filtered.map(ritual => {
          const rType = ritualTypeById(ritual.type);
          return (
            <div
              key={ritual.id}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                {/* Left: meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-white font-semibold text-sm">{rType.label}</span>
                    <FactionBadge factionId={ritual.faction} />
                    <StatusBadge status={ritual.status} />
                  </div>

                  {ritual.note && (
                    <p className="text-gray-400 text-xs mb-2 italic">{ritual.note}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Performer: <span className="text-gray-300 font-mono">{formatAddress(ritual.performer)}</span></span>
                    {ritual.txHash && (
                      <span>Tx: <span className="text-indigo-400 font-mono">{formatAddress(ritual.txHash)}</span></span>
                    )}
                    {ritual.charityAmount > 0 && (
                      <span className="text-blue-400 flex items-center gap-1">
                        <IconDroplet size={11} />{ritual.charityAmount.toFixed(3)} ETH → Charity
                      </span>
                    )}
                    <span>{timeAgo(ritual.timestamp)}</span>
                  </div>
                </div>

                {/* Right: XP + action */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <div className={`text-lg font-bold ${ritual.status === "proven" ? "text-yellow-400" : "text-gray-600"}`}>
                    +{ritual.xp} <span className="text-xs font-normal">XP</span>
                  </div>
                  <button
                    onClick={() => cycleStatus(ritual.id)}
                    className="text-xs px-3 py-1 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                    title="Cycle status"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-10 text-center text-xs text-gray-700">
        Ascendii Universe · Nexus of Equity · "Every transaction is a transformation."
      </div>
    </div>
  );
};

// Export for module-based environments; also attach to window for CDN use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RitualTracker };
} else if (typeof window !== "undefined") {
  window.RitualTracker = RitualTracker;
}
