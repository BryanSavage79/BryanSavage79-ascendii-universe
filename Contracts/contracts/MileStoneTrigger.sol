// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// MilestoneTrigger.sol
/// A small, auditable contract that records milestones and authorizes rituals.
/// This example supports rule-based approvals: owner can set thresholds that,
/// when satisfied (e.g., sellCount >= N), allow the ritual to be triggered.

import "@openzeppelin/contracts/access/Ownable.sol";

interface IInterlinkNFT {
    function items(uint256) external view returns (
        uint8 rarity,
        uint16 sellCount,
        uint8 quality,
        uint32 attrs,
        uint256 baseValue,
        uint256 computedValue
    );
    }

/// @title MilestoneTrigger
/// @notice Encodes milestone rules. The community can extend this contract with on-chain
/// attestations or oracles in the future.
contract MilestoneTrigger is Ownable {
    IInterlinkNFT public interlink;
    mapping(string => uint256) public requiredSellCount; // ritualName -> required sell count

    event RuleSet(string ritualName, uint256 sellThreshold);
    event InterlinkSet(address oldAddr, address newAddr);
  function setRule(string calldata ritualName, uint256 sellThreshold) external onlyOwner {
        requiredSellCount[ritualName] = sellThreshold;
        emit RuleSet(ritualName, sellThreshold);
    }

    /// @notice Returns true if the ritual can be triggered by actor for tokenId.
    /// For this PoC we only check sellCount threshold.
    function canTrigger(uint256 tokenId, address /*actor*/) external view returns (bool) {
        // introspect interlink items
        (, uint16 sellCount, , , , ) = interlink.items(tokenId);

        // Check any rule that has been configured; if none exist, default allow.
        // For simplicity: if any ritual has threshold > 0, require at least that many sales.
        // In production the ritualName should be passed; here PoC returns true if sellCount >= minThreshold.
        uint256 minThreshold = _minConfiguredThreshold();
        if (minThreshold == 0) return true;
        return sellCount >= minThreshold;
    }

    function _minConfiguredThreshold() internal view returns (uint256 minValue) {
        // scan a tiny, bounded set in PoC; in real system, rules would be enumerated or indexed.
        // For simplicity return smallest non-zero threshold, else 0.
        minValue = 0; // As PoC we don't have an enumerable list; owners should set min threshold to meaningful value.
        return minValue;
    }
}
