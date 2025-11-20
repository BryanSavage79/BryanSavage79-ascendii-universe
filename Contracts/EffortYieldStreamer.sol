// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

interface ISablierV2Batch {
    struct CreateWithDurations {
        address sender;
        address recipient;
        uint128 totalAmount;
        address token;
        bool cancelable;
        uint40 durationSeconds;
        string metadata;
    }
       function batchCreateWithDurations(CreateWithDurations[] calldata batch) external returns (uint256[] memory streamIds);
}
interface IEffortToken {
    function balanceOf(address account) external view returns (uint256);
}
contract EffortYieldStreamer is Ownable2Step {
        using SafeERC20 for IERC20;

        IERC20 public immutable USDC;
    IEffortToken public immutable effortToken;
    ISablierV2Batch public immutable sablier;

// Tier thresholds (adjust with governance)
    uint256 public tier1 = 10_000 ether;   // ≥10k Effort → $50/month
    uint256 public tier2 = 50_000 ether;   // ≥50k → $250/month
    uint256 public tier3 = 200_000 ether;  // ≥200k → $1,000/month

    uint40 public constant STREAM_DURATION = 30 days;

    mapping(address => uint256) public lastStreamed;

    event YieldStreamed(address indexed recipient, uint256 streamId, uint128 amount);

    constructo(
    address _usdc,
        address _effortToken,
        address _sablier,
        address initialOwner
    ) {
        USDC = IERC20(_usdc);
        effortToken = IEffortToken(_effortToken);
        sablier = ISablierV2Batch(_sablier);
        _transferOwnership(initialOwner);
    }

    // Call this weekly via Chainlink Automation / Gelato
    function distributeWeeklyYield(address[] calldata recipients) external {
        ISablierV2Batch.CreateWithDurations[] memory batch = new ISablierV2Batch.CreateWithDurations[](recipients.length);

        for (uint i = 0; i < recipients.length; i++) {
            address user = recipients[i];
            uint256 effort = effortToken.balanceOf(user);

            uint128 monthlyAmount = 0;
            if (effort >= tier3) monthlyAmount = 1_000e6;       // $1,000 USDC
            else if (effort >= tier2) monthlyAmount = 250e6;   // $250
            else if (effort >= tier1) monthlyAmount = 50e6;    // $50

            if (monthlyAmount > 0 && block.timestamp > lastStreamed[user] + 25 days) {
            batch[i] = ISablierV2Batch.CreateWithDurations({
                    sender: address(this),
                    recipient: user,
                    totalAmount: monthlyAmount,
                    token: address(USDC),
                    cancelable: false,
                    durationSeconds: STREAM_DURATION,
                    metadata: "Nexus of Equity Perpetual Yield"
                });
                lastStreamed[user] = block.timestamp;
            }
        }
        
                 // Pull from communityYieldVault → this contract
                    uint256 totalNeeded = USDC.balanceOf(address( USDC.safeTransferFrom(msg.sender, address(this), totalNeeded); // msg.sender = communityYieldVault or keeper
                    USDC.safeApprove(address(sablier), type(uint256).max);
        sablier.batchCreateWithDurations(batch);
    }
}
