// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

interface IGovernance { 

    struct FeeInfo{
        uint64 fee;
        address receiver;
    }

    function owner() external view returns (address);
    function manager() external view returns (address);
    function getFeeInfo() external view returns (FeeInfo memory);
}