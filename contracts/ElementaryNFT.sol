// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ElementaryNFT__FailedToCall(uint value);


/** @author Rohan Nero
  * @title Elementary NFT
  * @notice this contract allows children at the career fair to mint an NFT with their desired token URI */
contract ElementaryNFT is ERC721, ERC721Burnable, Ownable {

    uint8 private messiVotes;
    uint8 private ronaldoVotes;
    uint private _tokenCounter;
    string[] private _tokenURIs;

    event MintedNFT(uint tokenId);
    event SetURI(uint tokenId, string tokenUri);

    constructor() ERC721("ElementaryNFT", "ELM") {}

    receive() external payable {
        (bool sent, ) = owner().call{value: msg.value}("");
        if(!sent) {
            revert ElementaryNFT__FailedToCall(msg.value);
        }
    }

    /** @notice this function mints an NFT and sets its URI */
    function createNFT(string memory uri) public {
        safeMint();
        setUri(uri, _tokenCounter - 1);
    }

    /** @notice this function mints one ElementaryNFT without setting the URI */
    function safeMint() public onlyOwner {
        _safeMint(address(this), _tokenCounter);
        _tokenCounter++;
        emit MintedNFT(_tokenCounter - 1);
    }

    /** @notice this function sets the URI for the NFT at `tokenId` */
    function setUri(string memory uri, uint256 tokenId) public onlyOwner {
        _tokenURIs[tokenId] = uri;
        emit SetURI(tokenId, uri);
    }

    /** @notice this is an emergency withdrawal function */
    function withdraw() public onlyOwner {
        (bool sent,) = msg.sender.call{value: address(this).balance}("");
        if(!sent) {
            revert ElementaryNFT__FailedToCall(address(this).balance);
        }
    }

    /** View / Pure functions */

    /** @notice this function returns _tokenCounter */
    function viewTokenCount() public view returns(uint tokenCount) {
        tokenCount = _tokenCounter;
    }

    /** @notice this function returns the token URI of the NFT at `tokenId`
      * @param tokenId specifies which NFT to change */
    function viewTokenURIs(uint tokenId) public view returns(string memory uri) {
        uri = _tokenURIs[tokenId];
    }

    /** @notice this function returns the value of the messiVotes variable */
    function viewMessiVotes() public view returns(uint votes) {
        votes = messiVotes;
    }

    /** @notice this function returns the value of the ronaldoVotes variable */
    function viewRonaldoVotes() public view returns(uint votes) {
        votes = ronaldoVotes;
    }
}
