import React, { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = "Common" | "Uncommon" | "Rare" | "Legendary" | "Quest" | "Soulbound" | "Bundle";
type Category = "All" | "Components" | "Quest Items" | "NFTs" | "Bundles";

interface Item {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  icon: string;
  description: string;
  tier: Tier;
  xp: number;
  basePrice: number;
  slope: number;
  supply: number;
  impactTag: string | null;
  isFree?: boolean;
}

type CartState = Record<string, number>;

// ─── Catalogue Data ───────────────────────────────────────────────────────────

const CATEGORIES: Category[] = ["All", "Components", "Quest Items", "NFTs", "Bundles"];

/**
 * basePrice + slope × currentSupply  (linear bonding curve, same formula as
 * the economic simulator at Simulations/economic-simulator/index.html)
 */
const bondingPrice = (basePrice: number, slope: number, supply: number): number =>
  +(basePrice + slope * supply).toFixed(4);

const ITEMS: Item[] = [
  // ── Crafting Components ──────────────────────────────────────────────────────
  {
    id: "steel-ingot",
    name: "Steel Ingot",
    category: "Components",
    icon: "⚙️",
    description:
      "Core forging material. Mined across Ethereum and bridged via LayerZero.",
    tier: "Common",
    xp: 10,
    basePrice: 0.5,
    slope: 0.005,
    supply: 120,
    impactTag: null,
  },
  {
    id: "frost-crystal",
    name: "Frost Crystal",
    category: "Components",
    icon: "❄️",
    description:
      "Rare crystalline component harvested from cryo-layer sidechains.",
    tier: "Uncommon",
    xp: 25,
    basePrice: 1.2,
    slope: 0.012,
    supply: 60,
    impactTag: null,
  },
  {
    id: "void-essence",
    name: "Void Essence",
    category: "Components",
    icon: "🌀",
    description:
      "Distilled from cross-chain entropy. Required for VCE-tier crafts.",
    tier: "Rare",
    xp: 50,
    basePrice: 3.0,
    slope: 0.03,
    supply: 28,
    impactTag: null,
  },
  {
    id: "ember-shard",
    name: "Ember Shard",
    category: "Components",
    icon: "🔥",
    description:
      "Volatile heat-fragment. Boosts crafting success by +8% when paired with Steel.",
    tier: "Uncommon",
    xp: 20,
    basePrice: 0.9,
    slope: 0.009,
    supply: 85,
    impactTag: null,
  },

  // ── Quest Items (Trinity) ────────────────────────────────────────────────────
  {
    id: "aqua-vitae-kit",
    name: "Aqua Vitae Starter",
    category: "Quest Items",
    icon: "💧",
    description:
      "Initiates the Aqua Vitae quest. Contributes to funding one clean-water well. Requires 10,000 EffortTokens.",
    tier: "Quest",
    xp: 500,
    basePrice: 180,
    slope: 0.2,
    supply: 23,
    impactTag: "💧 Funds 1 well (charity:water)",
  },
  {
    id: "helios-bundle",
    name: "Helios Forge Bundle",
    category: "Quest Items",
    icon: "☀️",
    description:
      "Powers the Helios Forge quest. Channels solar energy to schools & clinics via GivePower.",
    tier: "Quest",
    xp: 500,
    basePrice: 220,
    slope: 0.2,
    supply: 11,
    impactTag: "☀️ Solar panels for 1 school (GivePower)",
  },
  {
    id: "arbor-vitae-seed",
    name: "Arbor Vitae Seed Kit",
    category: "Quest Items",
    icon: "🌳",
    description:
      "Unlocks the Arbor Vitae quest. Plants 10,000 trees and removes 500 tons CO₂ via Pachama.",
    tier: "Quest",
    xp: 500,
    basePrice: 250,
    slope: 0.2,
    supply: 7,
    impactTag: "🌳 10,000 trees + 500t CO₂ removed (Pachama)",
  },

  // ── NFTs ─────────────────────────────────────────────────────────────────────
  {
    id: "chronos-relic",
    name: "Chronos Relic",
    category: "NFTs",
    icon: "⏳",
    description:
      "ERC-721 Chronos Relic NFT. Tracks sell-count XP on-chain. Evolves: Rumor → Renown → Legendary.",
    tier: "Legendary",
    xp: 150,
    basePrice: 12.0,
    slope: 0.08,
    supply: 14,
    impactTag: null,
  },
  {
    id: "virtual-mall-guide",
    name: "Virtual Mall Guide",
    category: "NFTs",
    icon: "🏛️",
    description:
      "Soulbound governance NFT. Grants DAO voting rights and upgrades with earned XP. Non-transferable.",
    tier: "Soulbound",
    xp: 200,
    basePrice: 0,
    slope: 0,
    supply: 0,
    isFree: true,
    impactTag: "🗳️ Unlocks DAO voting",
  },

  // ── Bundles ──────────────────────────────────────────────────────────────────
  {
    id: "forger-starter-pack",
    name: "Forger's Starter Pack",
    category: "Bundles",
    icon: "🧰",
    description:
      "5× Steel Ingot + 2× Ember Shard + 1× Frost Crystal. Best value for new crafters.",
    tier: "Bundle",
    xp: 95,
    basePrice: 4.5,
    slope: 0.015,
    supply: 40,
    impactTag: null,
  },
  {
    id: "trinity-ascension-pack",
    name: "Trinity Ascension Pack",
    category: "Bundles",
    icon: "∞",
    description:
      "All three Trinity quest items bundled. Unlocks Architect of Ascension status upon completion.",
    tier: "Legendary",
    xp: 1500,
    basePrice: 600,
    slope: 0.5,
    supply: 7,
    impactTag: "🌍 Full trinity impact: 1 well + 1 school + 10,000 trees",
  },
];

// ─── Tier badge colours ────────────────────────────────────────────────────────

interface TierStyle {
  bg: string;
  border: string;
  text: string;
}

const TIER_STYLE: Record<Tier, TierStyle> = {
  Common:    { bg: "#1a1a1a", border: "#555",    text: "#aaa"     },
  Uncommon:  { bg: "#0d2200", border: "#33cc33", text: "#33cc33"  },
  Rare:      { bg: "#0a0022", border: "#9966ff", text: "#bb88ff"  },
  Legendary: { bg: "#220d00", border: "#ff9900", text: "#ffb347"  },
  Quest:     { bg: "#002233", border: "#00ccff", text: "#66ddff"  },
  Soulbound: { bg: "#1a0022", border: "#cc33ff", text: "#ee88ff"  },
  Bundle:    { bg: "#001a1a", border: "#00ff88", text: "#00ff88"  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

interface TierBadgeProps {
  tier: Tier;
}

function TierBadge({ tier }: TierBadgeProps): React.ReactElement {
  const s = TIER_STYLE[tier] ?? TIER_STYLE.Common;
  return (
    <span
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: "0.7rem",
        fontWeight: "bold",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {tier}
    </span>
  );
}

interface ItemCardProps {
  item: Item;
  onBuy: (item: Item) => void;
  cartQty: number;
}

function ItemCard({ item, onBuy, cartQty }: ItemCardProps): React.ReactElement {
  const livePrice = item.isFree
    ? "Free (earn via quests)"
    : `${bondingPrice(item.basePrice, item.slope, item.supply)} ETH`;

  const borderColor =
    cartQty > 0
      ? "#00ff88"
      : (TIER_STYLE[item.tier] ?? TIER_STYLE.Common).border;

  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow:
          cartQty > 0 ? "0 0 16px rgba(0,255,136,0.25)" : "none",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "2rem" }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "#00ff88",
              fontWeight: "bold",
              fontSize: "1rem",
              marginBottom: 2,
            }}
          >
            {item.name}
          </div>
          <TierBadge tier={item.tier} />
        </div>
        {cartQty > 0 && (
          <span
            style={{
              background: "#00ff88",
              color: "#000",
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.75rem",
              flexShrink: 0,
            }}
          >
            {cartQty}
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          color: "#888",
          fontSize: "0.82rem",
          margin: 0,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {item.description}
      </p>

      {/* Impact tag */}
      {item.impactTag && (
        <div
          style={{
            background: "#0a1f0a",
            border: "1px solid #1a4a1a",
            borderRadius: 8,
            padding: "5px 10px",
            color: "#66cc66",
            fontSize: "0.75rem",
          }}
        >
          {item.impactTag}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <div>
          <div style={{ color: "#00ff88", fontWeight: "bold", fontSize: "0.95rem" }}>
            {livePrice}
          </div>
          <div style={{ color: "#555", fontSize: "0.72rem" }}>
            +{item.xp} XP · Supply: {item.supply}
          </div>
        </div>
        <button
          onClick={() => onBuy(item)}
          disabled={item.isFree}
          style={{
            background: item.isFree ? "#222" : "#00ff88",
            color: item.isFree ? "#555" : "#000",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: "bold",
            fontSize: "0.85rem",
            cursor: item.isFree ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {item.isFree ? "Earn via quests" : "Buy"}
        </button>
      </div>
    </div>
  );
}

interface CartPanelProps {
  cart: CartState;
  items: Item[];
  onRemove: (itemId: string) => void;
  onConfirm: () => void;
  walletConnected: boolean;
}

function CartPanel({ cart, items, onRemove, onConfirm, walletConnected }: CartPanelProps): React.ReactElement {
  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: items.find((i) => i.id === id) as Item, qty }));

  const totalEth = cartItems.reduce((sum, { item, qty }) => {
    if (item.isFree) return sum;
    let cost = 0;
    for (let i = 0; i < qty; i++) {
      cost += bondingPrice(item.basePrice, item.slope, item.supply + i);
    }
    return sum + cost;
  }, 0);

  const totalXp = cartItems.reduce(
    (sum, { item, qty }) => sum + item.xp * qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 14,
          padding: 20,
          color: "#444",
          textAlign: "center",
          fontSize: "0.85rem",
        }}
      >
        🛒 Your cart is empty
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #00ff88",
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{ color: "#00ff88", fontWeight: "bold", fontSize: "1rem" }}
      >
        🛒 Cart
      </div>

      {cartItems.map(({ item, qty }) => {
        let itemCost = 0;
        for (let i = 0; i < qty; i++) {
          itemCost += bondingPrice(item.basePrice, item.slope, item.supply + i);
        }
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.82rem",
              color: "#aaa",
              borderBottom: "1px solid #222",
              paddingBottom: 8,
            }}
          >
            <span>
              {item.icon} {item.name} ×{qty}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#00ff88" }}>
                {item.isFree ? "Free" : `${itemCost.toFixed(4)} ETH`}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#cc3333",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          color: "#888",
        }}
      >
        <span>Total XP earned</span>
        <span style={{ color: "#00ff88" }}>+{totalXp} XP</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          color: "#fff",
          fontSize: "1rem",
        }}
      >
        <span>Total</span>
        <span style={{ color: "#00ff88" }}>{totalEth.toFixed(4)} ETH</span>
      </div>

      <button
        onClick={onConfirm}
        disabled={!walletConnected}
        style={{
          background: walletConnected ? "#00ff88" : "#1a2a1a",
          color: walletConnected ? "#000" : "#446644",
          border: "none",
          borderRadius: 10,
          padding: "12px 0",
          fontWeight: "bold",
          fontSize: "0.95rem",
          cursor: walletConnected ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}
      >
        {walletConnected ? "⚒ Confirm Purchase" : "Connect Wallet to Buy"}
      </button>
    </div>
  );
}

