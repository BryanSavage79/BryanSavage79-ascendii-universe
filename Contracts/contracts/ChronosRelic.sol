// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChronosRelic
/// @notice A time-gated ERC-721 artifact minted through ceremonial gameplay.
contract ChronosRelic is ERC721, Ownable {
    uint256 private _nextTokenId;

    event RelicMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("Chronos Relic", "CRNR") {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        emit RelicMinted(to, tokenId);
        return tokenId;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
