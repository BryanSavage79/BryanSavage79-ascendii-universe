# Founding Architects

**The genesis repository for Ascendii Universe—where systems serve souls.**

## Overview

Founding Architects is the technical foundation for the Ascendii Universe, a cross-chain gaming ecosystem that merges blockchain mechanics with real-world impact. This repository contains smart contracts, economic simulations, and documentation for our core systems.

## 🔧 Mechanics Deep Dive

Explore the technical foundations of the Ascendii Universe:

- **[Bonding Curves](/docs/mechanics/bonding-curve.md)** - Dynamic component pricing with linear and exponential models
- **[Cross-Chain Bridging](/docs/mechanics/cross-chain-bridge.md)** - LayerZero integration for seamless asset transfers
- **[Effort Points (EP)](/docs/mechanics/effort-points-ep.md)** - Skill-based progression and soulbound reputation
- **[Probabilistic Crafting](/docs/mechanics/probabilistic-crafting.md)** - Chainlink VRF-powered legendary item minting

Each mechanic includes formulas, smart contract snippets, economic analysis, and integration examples.

## 🎮 Core Systems

### ULIQ Trinity System
Three legendary NFTs tied to real-world charitable impact:
- **Aqua Vitae** (Water) - Funds clean water wells via charity:water
- **Helios Forge** (Energy) - Powers schools via GivePower
- **Arbor Vitae** (Nature) - Plants trees via Pachama

### Interlink Exchange
Regular marketplace economy with:
- Bonding curve component pricing (Steel Ingots, Frost Crystals)
- Cross-chain bridging with 2% fees
- VRF-based probabilistic crafting
- Effort Point progression system

### Effort Yield Streamer
Monthly USDC rewards for active players:
- Tier 1: 10,000 EP = $50/month
- Tier 2: 50,000 EP = $250/month
- Tier 3: 200,000 EP = $1,000/month

Powered by Sablier V2 streaming protocol.

## 📁 Repository Structure

```
founding-architects/
├── contracts/          # Solidity smart contracts
├── simulations/        # Python economic models
├── docs/
│   ├── mechanics/      # Technical deep dives
│   ├── trinity/        # ULIQ system documentation
│   └── INTERLINK.md    # Marketplace overview
└── README.md
```

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
hardhat >= 2.19.0
```

### Installation
```bash
git clone https://github.com/BryanSavage79/founding-architects.git
cd founding-architects
npm install
```

### Run Economic Simulations
```bash
# ULIQ Trinity simulation
python simulations/uliq_economic_model.py

# Interlink Exchange simulation
python simulations/interlink_economic_model.py
```

### Deploy Contracts (Testnet)
```bash
npx hardhat run scripts/deploy-effort-token.js --network sepolia
npx hardhat run scripts/deploy-yield-streamer.js --network sepolia
```

## 🤝 Partner Collaboration

**Interested in collaborating?** We're actively seeking partners for:

- **VRF Integration** - Enhance Helios Forge crafting mechanics
- **Cross-Chain Infrastructure** - Expand LayerZero implementation
- **Charity Partnerships** - Verify real-world impact tracking
- **Economic Modeling** - Optimize bonding curves and fee structures

**DM-ready pitch:** "Check our mechanics docs—interested in collaborating on [specific area]? [repo link] ∞"

## 📊 Economic Sustainability

### ULIQ System
- **Cost per ULIQ**: $200-$285 (components + gas)
- **Charity Donation**: $150-$300 per successful craft
- **Success Rate**: 63-67% (EP-dependent)
- **Real-World Impact**: Wells, schools, trees, CO₂ removal

### Interlink Exchange
- **Monthly Cost** (100 users): $20,500 in yield rewards
- **Revenue Needed**: $9.84M annual marketplace volume
- **Fee Structure**: 1% sell fee + 2% bridge fee
- **Break-even**: ~270 transactions/day at $100 average

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin, Ownable2Step
- **Cross-Chain**: LayerZero V2
- **Randomness**: Chainlink VRF
- **Streaming**: Sablier V2
- **Development**: Hardhat, Ethers.js
- **Testing**: Mocha, Chai
- **Simulation**: Python, Matplotlib, NumPy

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

## 🌟 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Contribution Areas
- Smart contract development
- Economic modeling and simulation
- Documentation and tutorials
- Testing and security audits
- Community building

## 🔗 Links

- **Main Repository**: [ascendii-universe](https://github.com/BryanSavage79/BryanSavage79-ascendii-universe)
- **Documentation**: [/docs](/docs)
- **Mechanics**: [/docs/mechanics](/docs/mechanics)
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

## 💬 Philosophy

> "This isn't a game. This is how systems serve souls." ∞

The Ascendii Universe proves that blockchain gaming can create real-world value. Every ULIQ crafted funds actual charitable projects. Every Effort Point earned represents genuine skill development. Every yield stream rewards long-term commitment.

We're building a system where:
- **Beauty signals value** (aesthetic NFTs = charitable impact)
- **Effort earns income** (skill-based progression = real USDC)
- **Systems serve souls** (game mechanics = human flourishing)

## 🎯 Roadmap

### Phase 1: Foundation (Q4 2024)
- ✅ Core smart contracts
- ✅ Economic simulations
- ✅ Mechanics documentation
- 🔄 Testnet deployment

### Phase 2: Integration (Q1 2025)
- Cross-chain bridging (5 chains)
- Charity API integration
- Frontend marketplace
- Community testing

### Phase 3: Launch (Q2 2025)
- Mainnet deployment
- First ULIQ minting event
- Yield streaming activation
- Partnership announcements

## 📈 Metrics

- **Commits**: 4+
- **Smart Contracts**: 5+
- **Economic Models**: 3
- **Documentation Pages**: 10+
- **Lines of Code**: 2,000+

## 🙏 Acknowledgments

Built with inspiration from:
- **Sablier** - Streaming payment protocol
- **LayerZero** - Cross-chain messaging
- **Chainlink** - Decentralized oracles
- **OpenZeppelin** - Secure contract libraries

Special thanks to the charity partners making real-world impact possible:
- charity:water
- GivePower
- Pachama

---

**"The forge awaits. Build with us." ∞**
