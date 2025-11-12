

## 📘 `docs/OVERVIEW.md`

```markdown
# Ascendii Universe — CraftableNFT Proof of Concept

## Purpose
This Proof of Concept demonstrates how **value can evolve on-chain** through a living economy of creativity, participation, and reputation.

Where most NFTs represent static assets, **CraftableNFTs** embody the idea of **living artifacts** — digital creations that gain value the more they are used, traded, or recognized within the ecosystem.

---

## Conceptual Framework

### 1. The Component Token
A BondingCurveToken acts as the “resource layer.”  
Users spend (and burn) these tokens to craft new NFTs.  
This creates **a deflationary mechanic** that ties the currency supply directly to creative output.

### 2. The Craftable NFT
Each NFT carries:
- **Rarity (0–3):** common to legendary.
- **Quality (0–100):** deterministically assigned for the PoC.
- **Attributes:** encoded as a bitmask to represent special traits.
- **Sell count:** updated every time a marketplace records a sale.

### 3. Dynamic Value Formula
Each time an NFT is sold, its on-chain **computed value** updates.  
This ensures value emerges from interaction — not arbitrary pricing.
