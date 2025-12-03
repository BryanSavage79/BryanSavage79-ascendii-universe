// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
contract InterlinkNFT is ERC721, Ownable2Step {
uint256 public nextId = 1;
    mapping(uint256 => uint16) public sellCount;
    
    constructo() ERC721 ("interlink Chronos Relic", "Cronos") {}
    function mint(address to) external onlyOwner returns(unit256) {
    
    unit256 tokenid = nextid++;
    _safeMint(to, tokenId);
    return tokenId;
    }
    function incrementSellCount( unit256 tokenId) external onlyOwner {
    sellCount[tokenId]++;
    }
    function getSellCount(unit256 tokenId)
    external view returns (unit16) {
    return sellCount[tokenId];
    }
    }
