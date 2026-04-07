// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
contract InterlinkNFT is ERC721, Ownable2Step {
    uint256 public nextId = 1;
    mapping(uint256 => uint16) public sellCount;

    constructor() ERC721("Interlink Chronos Relic", "ICR") {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = nextId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function incrementSellCount(uint256 tokenId) external onlyOwner {
        sellCount[tokenId]++;
    }

    function getSellCount(uint256 tokenId) external view returns (uint16) {
        return sellCount[tokenId];
    }
}
