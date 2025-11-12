# CraftableNFT — Proof of Concept (Ascendii Universe)

This repository submodule demonstrates the **core economic and interactive logic** of the Ascendii Universe ecosystem. It integrates a **bonding-curve ERC20 component token** with a **dynamic NFT** whose on-chain value evolves based on rarity, quality, attributes, and trading activity.

---

## 🌌 Vision
In the Ascendii Universe, value is created by effort, creativity, and interaction — not speculation alone.  
Each NFT crafted here represents a digital artifact whose worth is determined by both its inherent design (rarity and quality) and its journey through the community (sales and usage).

This PoC shows how digital assets can **grow in value through engagement**, mirroring real-world reputation and contribution systems.

---

## 🧠 Technical Overview
**Core Components:**
- **BondingCurveToken.sol** — The base ERC20 token (component currency) used to craft NFTs.  
- **CraftableNFT.sol** — A smart contract demonstrating:
  - NFT creation (crafting) via token burn.
  - Dynamic value computation based on rarity, attributes, and sale history.
  - Sales tracking via marketplace hooks.
  - Modular multipliers for balancing game and economy mechanics.

---

## ⚙️ Contract Summary

### CraftableNFT.sol
A simple, deterministic on-chain system to:
1. **Craft** NFTs by burning component tokens.
2. **Record sales** via a trusted marketplace or admin.
3. **Recalculate value** with every recorded sale using:
   - `rarityMultiplier`
   - `qualityFactor`
   - `attributeBonus`
   - `sellCountFactor`

**Example Formula:**
computedValue = baseValue
× rarityMultiplier
× qualityFactor
× (1 + attributeBonus)
× (1 + sellCountBonus)---

## 💰 Minting Model
The Proof of Concept supports a **fixed mint cost** for simplicity.  
In production, this may evolve into **tiered or dynamic pricing**:
- **Fixed tiers:** predictable, easy onboarding.
- **Dynamic bonding-curve pricing:** scalable, organic price discovery.

---

## 🧩 File StructurePoC_CraftableNFT/
│
├── contracts/
│   ├── BondingCurveToken.sol
│   └── CraftableNFT.sol
│
├── test/
│   ├── CraftableNFT.test.js
│   └── BondingCurveToken.test.js
│
├── docs/
│   ├── OVERVIEW.md
│   └── TOKENOMICS.md (future)
│
├── scripts/
│   ├── deploy_cNFT.js
│   └── simulate_crafting.js 
|
└── README.md
