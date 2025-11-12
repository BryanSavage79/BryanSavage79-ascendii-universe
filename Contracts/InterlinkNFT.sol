// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// InterlinkNFT.sol
/// A ritualized ERC-721 where tokens evolve via milestones, bonding-curve components,
/// and symbolic attributes. Each function reads like a rite: minting is a birth,
/// transformation is a transmutation, and metadata encodes the soul of the item.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Burnable.sol";

interface IMilestoneTrigger {
    function canTrigger(uint256 tokenId, address actor) external view returns (bool);
}

/// @title InterlinkNFT
/// @notice Craft, evolve, and sanctify NFTs. This PoC focuses on deterministic value
/// composition (rarity, sales, quality, attributes) and a protected transformation flow.
contract InterlinkNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    // Each crafted token has an ItemRecord describing soul and state
    struct ItemRecord {
        uint8 rarity;         // 0..3 (common -> legendary)
        uint16 sellCount;     // number of times recorded as sold
        uint8 quality;        // 0..100
        uint32 attrs;         // bitmask of special traits
        uint256 baseValue;    // baseline numeric unit (component-cost derived)
        uint256 computedValue; // cached computed value (for display)
    }

    mapping(uint256 => ItemRecord) public items;

    // Component token used for crafting (must support burnFrom)
    IERC20Burnable public componentToken;ERC721("InterlinkNFT", "iNFT") {
        componentToken = _componentToken;
    }
