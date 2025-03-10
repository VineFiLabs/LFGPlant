// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import {LFGCollection} from "./LFGCollection.sol";
import {ILFGFactory} from "../interfaces/ILFGFactory.sol";

contract LFGFactory is ILFGFactory{

    uint256 public CollectionId;
    address private LFGRouter;
    address private manager;

    constructor(address _router) {
        LFGRouter = _router;
    }

    mapping(address => mapping(uint256 => CollectionInfo[])) private UserCollectionInfo;

    mapping(address => uint256) public UserCollectionCount;

    CollectionInfo[] private idToCollectionInfo;

    function createCollection(string memory name, string memory symbol) external {
        address collection = address(
            new LFGCollection{
                salt: keccak256(
                    abi.encodePacked(msg.sender, CollectionId, block.chainid)
                )
            }(LFGRouter, name, symbol)
        );

        idToCollectionInfo.push(
            CollectionInfo({
                CollectionId: CollectionId,
                CollectionAddress: collection,
                createTime: uint64(block.timestamp),
                creator: msg.sender
            })
        );
        UserCollectionInfo[msg.sender][UserCollectionCount[msg.sender]].push(idToCollectionInfo[CollectionId]);
        if(UserCollectionInfo[msg.sender][UserCollectionCount[msg.sender]].length >= 9){
            UserCollectionCount[msg.sender]++;
        }
        CollectionId++;
    }

    function getUserCollectionInfo(address userAddress, uint256 index)external view returns(CollectionInfo[] memory){
        uint256 len;
        uint256 i;
        if(userAddress == address(this)){
            i = index;
            len = CollectionId - index;   
        }else {
            len = UserCollectionInfo[userAddress][index].length;
        }
        CollectionInfo[] memory newCollectionInfo = new CollectionInfo[](len);
        unchecked {
            if(userAddress == address(this)){
                for(uint256 j; j<len; j++){
                    if(i<CollectionId){
                        newCollectionInfo[j] = idToCollectionInfo[i];
                        i++;
                    }
                }
            }else{
                for(i; i<len; i++){
                    newCollectionInfo[i] = UserCollectionInfo[userAddress][index][i];
                }
            }
        }
        return newCollectionInfo;
    }

}
