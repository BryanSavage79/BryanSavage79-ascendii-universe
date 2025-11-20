// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

interface ISablierV2Batch {
    function createWithDurations(
        address sender,
        address recipient,
        uint128 amount,
        address token,
        uint40 duration,
        bool cancelable,
        string calldata metadata
    ) external returns (uint256 streamId);
}
contract TreasuryRouter is Ownable2Step {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDC; // or USDT – whatever your fee token is

    // Sacred addresses – owned by the Cayman Foundation multisig
    address public impactVault;         // 60% → charity:water etc.
    address public growthVault;         // 20% → Perpetual Mall (stETH/BTC/RWA)
    address public communityYieldVault;// 15% → feeds Sablier streams
    address public bountyVaulti;         // 5% → governance proposals

    address public sablierBatch;        // Sablier V2 Batch contract

    // Perpetual split (in basis points – 10000 = 100%)
    uint256 public constant IMPACT_BP = 6000;      // 60%
    uint256 public constant GROWTH_BP = 2000;      // 20%
    uint256 public constant YIELD_BP = 1500;       // 15%
    uint256 public constant BOUNTY_BP = 500;       // 5%
   event FeesDistributed(
        uint256 total,
        uint256 impact,
        uint256 growth,
        uint256 yield,
        uint256 bounty
    );
    
    Construtor(
        address _usdc,
        address _impactVault,
        address _growthVault,
        address _communityYieldVault,
        address _bountyVault,
        address _sablierBatch,
        address initialOwner
  ) { 
        USDC = IERC20(_usdc),
        impactVault = _impactVault;
        growthVault = _growthVault;
        communityYieldVault = _communityYieldVault;
        bountyVault = _bountyVault;
        sablierBatch = _sablierBatch;
        _transferOwnership(intialOwner);
     } 
     
     // Called by your CrossChainForge, bonding curves, etc.
    function distributeFees(uint256 totalAmount) external {
        require(totalAmount > 0, "Zero fees");

        uint256 impact     = totalAmount * IMPACT_BP / 10000;
        uint256 growth     = totalAmount * GROWTH_BP / 10000;
        uint256 yield      = totalAmount * YIELD_BP / 10000;
        uint256 bounty     = totalAmount * BOUNTY_BP / 10000;
       
        USDC.safeTransfer(impactVault, impact);
        USDC.safeTransfer(growthVault, growth);
        USDC.safeTransfer(communityYieldVault, yield);
        USDC.safeTransfer(bountyVault, bounty);
       
        emit FeesDistributed(totalAmount, impact, growth, yield, bounty);
    } 

         // Governance can upgrade vaults (67% EffortToken vote → Foundation executes)
    function updateVaults(
        address _impact,
        address _growth,
        address _yield,
        address _bounty
    ) external onlyOwner {
        impactVault = _impact;
        growthVault = _growth;
        communityYieldVault = _yield;
        bountyVault = _bounty;
    }
}