k
    // ------------------------
    // Crafting (the initiation)
    // ------------------------
    /// @notice Craft a new item. The craft burns `componentCost` tokens from caller.
    /// @dev For PoC, quality is derived deterministically from blockhash and caller.
    function craft(
        uint8 rarity,
        uint32 attrs,
        uint256 componentCost,
        uint256 qualityHint
    ) external {
        require(rarity <= 3, "Invalid rarity");

        // Collect components and burn them (the offering)
        require(componentToken.transferFrom(msg.sender, address(this), componentCost), "transfer failed");
        componentToken.burnFrom(address(this), componentCost);

        // Create token
        _ids.increment();
        uint256 newId = _ids.current();

        uint8 quality = _deriveQuality(qualityHint, newId);

        uint256 baseValue = componentCost;
        uint256 computed = _computeValue(rarity, 0, quality, attrs, baseValue);

        items[newId] = ItemRecord({
            rarity: rarity,
            sellCount: 0,
            quality: quality,
            attrs: attrs,
            baseValue: baseValue,
            computedValue: computed
        });

        _safeMint(msg.sender, jnewId);

        emit Crafted(msg.sender, newId, rarity);
    }

    // ------------------------
    // Sales tracking (rites of passage)
    // ------------------------
    /// @notice Record a sale for a token. Trusted marketplace or owner may call.
    function recordSale(uint256 tokenId) external {
        require(_exists(tokenId), "nonexistent");
        require(msg.sender == owner() || msg.sender == address(milestoneTrigger), "unauthorized");

        ItemRecord storage it = items[tokenId];
        it.sellCount += 1;
        it.computedValue = _computeValue(it.rarity, it.sellCount, it.quality, it.attrs, it.baseValue);

        emit SaleRecorded(tokenId, it.sellCount, it.computedValue);
    }


    // ------------------------
    // Crafting (the initiation)
    // ------------------------
    /// @notice Craft a new item. The craft burns `componentCost` tokens from caller.
    /// @dev For PoC, quality is derived deterministically from blockhash and caller.
    function craft(
        uint8 rarity,
        uint32 attrs,
        uint256 componentCost,
        uint256 qualityHint
    ) external {
        require(rarity <= 3, "Invalid rarity");

        // Collect components and burn them (the offering)
        require(componentToken.transferFrom(msg.sender, address(this), componentCost), "transfer failed");
        componentToken.burnFrom(address(this), componentCost);

        // Create token
        _ids.increment();
        uint256 newId = _ids.current();

        uint8 quality = _deriveQuality(qualityHint, newId);

        uint256 baseValue = componentCost;
        uint256 computed = _computeValue(rarity, 0, quality, attrs, baseValue);

        items[newId] = ItemRecord({
            rarity: rarity,
            sellCount: 0,
            quality: quality,
            attrs: attrs,
            baseValue: baseValue,
            computedValue: computed
        });

        _safeMint(msg.sender, newId);

        emit Crafted(msg.sender, newId, rarity);
    }
    // ------------------------
    // Sales tracking (rites of passage)
    // ------------------------
    /// @notice Record a sale for a token. Trusted marketplace or owner may call.
    function recordSale(uint256 tokenId) external {
        require(_exists(tokenId), "nonexistent");
        require(msg.sender == owner() || msg.sender == address(milestoneTrigger), "unauthorized");

        ItemRecord storage it = items[tokenId];
        it.sellCount += 1;
        it.computedValue = _computeValue(it.rarity, it.sellCount, it.quality, it.attrs, it.baseValue);

        emit SaleRecorded(tokenId, it.sellCount, it.computedValue);
    }

    // ------------------------
    // Transformations (sacred transmutation)
    // ------------------------
    /// @notice Trigger a transformation ritual if the configured MilestoneTrigger allows it.
    /// The ritual name is recorded in an event; transforms adjust token attributes and recompute value.
    function performRitual(uint256 tokenId, string calldata ritualName) external {
        require(_exists(tokenId), "nonexistent");
        require(address(milestoneTrigger) != address(0), "no trigger configured");

        // The trigger contract encodes the policy. It returns whether actor may trigger.
        require(milestoneTrigger.canTrigger(tokenId, msg.sender), "trigger denied");

        // Example simple ritual: improve quality slightly and add attribute bit 0 if not set.
        ItemRecord storage it = items[tokenId];
        if (it.quality < 100) {
            it.quality = it.quality + 5 > 100 ? 100 : it.quality + 5;
        }
        // flip first attribute bit as symbolic ascension
        it.attrs = it.attrs | uint32(1);

        // recompute value
        it.computedValue = _computeValue(it.rarity, it.sellCount, it.quality, it.attrs, it.baseValue);

        emit Transformed(tokenId, ritualName, it.computedValue);
    }

    // ------------------------
    // Governance
    // ------------------------
    function setMilestoneTrigger(IMilestoneTrigger t) external onlyOwner {
        address old = address(milestoneTrigger);
        milestoneTrigger = t;
        emit MilestoneTriggerChanged(old, address(t));
    }

    // ------------------------
    // View / valuation logic
    // ------------------------
    function getComputedValue(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "nonexistent");
        return items[tokenId].computedValue;
    }

    // Value formula similar to PoC: rarity * quality * attributes * sellBonus (scaled math)
    function _computeValue(
        uint8 rarity,
        uint16 sellCount,
        uint8 quality,
        uint32 attrs,
        uint256 baseValue
    ) internal pure returns (uint256) {
        uint256 rarityMul;
        if (rarity == 0) rarityMul = 1 * SCALE;
        else if (rarity == 1) rarityMul = 18 * (SCALE / 10); // 1.8
        else if (rarity == 2) rarityMul = 35 * (SCALE / 10); // 3.5
        else rarityMul = 70 * (SCALE / 10); // 7.0

        uint256 qualityMul = 9_000 + (uint256(quality) * 6_000) / 100; // 0..100 => 90%..150%

        // attribute bonus: each bit = +2% scaled
        uint32 x = attrs;
        uint256 attrCount;
        while (x != 0) {
            attrCount += (x & 1);
            x >>= 1;
        }
        uint256 attrBonus = 200 * attrCount; // scaled

        uint256 sellBonus = sellCount * 500; // 5% per sale
        if (sellBonus > 5000) sellBonus = 5000; // cap at +50%

        uint256 val = baseValue;
        val = (val * rarityMul) / SCALE;
        val = (val * qualityMul) / SCALE;
        val = (val * (SCALE + attrBonus)) / SCALE;
        val = (val * (SCALE + sellBonus)) / SCALE;
        return val;
    }

    // Deterministic PoC quality (not secure)
    function _deriveQuality(uint256 hint, uint256 tokenNonce) internal view returns (uint8) {
        bytes32 seed = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, hint, tokenNonce));
        return uint8(uint256(seed) % 101);
    }
}
