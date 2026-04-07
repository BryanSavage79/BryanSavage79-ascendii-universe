import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Zone {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  tier: number;
  effortRequired: number;
  successRate?: number;
  description: string;
  features: string[];
  realWorldImpact?: string;
  chains?: string[];
  category: "trinity" | "faction" | "nexus" | "onboarding";
}

// ─── Zone Data ────────────────────────────────────────────────────────────────

const ZONES: Zone[] = [
  // Onboarding
  {
    id: "initiation",
    name: "The Initiation Hall",
    subtitle: "Where new shepherds enter the Nexus",
    emoji: "🔰",
    accentColor: "#aaaaff",
    tier: 0,
    effortRequired: 0,
    description:
      "Open to all. Complete your First Offering, map the Confluence, and swear the Oath of Contribution to earn your Initiate badge and begin accumulating Effort Points.",
    features: [
      "First Offering — 50 XP + Initiate badge",
      "Map the Confluence — 120 XP + Wayfinder badge",
      "Oath of Contribution — 300 XP + Contributor badge",
      "Lifestyle Rewards: meetups, research, volunteer hours",
    ],
    category: "onboarding",
  },
  // Trinity Zones
  {
    id: "aqua-vitae",
    name: "Aqua Vitae",
    subtitle: "Zone of Living Water",
    emoji: "💧",
    accentColor: "#00cfff",
    tier: 1,
    effortRequired: 10000,
    successRate: 67,
    description:
      "The first great trial. Cross five chains, gather components of Water, and invoke the Wellspring of Eternity. Every successful craft funds a clean-water well for a village in need.",
    features: [
      "10,000 Effort Points required",
      "5+ chains bridged via LayerZero",
      "Soulbound gate: help another player ascend",
      "Craft reward: Wellspring of Eternity (ERC-721)",
    ],
    realWorldImpact: "Funds 1 clean-water well (~$180–220) via charity:water",
    chains: ["Ethereum", "Solana", "Polygon", "Arbitrum", "Optimism"],
    category: "trinity",
  },
  {
    id: "helios-forge",
    name: "Helios Forge",
    subtitle: "Zone of Solar Fire",
    emoji: "☀️",
    accentColor: "#ffdd00",
    tier: 2,
    effortRequired: 10000,
    successRate: 65,
    description:
      "The second crucible. Harness the bonding curve of Solarbeam Tokens and ignite the Eternal Dawnbringer. Victory lights a solar panel for a school or clinic.",
    features: [
      "10,000+ Effort Points required",
      "Stake your rarest component (soulbound gate)",
      "Bonding curve pricing via BondingCurveToken.sol",
      "Craft reward: Eternal Dawnbringer (ERC-721)",
    ],
    realWorldImpact: "Solar panels for 1 school/clinic (~$220–280) via GivePower",
    chains: ["Ethereum", "Solana", "Avalanche", "BNB Chain", "Base"],
    category: "trinity",
  },
  {
    id: "arbor-vitae",
    name: "Arbor Vitae",
    subtitle: "Zone of Living Wood",
    emoji: "🌳",
    accentColor: "#00ff88",
    tier: 3,
    effortRequired: 10000,
    successRate: 63,
    description:
      "The final trial of the Trinity. Interweave nature-components across realms and awaken Yggdrasil Ascendant — an NFT that literally grows as real trees grow each year.",
    features: [
      "10,000+ Effort Points + prior Helios Forge",
      "Evolving NFT — metadata updates yearly",
      "ZK-proof of real-world contribution required",
      "Craft reward: Yggdrasil Ascendant (Evolving ERC-721)",
    ],
    realWorldImpact: "10,000 trees planted + 500 tons CO₂ removed (~$250–320) via Pachama",
    chains: ["Ethereum", "Solana", "Polygon", "Optimism", "Celo"],
    category: "trinity",
  },
  {
    id: "architect",
    name: "Architect of Ascension",
    subtitle: "Transcendent Status — The Eternal Seat",
    emoji: "♾️",
    accentColor: "#ff88ff",
    tier: 4,
    effortRequired: 0,
    successRate: 100,
    description:
      "Complete all three Trinity quests to attain Transcendent Status. Architects hold lifetime treasury voting rights and receive 3× perpetual yield from the DAO.",
    features: [
      "Requires: Aqua Vitae + Helios Forge + Arbor Vitae",
      "Lifetime DAO treasury voting",
      "3× perpetual yield",
      "Name immortalized in the Codex",
    ],
    realWorldImpact: "$650+ total impact: 1 village hydrated, 1 school lit, 10,000 trees alive",
    category: "trinity",
  },
  // Faction Zones
  {
    id: "bladesong",
    name: "The Bladesong Forges",
    subtitle: "Fast blades, faster crafts",
    emoji: "⚔️",
    accentColor: "#ff4444",
    tier: 1,
    effortRequired: 500,
    description:
      "Join the most aggressive faction in the Nexus. Bladesong forgers sprint through crafts at maximum speed, gaining attack modifiers but sacrificing ritual patience.",
    features: [
      "Ritual signature: Edge",
      "Strengths: crafting speed, attack modifiers",
      "Weaknesses: defense, ritual patience",
      "Tribunal role: front-line enforcers",
    ],
    category: "faction",
  },
  {
    id: "wardens",
    name: "The Wardens Sanctum",
    subtitle: "Custodians of Balance",
    emoji: "🛡️",
    accentColor: "#4488ff",
    tier: 1,
    effortRequired: 500,
    description:
      "The Wardens hold the line. Masters of defensive auras and safety rituals, they are the backbone of any long-term crafting coalition.",
    features: [
      "Ritual signature: Shield",
      "Strengths: defensive auras, safety rituals",
      "Weaknesses: rapid expansion",
      "Tribunal role: mediators and peacekeepers",
    ],
    category: "faction",
  },
  {
    id: "loom",
    name: "The Loom Athenaeum",
    subtitle: "Weavers of Fate",
    emoji: "🕸️",
    accentColor: "#cc88ff",
    tier: 1,
    effortRequired: 500,
    description:
      "The Loom shapes probability itself. Through artifact synergy and fate-weaving, they nudge success rates in ways that baffle even the Chainlink oracle.",
    features: [
      "Ritual signature: Weave",
      "Strengths: probability shaping, artifact synergy",
      "Weaknesses: direct combat",
      "Tribunal role: analysts and arbiters",
    ],
    category: "faction",
  },
  // Nexus Hub
  {
    id: "nexus-temple",
    name: "The Nexus Temple",
    subtitle: "Cross-Chain Forge — Heart of Interlink",
    emoji: "🔮",
    accentColor: "#00ff88",
    tier: 0,
    effortRequired: 0,
    description:
      "The convergence point of all chains. The Nexus Temple houses the CrossChainForge contract, the bonding curve markets, and the LayerZero bridge endpoints. All crafting journeys pass through here.",
    features: [
      "CrossChainForge.sol — probabilistic ERC-721 minting",
      "BondingCurveToken.sol — instant component pricing",
      "LayerZero bridge — component portability",
      "Chainlink VRF — verifiable randomness for success rolls",
      "2% flow fee → DAO treasury",
    ],
    chains: ["Ethereum (Sepolia)", "Mumbai"],
    category: "nexus",
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLE = {
  root: {
    margin: 0,
    padding: "32px 20px",
    fontFamily: "'Courier New', monospace",
    background: "#0a0a0a",
    color: "#00ff88",
    minHeight: "100vh",
  } as React.CSSProperties,

  header: {
    textAlign: "center" as const,
    marginBottom: 40,
  },

  title: {
    fontSize: "2.6em",
    margin: "0 0 8px",
    textShadow: "0 0 14px #00ff88",
  },

  subtitle: {
    opacity: 0.7,
    fontSize: "1.1em",
    marginBottom: 32,
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap" as const,
    marginBottom: 40,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
    maxWidth: 1200,
    margin: "0 auto",
  },

  footer: {
    textAlign: "center" as const,
    marginTop: 60,
    opacity: 0.5,
    fontSize: "0.85em",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#00ff88" : "transparent",
        color: active ? "#000" : "#00ff88",
        border: "2px solid #00ff88",
        borderRadius: 8,
        padding: "8px 20px",
        fontFamily: "'Courier New', monospace",
        fontWeight: "bold",
        fontSize: "0.95em",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: active ? "0 0 14px rgba(0,255,136,0.5)" : "none",
      }}
    >
      {label}
    </button>
  );
}

