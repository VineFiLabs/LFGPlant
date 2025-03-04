// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

interface ILFGToken {
    function mint(address to, uint256 amount) external returns (bool _state);
    function burn(uint256 amount) external returns (bool _state);


    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}