// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ILFGStorage} from "../interfaces/ILFGStorage.sol";

contract LFGStorage is Ownable, ILFGStorage{
    address public caller;

    constructor(address _caller) Ownable(msg.sender) {
        caller = _caller;
    }

    modifier onlyCaller() {
        require(msg.sender == caller, "Non caller");
        _;
    }


    mapping(address => mapping(uint256 => string)) private _collectMetadataInfo;

    function changeCaller(address _caller) external onlyOwner {
        caller = _caller;
    }

    function metadataUri(
        string memory name,
        string memory symbol,
        string memory imageURL,
        address collection,
        uint256 tokenId,
        uint256 totalSupply
    ) external onlyCaller returns (string memory finalTokenUri) {
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "', name, '", ',
                '"description": "Welcome to LFGPlant World ! This is a wonderful collection of stories, LFG!",',
                '"image": "', imageURL, '", ',
                '"attributes": [',
                    '{"trait_type": "Symbol", "value": "', symbol, '"},',
                    '{"trait_type": "Amount", "value": "', Strings.toString(totalSupply), '"},',
                    '{"trait_type": "Timestamp", "value": "', Strings.toString(block.timestamp), '"}',
                ']}'
            )
        );
        finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        _collectMetadataInfo[collection][tokenId] = finalTokenUri;
    }

    function getCollectMetadataInfo(
        address collection,
        uint256 tokenId
    ) external view returns (string memory) {
        return _collectMetadataInfo[collection][tokenId];
    }
}