interface ZoneCardProps {
  zone: Zone;
}

function ZoneCard({ zone }: ZoneCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        border: `2px solid ${zone.accentColor}`,
        borderRadius: 16,
        padding: "20px 24px",
        background: "#111",
        boxShadow: `0 0 18px ${zone.accentColor}30`,
        transition: "box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "2em" }}>{zone.emoji}</span>
        <div>
          <div
            style={{
              color: zone.accentColor,
              fontWeight: "bold",
              fontSize: "1.15em",
              textShadow: `0 0 8px ${zone.accentColor}`,
            }}
          >
            {zone.name}
          </div>
          <div style={{ opacity: 0.6, fontSize: "0.85em" }}>{zone.subtitle}</div>
        </div>
        {zone.successRate !== undefined && (
          <div
            style={{
              marginLeft: "auto",
              fontSize: "0.8em",
              color: zone.accentColor,
              border: `1px solid ${zone.accentColor}`,
              borderRadius: 6,
              padding: "2px 8px",
              whiteSpace: "nowrap",
            }}
          >
            {zone.successRate}% base
          </div>
        )}
      </div>

      {/* Tier + EP badges */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge label={`Tier ${zone.tier}`} color={zone.accentColor} />
        {zone.effortRequired > 0 && (
          <Badge label={`${zone.effortRequired.toLocaleString()} EP`} color={zone.accentColor} />
        )}
        {zone.chains && zone.chains.length > 0 && (
          <Badge label={`${zone.chains.length} chains`} color={zone.accentColor} />
        )}
      </div>

      {/* Description */}
      <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.9em", opacity: 0.85 }}>
        {zone.description}
      </p>

      {/* Real-world impact */}
      {zone.realWorldImpact && (
        <div
          style={{
            background: "#0a0a0a",
            border: `1px solid ${zone.accentColor}55`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: "0.82em",
            color: zone.accentColor,
          }}
        >
          🌍 {zone.realWorldImpact}
        </div>
      )}

      {/* Toggle features */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          background: "transparent",
          border: `1px solid ${zone.accentColor}66`,
          color: zone.accentColor,
          borderRadius: 6,
          padding: "6px 12px",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.82em",
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        {expanded ? "▲ Hide details" : "▼ Show details"}
      </button>

      {expanded && (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.87em", lineHeight: 1.8, opacity: 0.85 }}>
          {zone.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
          {zone.chains && (
            <li>
              <strong>Chains:</strong> {zone.chains.join(" · ")}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

interface BadgeProps {
  label: string;
  color: string;
}

function Badge({ label, color }: BadgeProps) {
  return (
    <span
      style={{
        border: `1px solid ${color}`,
        color,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: "0.75em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Category config ──────────────────────────────────────────────────────────

type Category = "all" | "trinity" | "faction" | "nexus" | "onboarding";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "🗺 All Zones" },
  { id: "onboarding", label: "🔰 Initiation" },
  { id: "trinity", label: "💧☀️🌳 Trinity Path" },
  { id: "faction", label: "⚔️ Factions" },
  { id: "nexus", label: "🔮 Nexus" },
];

// ─── Main Layout Component ────────────────────────────────────────────────────

export default function ZoneLayout() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const visibleZones =
    activeCategory === "all"
      ? ZONES
      : ZONES.filter((z) => z.category === activeCategory);

  return (
    <div style={STYLE.root}>
      {/* Header */}
      <header style={STYLE.header}>
        <h1 style={STYLE.title}>ASCENDII UNIVERSE</h1>
        <p style={STYLE.subtitle}>
          Zone Map — Craft legends. Bridge realms. Own your myth.
        </p>

        {/* Live counter strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            fontSize: "0.82em",
            opacity: 0.7,
            marginBottom: 8,
          }}
        >
          <span>💧 23 wells funded</span>
          <span>☀️ 11 schools powered</span>
          <span>🌳 147,000 trees planted</span>
          <span>🌍 1,835 t CO₂ removed</span>
          <span>♾️ 7 Architects ascended</span>
        </div>
      </header>

      {/* Category tabs */}
      <nav style={STYLE.tabs}>
        {CATEGORIES.map(({ id, label }) => (
          <TabButton
            key={id}
            label={label}
            active={activeCategory === id}
            onClick={() => setActiveCategory(id)}
          />
        ))}
      </nav>

      {/* Zone grid */}
      <main style={STYLE.grid}>
        {visibleZones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </main>

      {/* Footer */}
      <footer style={STYLE.footer}>
        <p>
          The Interlink Exchange — Where effort becomes essence. ∞
          <br />
          Live on Sepolia + Mumbai • MIT License
        </p>
      </footer>
    </div>
  );
}
