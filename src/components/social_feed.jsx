import React, { useState, useEffect, useCallback } from "react";

// ─── Theme constants (mirrors docs/Index.html palette) ────────────────────────
const GLOW = "#00ff88";
const BG = "#0a0a0a";
const SURFACE = "#111111";
const MUTED = "#1a1a1a";
const TEXT_DIM = "rgba(0,255,136,0.55)";

// ─── Event type metadata ───────────────────────────────────────────────────────
const EVENT_META = {
  craft:   { icon: "⚒️",  label: "Crafted",       color: "#00ff88" },
  mint:    { icon: "🔮",  label: "Minted",        color: "#a78bfa" },
  quest:   { icon: "📜",  label: "Quest",         color: "#fbbf24" },
  impact:  { icon: "🌍",  label: "Impact",        color: "#34d399" },
  faction: { icon: "⚔️",  label: "Faction",       color: "#f87171" },
  rank:    { icon: "🏆",  label: "Rank Up",       color: "#60a5fa" },
};

// ─── Sample seed events ────────────────────────────────────────────────────────
const SEED_EVENTS = [
  {
    id: 1,
    type: "impact",
    user: "Architect_Zara",
    message: "Well #24 funded — a village in Ghana now has clean water. 💧",
    timestamp: Date.now() - 1000 * 60 * 2,
    xp: null,
    badge: "Worldshaper",
  },
  {
    id: 2,
    type: "mint",
    user: "FrostForge_Kael",
    message: "Minted the Wellspring of Eternity (Stage 1 Trinity NFT) on Sepolia.",
    timestamp: Date.now() - 1000 * 60 * 8,
    xp: 500,
    badge: null,
  },
  {
    id: 3,
    type: "craft",
    user: "SteelSage_Mira",
    message: "Forged a Renown-tier Blade of Confluence using 3,200 Effort Tokens.",
    timestamp: Date.now() - 1000 * 60 * 15,
    xp: 320,
    badge: null,
  },
  {
    id: 4,
    type: "quest",
    user: "InitiateOren",
    message: 'Completed "Oath of Contribution" — PR merged into Interlink Protocol.',
    timestamp: Date.now() - 1000 * 60 * 30,
    xp: 300,
    badge: "Contributor",
  },
  {
    id: 5,
    type: "faction",
    user: "Verdant_Council",
    message: "Faction balance reweighted: Nature faction claims 34% of forge power this cycle.",
    timestamp: Date.now() - 1000 * 60 * 45,
    xp: null,
    badge: null,
  },
  {
    id: 6,
    type: "impact",
    user: "HeliosHarbinger_Sol",
    message: "Solar panels activated at Kigali clinic — School #12 powered via GivePower. ☀️",
    timestamp: Date.now() - 1000 * 60 * 60,
    xp: null,
    badge: "Lightbringer",
  },
  {
    id: 7,
    type: "rank",
    user: "CrystalKnight_Dax",
    message: "Ascended to Renown tier — item XP threshold 100 reached.",
    timestamp: Date.now() - 1000 * 60 * 90,
    xp: 150,
    badge: "Renown",
  },
  {
    id: 8,
    type: "craft",
    user: "RuneWarden_Lys",
    message: "Crafted Eternal Dawnbringer (Stage 2 Trinity) — 65% success roll cleared.",
    timestamp: Date.now() - 1000 * 60 * 120,
    xp: 700,
    badge: null,
  },
];

// ─── Live ticker lines (simulated chain events) ────────────────────────────────
const TICKER_LINES = [
  "⚒️  ShadowBladeNova crafted Steel Ingot Bundle  •  +40 XP",
  "🌿  147,000 trees planted — Pachama co2 tracker updated",
  "🔮  New VCE item minted on Mumbai testnet",
  "⚔️  Faction war simulation round 7 complete",
  "💧  Well #24 confirmed on-chain by charity:water oracle",
  "📜  Quest 'Map the Confluence' completed by 3 new initiates",
  "🏆  IronPilgrim_Ax reached Legendary tier (XP: 150)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function generateId() {
  return Date.now() + Math.random();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Ticker({ lines }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [lines.length]);

  return (
    <div style={styles.ticker}>
      <span style={styles.tickerLabel}>LIVE</span>
      <span style={styles.tickerText}>{lines[index]}</span>
    </div>
  );
}

