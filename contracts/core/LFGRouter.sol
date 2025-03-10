// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ILFGStorage} from "../interfaces/ILFGStorage.sol";
import {ILFGCollection} from "../interfaces/ILFGCollection.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ILFGToken} from "../interfaces/ILFGToken.sol";
import {IGovernance} from "../interfaces/IGovernance.sol";

contract LFGRouter is Ownable {
    address public governance;
    constructor(address _governance) Ownable(msg.sender) {
        governance = _governance;
    }

    receive() external payable{}

    struct CreateParams {
        uint8 tokenDecimals;
        address collction;
        address lfgURLStorage;
        uint256 lfgMaxSupply;
        string tokenName;
        string tokenSymbol;
        string content;
        string imageURI;
    }

    function create(CreateParams calldata params) external payable{
        uint256 tokenId = ILFGCollection(params.collction).ID();
        uint64 fee = IGovernance(governance).getFeeInfo().fee;
        address feeReceiver = IGovernance(governance).getFeeInfo().receiver;
        require(msg.value >= fee, "Insufficient");
        (bool feeSuccess, ) = feeReceiver.call{value: msg.value}("");
        require(feeSuccess);
        string memory tokenURI=ILFGStorage(params.lfgURLStorage).metadataUri(
            params.tokenName,
            params.tokenSymbol,
            params.imageURI,
            params.collction,
            tokenId,
            params.lfgMaxSupply
        );
        bytes memory payload = abi.encodeCall(
                ILFGCollection(params.collction).create,
                (
                    params.tokenDecimals,
                    msg.sender,
                    params.lfgMaxSupply,
                    params.tokenName,
                    params.tokenSymbol,
                    params.content,
                    tokenURI
                )
        );
        (bool success,)=params.collction.call(payload);
        require(success, "Call create fail");
    }

    function getCollectionTokenInfo(address collect,uint256 tokenId)external view returns(ILFGCollection.TokenInfo memory){
        return ILFGCollection(collect).getTokenInfo(tokenId);
    }

    function getLFGTokenBalance(address lfg, address user)external view returns(uint256){
        return ILFGToken(lfg).balanceOf(user);
    }

    function getTotalSupply(address lfg)external view returns(uint256){
        return ILFGToken(lfg).totalSupply();
    }

    function getCollectionLastId(address collection)external view returns(uint256){
        return ILFGCollection(collection).ID();
    }

    function getTokenURI(address collection, uint256 tokenId)external view returns(string memory){
        return IERC721Metadata(collection).tokenURI(tokenId);
    }

    function getCollectionName(address collection)external view returns(string memory){
        return IERC721Metadata(collection).name();
    }

    function getCollectionSymbol(address collection)external view returns(string memory){
        return IERC721Metadata(collection).symbol();
    }

    function getCollectionOwner(address collection, uint256 tokenId)external view returns(address){
        return IERC721(collection).ownerOf(tokenId);
    }

    function getCollectionBalance(address collection, address owner)external view returns(uint256){
        return IERC721(collection).balanceOf(owner);
    }

}
