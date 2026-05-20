// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ContractsInterlinkNFT is ERC721 {
    IERC20 public componentToken;
    uint256 public constant SCALE = 10000;
    IMilestoneTrigger public milestoneTrigger;
    
    event Crafted(address indexed creator, uint256 indexed tokenId);
    event SaleRecorded(address indexed seller, uint256 indexed tokenId, uint256 price);
    event Transformed(uint256 indexed tokenId);
    event MilestoneTriggerChanged(address indexed newMilestoneTrigger);
    
    constructor(address _componentToken) ERC721("InterlinkNFT", "iNFT") {
        componentToken = IERC20Burnable(_componentToken);
    }

    // Other functions definitions

    // Removed duplicate craft() function
    
    // Removed duplicate recordSale() function
}