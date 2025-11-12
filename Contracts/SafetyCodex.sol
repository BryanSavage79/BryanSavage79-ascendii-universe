// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// SafetyCodex.sol
/// A small library/contract that encodes policy primitives: versioned interoperability checks,
/// authorized callers, and emergency pause semantics. Each rule is framed as a codified oath.

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SafetyCodex is AccessControl, Pausable {
    bytes32 public constant MODERATOR = keccak256("MODERATOR");
    bytes32 public constant AUDITOR = keccak256("AUDITOR");

    event InteropCheck(bytes32 indexed id, bool passed, string note);

    constructor(address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
        _setupRole(MODERATOR, root);
    }

    /// @notice Quick interoperability assertion. Contracts can call this to register a check.
    function assertInterop(bytes32 checkId, bool passed, string calldata note) external {
        // emit a traceable log that an interoperability check occurred
        emit InteropCheck(checkId, passed, note);

        // If a critical check failed, a moderator may pause the system off-chain by calling pause().
    }

    function pauseSystem() external onlyRole(MODERATOR) {
        _pause();
    }

    function unpauseSystem() external onlyRole(MODERATOR) {
        _unpause();
    }

    // simple guard
    modifier whenNotHalted() {
        require(!paused(), "System halted by SafetyCodex");
        _;
    }
}
