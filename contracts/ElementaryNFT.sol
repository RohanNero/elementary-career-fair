// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ElementaryNFT__FailedToCall(uint value);

/** @author Rohan Nero
  * @title Elementary NFT
  * @notice this contract allows children at the career fair to mint an NFT with their desired token URI
  * @notice children may also vote for their favorite player between messi or ronaldo
  * @dev this contract could potentially be expanded upon and used by a teacher who controls everything but in production environment
  * you would want to stay far away from something structured like this 
   */
contract ElementaryNFT is ERC721, ERC721Burnable, Ownable {

    uint8 private _messiVotes;
    uint8 private _ronaldoVotes;
    uint private _tokenCounter;
    string[] private _tokenURIs;
    mapping(uint tokenId => string name) private names;

    event MintedNFT(uint tokenId);
    event SetURI(uint tokenId, string tokenUri);
    event TradedNFT(uint firstTokenId, uint secondTokenId);
    event MessiVote(uint totalCount);
    event RonaldoVote(uint totalCount);

    constructor() ERC721("ElementaryNFT", "ELM") {}

    /** @notice this function handles direct Ether payments  */
    receive() external payable {
        (bool sent, ) = owner().call{value: msg.value}("");
        if(!sent) {
            revert ElementaryNFT__FailedToCall(msg.value);
        }
    }

    /** @notice this function mints an NFT, sets its URI, and names it */
    function createNFT(string memory uri, string memory name) public {
        safeMint();
        setUri(uri, _tokenCounter - 1);
        setName(name, _tokenCounter - 1);
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

    /** @notice this function sets the name for the NFT at `tokenId` */
    function setName(string memory name, uint tokenId) public onlyOwner {
        names[tokenId] = name;
    }

    /** @notice this function allows two people to swap ElementaryNFTs
      * @dev swaps imageUris and name mappings, no actual ERC721 transfer */
    function trade(uint firstId, uint secondId) public onlyOwner {
        string memory firstIdName = names[firstId];
        string memory firstIdUri = _tokenURIs[firstId];
        names[firstId] = names[secondId];
        _tokenURIs[firstId] = _tokenURIs[secondId];
        names[secondId] = firstIdName;
        _tokenURIs[secondId] = firstIdUri;
        emit TradedNFT(firstId, secondId);
    }

    /** @notice this is an emergency withdrawal function */
    function withdraw() public onlyOwner {
        (bool sent,) = msg.sender.call{value: address(this).balance}("");
        if(!sent) {
            revert ElementaryNFT__FailedToCall(address(this).balance);
        }
    }

    /** @notice this function increments votes for Messi by one */
    function voteForMessi() public onlyOwner {
        _messiVotes++;
        emit MessiVote(_messiVotes);
    }

    /** @notice this function increments votes for Ronaldo by one */
    function voteForRonaldo() public onlyOwner {
        _ronaldoVotes++;
        emit RonaldoVote(_ronaldoVotes);
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

    /** @notice this function returns the name of the NFT at `tokenId` */
    function viewName(uint tokenId) public view returns(string memory name) {
        name = names[tokenId];
    }

    /** @notice returns number of votes for Messi */
    function viewMessiVotes() public view returns(uint votes) {
        votes = _messiVotes;
    }

    /** @notice returns number of votes for Ronaldo */
    function viewRonaldoVotes() public view returns(uint votes) {
        votes = _ronaldoVotes;
    }
}