// ─── Main ShopWindow component ─────────────────────────────────────────────────

export default function ShopWindow(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState<string>("");
  const [cart, setCart] = useState<CartState>({});
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [effortBalance, setEffortBalance] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string): void => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnectWallet = (): void => {
    const mockAddress = "0xA4c2…3F9e";
    const mockEffort = 12_450;
    setWalletConnected(true);
    setWalletAddress(mockAddress);
    setEffortBalance(mockEffort);
    showToast("✅ Wallet connected: " + mockAddress);
  };

  const handleBuy = (item: Item): void => {
    if (item.isFree) return;
    if (!walletConnected) {
      showToast("⚠️ Connect your wallet first.");
      return;
    }
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string): void => {
    setCart((prev) => {
      const next = { ...prev };
      if ((next[itemId] ?? 0) > 1) {
        next[itemId]--;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const handleConfirm = (): void => {
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    showToast(`⚒ ${count} item(s) sent to the Nexus Forge. Awaiting chain confirmation…`);
    setCart({});
  };

  const filteredItems = useMemo<Item[]>(() => {
    return ITEMS.filter((item) => {
      const matchCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#00ff88",
        fontFamily: "'Courier New', monospace",
        padding: "32px 20px",
      }}
    >
      {/* ── Toast notification ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            border: "1px solid #00ff88",
            borderRadius: 10,
            padding: "12px 24px",
            color: "#00ff88",
            fontSize: "0.85rem",
            zIndex: 1000,
            boxShadow: "0 0 20px rgba(0,255,136,0.3)",
          }}
        >
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              margin: 0,
              textShadow: "0 0 10px #00ff88",
            }}
          >
            INTERLINK EXCHANGE
          </h1>
          <p style={{ color: "#556655", margin: "4px 0 0", fontSize: "0.85rem" }}>
            Where effort becomes essence · Bonding-curve pricing · Cross-chain
          </p>
        </div>

        {walletConnected ? (
          <div
            style={{
              background: "#0a1a0a",
              border: "1px solid #00ff88",
              borderRadius: 10,
              padding: "10px 18px",
              textAlign: "right",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ color: "#00ff88", fontWeight: "bold" }}>
              {walletAddress}
            </div>
            <div style={{ color: "#556655" }}>
              ⚡ {effortBalance.toLocaleString()} EffortTokens
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            style={{
              background: "#00ff88",
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ── Main layout ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* ── Left: catalogue ── */}
        <div>
          {/* Search + filters */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 180,
                background: "#111",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "9px 14px",
                color: "#00ff88",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? "#00ff88" : "#111",
                  color: activeCategory === cat ? "#000" : "#556655",
                  border: `1px solid ${activeCategory === cat ? "#00ff88" : "#333"}`,
                  borderRadius: 8,
                  padding: "9px 16px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  fontWeight: activeCategory === cat ? "bold" : "normal",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Item grid */}
          {filteredItems.length === 0 ? (
            <div
              style={{
                color: "#333",
                textAlign: "center",
                padding: "60px 0",
                fontSize: "0.9rem",
              }}
            >
              No items match your search.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onBuy={handleBuy}
                  cartQty={cart[item.id] ?? 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: cart ── */}
        <div style={{ position: "sticky", top: 24 }}>
          {cartCount > 0 && (
            <div
              style={{
                background: "#0a1a0a",
                border: "1px solid #1a4a1a",
                borderRadius: 10,
                padding: "8px 14px",
                marginBottom: 12,
                color: "#66cc66",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
            </div>
          )}
          <CartPanel
            cart={cart}
            items={ITEMS}
            onRemove={handleRemoveFromCart}
            onConfirm={handleConfirm}
            walletConnected={walletConnected}
          />

          {/* Real-world impact counter */}
          <div
            style={{
              marginTop: 20,
              background: "#0a1a0a",
              border: "1px solid #1a4a1a",
              borderRadius: 14,
              padding: 16,
              fontSize: "0.78rem",
              color: "#556655",
            }}
          >
            <div
              style={{
                color: "#66cc66",
                fontWeight: "bold",
                marginBottom: 8,
                fontSize: "0.82rem",
              }}
            >
              🌍 Live Worldshaper Counter
            </div>
            <div>💧 23 wells funded</div>
            <div>☀️ 11 schools powered</div>
            <div>🌳 147,000 trees planted</div>
            <div>🌫️ 1,835 tons CO₂ removed</div>
            <div style={{ marginTop: 8, color: "#00ff88" }}>
              $487,500 real-world value
            </div>
          </div>
        </div>
      </div>

      <footer
        style={{
          maxWidth: 1100,
          margin: "48px auto 0",
          textAlign: "center",
          color: "#333",
          fontSize: "0.8rem",
        }}
      >
        The Interlink Exchange — Where effort becomes essence. · MIT License
      </footer>
    </div>
  );
}
