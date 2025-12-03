// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
        _mint(msg.sender, 1_000_000_000e6);
}
    function decimals() public pure override returns (uint8) { return 6; }
}
