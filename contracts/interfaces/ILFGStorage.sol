// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

interface ILFGStorage {

    function metadataUri(
        string memory name,
        string memory symbol,
        string memory imageURL,
        address collection,
        uint256 tokenId,
        uint256 totalSupply
    ) external returns (string memory finalTokenUri);

    function getCollectMetadataInfo(
        address collection,
        uint256 tokenId
    ) external view returns (string memory);


}