function FilterBar({ active, onChange }) {
  const filters = ["all", ...Object.keys(EVENT_META)];
  return (
    <div style={styles.filterBar}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            ...styles.filterBtn,
            ...(active === f ? styles.filterBtnActive : {}),
          }}
        >
          {f === "all" ? "🌐 All" : `${EVENT_META[f].icon} ${EVENT_META[f].label}`}
        </button>
      ))}
    </div>
  );
}

function FeedCard({ event, isNew }) {
  const meta = EVENT_META[event.type] || EVENT_META.craft;
  return (
    <div
      style={{
        ...styles.card,
        borderColor: isNew ? meta.color : "rgba(0,255,136,0.15)",
        boxShadow: isNew ? `0 0 14px ${meta.color}44` : "none",
        transition: "border-color 0.6s ease, box-shadow 0.6s ease",
      }}
    >
      <div style={styles.cardHeader}>
        <span style={{ ...styles.eventIcon, color: meta.color }}>{meta.icon}</span>
        <span style={{ ...styles.eventLabel, color: meta.color }}>{meta.label.toUpperCase()}</span>
        <span style={styles.cardTime}>{timeAgo(event.timestamp)}</span>
      </div>

      <div style={styles.cardUser}>
        <span style={styles.avatar}>{event.user[0].toUpperCase()}</span>
        <strong style={styles.username}>{event.user}</strong>
        {event.badge && <span style={styles.badge}>{event.badge}</span>}
      </div>

      <p style={styles.cardMessage}>{event.message}</p>

      {event.xp !== null && (
        <div style={styles.xpChip}>+{event.xp} XP</div>
      )}
    </div>
  );
}

