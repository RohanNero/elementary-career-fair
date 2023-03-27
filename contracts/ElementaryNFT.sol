// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ElementaryNFT is ERC721, ERC721Burnable, Ownable {


    uint private _tokenCounter;
    string[] private _tokenURIs;

    constructor() ERC721("Montclaire", "MTC") {}

    function safeMint() public onlyOwner {
        _safeMint(address(this), _tokenCounter);
        _tokenCounter++;
    }

    function setUri(string memory uri, uint256 tokenId) public onlyOwner {
        _tokenURIs[tokenId] = uri;
    }

    /** View / Pure functions */


    function viewTokenCount() public view returns(uint tokenCount) {
        tokenCount = _tokenCounter;
    }

    function viewTokenURIs(uint tokenId) public view returns(string memory uri) {
        uri = _tokenURIs[tokenId];
    }
}
