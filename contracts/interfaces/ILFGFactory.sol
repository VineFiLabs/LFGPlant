// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

interface ILFGFactory{

    struct CollectionInfo{
        uint256 CollectionId;
        address CollectionAddress;
        uint64 createTime;
        address creator;
    }

    function CollectionId()external view returns(uint256);

    function UserCollectionCount(address)external view returns(uint256);

    function getUserCollectionInfo(address userAddress, uint256 index)external view returns(CollectionInfo[] memory);
}