function ImpactCounter() {
  const stats = [
    { icon: "💧", value: "24", label: "Wells funded" },
    { icon: "☀️", value: "12", label: "Schools powered" },
    { icon: "🌳", value: "147K", label: "Trees planted" },
    { icon: "💨", value: "1,835t", label: "CO₂ removed" },
  ];

  return (
    <div style={styles.impactBar}>
      {stats.map((s) => (
        <div key={s.label} style={styles.impactStat}>
          <span style={styles.impactIcon}>{s.icon}</span>
          <span style={styles.impactValue}>{s.value}</span>
          <span style={styles.impactLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SocialFeed() {
  const [events, setEvents] = useState(SEED_EVENTS);
  const [newIds, setNewIds] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);

  // Simulate incoming events every ~12 s when not paused
  const pushRandomEvent = useCallback(() => {
    const types = Object.keys(EVENT_META);
    const type = types[Math.floor(Math.random() * types.length)];
    const users = [
      "Nexus_Pilgrim", "VoidCrafter_X", "LuminaryEden", "IronShepherd",
      "CrystalCadet_7", "AquaVitae_Liv", "SolarSage_Ren", "TreeWarden_Moss",
    ];
    const messages = {
      craft: "Forged a new component bundle at the Nexus forge.",
      mint:  "Minted a new NFT on the cross-chain Interlink Exchange.",
      quest: "Completed a community quest and earned a badge.",
      impact:  "Contributed to a real-world impact event through the Trinity path.",
      faction: "Faction power shifted — a new alliance forms in the Nexus.",
      rank:  "Crossed an XP threshold and ascended to a higher tier.",
    };

    const id = generateId();
    const newEvent = {
      id,
      type,
      user: users[Math.floor(Math.random() * users.length)],
      message: messages[type],
      timestamp: Date.now(),
      xp: ["craft", "quest", "rank", "mint"].includes(type)
        ? Math.floor(Math.random() * 500 + 50)
        : null,
      badge: Math.random() > 0.7 ? "Initiate" : null,
    };

    setEvents((prev) => [newEvent, ...prev].slice(0, 50));
    setNewIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(pushRandomEvent, 12000);
    return () => clearInterval(timer);
  }, [paused, pushRandomEvent]);

  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>⚡ Nexus Feed</h2>
        <p style={styles.subtitle}>Live crafting, quests &amp; impact across the Ascendii Universe</p>
        <button
          onClick={() => setPaused((p) => !p)}
          style={{ ...styles.pauseBtn, opacity: paused ? 1 : 0.7 }}
          title={paused ? "Resume live updates" : "Pause live updates"}
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>

      {/* Live ticker */}
      <Ticker lines={TICKER_LINES} />

      {/* Impact counter */}
      <ImpactCounter />

      {/* Filter bar */}
      <FilterBar active={filter} onChange={setFilter} />

      {/* Feed */}
      <div style={styles.feed}>
        {filtered.length === 0 && (
          <p style={styles.empty}>No events of this type yet — check back soon.</p>
        )}
        {filtered.map((event) => (
          <FeedCard key={event.id} event={event} isNew={newIds.has(event.id)} />
        ))}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    background: BG,
    color: GLOW,
    fontFamily: "'Courier New', Courier, monospace",
    minHeight: "100vh",
    padding: "24px 16px",
    maxWidth: 760,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 8,
    position: "relative",
  },
  title: {
    fontSize: "2em",
    margin: "0 0 4px",
    textShadow: `0 0 12px ${GLOW}`,
  },
  subtitle: {
    color: TEXT_DIM,
    fontSize: "0.9em",
    margin: "0 0 8px",
  },
  pauseBtn: {
    background: "transparent",
    border: `1px solid ${GLOW}`,
    color: GLOW,
    borderRadius: 8,
    padding: "4px 14px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.8em",
  },
  ticker: {
    background: MUTED,
    border: `1px solid rgba(0,255,136,0.2)`,
    borderRadius: 8,
    padding: "8px 14px",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
  },
  tickerLabel: {
    background: GLOW,
    color: BG,
    fontWeight: "bold",
    fontSize: "0.7em",
    padding: "2px 6px",
    borderRadius: 4,
    flexShrink: 0,
    animation: "pulse 1.5s infinite",
  },
  tickerText: {
    fontSize: "0.85em",
    color: TEXT_DIM,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  impactBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 16,
  },
  impactStat: {
    background: SURFACE,
    border: `1px solid rgba(0,255,136,0.2)`,
    borderRadius: 10,
    padding: "8px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 80,
  },
  impactIcon: { fontSize: "1.3em" },
  impactValue: { fontWeight: "bold", fontSize: "1.1em", color: GLOW },
  impactLabel: { fontSize: "0.7em", color: TEXT_DIM, marginTop: 2 },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  filterBtn: {
    background: "transparent",
    border: `1px solid rgba(0,255,136,0.25)`,
    color: TEXT_DIM,
    borderRadius: 20,
    padding: "4px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.78em",
    transition: "all 0.2s",
  },
  filterBtnActive: {
    background: GLOW,
    border: `1px solid ${GLOW}`,
    color: BG,
    fontWeight: "bold",
    boxShadow: `0 0 8px ${GLOW}66`,
  },
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    background: SURFACE,
    border: "1px solid rgba(0,255,136,0.15)",
    borderRadius: 12,
    padding: "14px 18px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  eventIcon: { fontSize: "1.1em" },
  eventLabel: {
    fontSize: "0.7em",
    fontWeight: "bold",
    letterSpacing: "0.08em",
  },
  cardTime: {
    marginLeft: "auto",
    fontSize: "0.72em",
    color: TEXT_DIM,
  },
  cardUser: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    background: "rgba(0,255,136,0.12)",
    border: `1px solid rgba(0,255,136,0.3)`,
    borderRadius: "50%",
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85em",
    fontWeight: "bold",
    color: GLOW,
    flexShrink: 0,
  },
  username: {
    fontSize: "0.88em",
    color: GLOW,
  },
  badge: {
    background: "rgba(167,139,250,0.15)",
    border: "1px solid rgba(167,139,250,0.4)",
    color: "#a78bfa",
    borderRadius: 12,
    padding: "1px 8px",
    fontSize: "0.68em",
    fontWeight: "bold",
    letterSpacing: "0.05em",
  },
  cardMessage: {
    margin: "0 0 8px",
    fontSize: "0.88em",
    color: "rgba(0,255,136,0.8)",
    lineHeight: 1.5,
  },
  xpChip: {
    display: "inline-block",
    background: "rgba(0,255,136,0.08)",
    border: `1px solid rgba(0,255,136,0.3)`,
    color: GLOW,
    borderRadius: 10,
    padding: "2px 10px",
    fontSize: "0.75em",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: TEXT_DIM,
    fontSize: "0.9em",
    padding: "40px 0",
  },
};
