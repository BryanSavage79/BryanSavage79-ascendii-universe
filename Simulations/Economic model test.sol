// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; // Security best practice

// BondingCurveToken: ERC20 token with linear bonding curve for components
contract BondingCurveToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public basePrice = 1 ether; // Base price in wei
    uint256 public curveFactor = 0.01 ether; // Price increase per unit supply
    uint256 public totalSupplyCap; // Optional cap to prevent infinite supply

    event ComponentPurchased(address buyer, uint256 amount, uint256 cost);

    constructor(string memory name, string memory symbol, uint256 cap) ERC20(name, symbol) {
        totalSupplyCap = cap;
    }

    // Purchase components using ETH (or effort points converted to value)
    function purchase(uint256 amount) external payable nonReentrant {
        require(totalSupply() + amount <= totalSupplyCap, "Supply cap exceeded");
        uint256 cost = calculateCost(amount);
        require(msg.value >= cost, "Insufficient payment");

        _mint(msg.sender, amount);
        emit ComponentPurchased(msg.sender, amount, cost);

        // Refund excess
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    // Calculate cost based on linear bonding curve
    function calculateCost(uint256 amount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 totalCost = 0;
        for (uint256 i = 0; i < amount; i++) {
            totalCost += basePrice + curveFactor * (currentSupply + i);
        }
        return totalCost;
    }

    // Owner can adjust curve parameters (governed by DAO in production)
    function setCurveParams(uint256 newBase, uint256 newFactor) external onlyOwner {
        basePrice = newBase;
        curveFactor = newFactor;
    }
}

// CrossChainForge: Main ERC721 contract for crafting, with effort points, probabilistic minting, burns, XP, and exemptions
contract CrossChainForge is ERC721, Ownable, ReentrancyGuard {
    BondingCurveToken public componentToken; // Link to components
    uint256 public effortThreshold = 100; // Min effort for mint
    uint256 public legendaryProb = 5; // 5% chance for legendary if threshold met (in basis points)
    uint256 public burnRate = 20; // 20% burn on regular/VCE sells (in percent)
    uint256 public nextTokenId = 1;

    // NFT Metadata Struct
    struct NFTMetadata {
        uint8 tier; // 0: Regular, 1: VCE, 2: Legendary
        uint256 xp; // Accumulated XP from sales/usage
        int256 vceModifier; // Volatility for VCE (-100 to +100)
        bool hasExclusive; // Flag for exclusive rights/privileges
    }

    mapping(uint256 => NFTMetadata) public nftMetadata;
    address public communityPool; // DAO treasury for fees/redistributions

    event ItemMinted(uint256 tokenId, address owner, uint8 tier, uint256 xp);
    event ItemSoldToPool(uint256 tokenId, address seller, bool burned);
    event XPAccrued(uint256 tokenId, uint256 addedXP);

    constructor(address _componentToken, address _pool) ERC721("InterlinkNFT", "ILNK") {
        componentToken = BondingCurveToken(_componentToken);
        communityPool = _pool;
    }

    // Mint NFT with probabilistic success and tier classification
    function mintItem(uint256 effort, uint256 componentsRequired) external nonReentrant {
        require(effort >= effortThreshold, "Insufficient effort");
        require(componentToken.balanceOf(msg.sender) >= componentsRequired, "Insufficient components");
        componentToken.burnFrom(msg.sender, componentsRequired); // Consume components

        // Probabilistic mint success (50% base)
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nextTokenId))) % 100;
        if (rand >= 50) revert("Mint failed probabilistically");

        uint8 tier = 0; // Default regular
        int256 vceModifier = 0;
        if (effort > effortThreshold * 120 / 100) { // 20% above for potential VCE/Legendary
            if (rand % 10000 < legendaryProb) {
                tier = 2; // Legendary
            } else {
                tier = 1; // VCE
                vceModifier = int256((rand % 201) - 100); // -100 to +100 volatility
            }
        }

        _safeMint(msg.sender, nextTokenId);
        nftMetadata[nextTokenId] = NFTMetadata(tier, 0, vceModifier, false); // Start with 0 XP
        emit ItemMinted(nextTokenId, msg.sender, tier, 0);
        nextTokenId++;
    }

    // Sell NFT to pool with burn (exempt legendary/exclusive)
    function sellToPool(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        NFTMetadata storage meta = nftMetadata[tokenId];

        // Accrue XP on sale (e.g., +10-20 random)
        uint256 addedXP = 10 + (uint256(keccak256(abi.encodePacked(block.timestamp, tokenId))) % 11);
        meta.xp += addedXP;
        emit XPAccrued(tokenId, addedXP);

        // Evolve tier based on XP
        if (meta.xp >= 150 && meta.tier < 2) {
            meta.tier = 2; // Legendary
            meta.hasExclusive = true; // Auto-grant exclusive
        } else if (meta.xp >= 100 && meta.tier < 1) {
            meta.tier = 1; // Renown (VCE)
        } // Rumor at 50+ but no tier change yet

        // Burn logic
        bool burn = false;
        if (meta.tier < 2 && !meta.hasExclusive) { // Regular/VCE without exclusive
            uint256 randBurn = uint256(keccak256(abi.encodePacked(block.timestamp, tokenId))) % 100;
            if (randBurn < burnRate) {
                burn = true;
                _burn(tokenId);
            }
        }

        if (!burn) {
            _transfer(msg.sender, communityPool, tokenId); // To pool/vault
        }
        emit ItemSoldToPool(tokenId, msg.sender, burn);

        // Fee redistribution (simplified: send ETH or tokens to pool)
        // In production, calculate and transfer fees here
    }

    // Accrue XP from external events (e.g., raids, tournaments) - Called by trusted oracle/DAO
    function accrueXP(uint256 tokenId, uint256 xpAmount) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        nftMetadata[tokenId].xp += xpAmount;
        emit XPAccrued(tokenId, xpAmount);
    }

    // Set exclusive flag (e.g., for partnerships)
    function setExclusive(uint256 tokenId, bool exclusive) external onlyOwner {
        nftMetadata[tokenId].hasExclusive = exclusive;
    }

    // Update params (DAO-governed)
    function updateParams(uint256 newThreshold, uint256 newLegendaryProb, uint256 newBurnRate) external onlyOwner {
        effortThreshold = newThreshold;
        legendaryProb = newLegendaryProb;
        burnRate = newBurnRate;
    }
}

// Additional notes: Integrate with LayerZero for cross-chain (use ILayerZeroEndpoint).
// Security: Use ReentrancyGuard, Ownable for access control. Audit for vulnerabilities like oracle manipulation on XP.
// For VCE volatility: In metadata, use for in-game stats or value adjustments (off-chain oracle).
// Test with Hardhat/Forking for provable results.
