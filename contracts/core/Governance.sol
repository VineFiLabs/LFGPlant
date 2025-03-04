// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import {IGovernance} from "../interfaces/IGovernance.sol";

contract Governance is IGovernance{
    address public owner;
    address public manager;
    address private feeReceiver;
    uint64 public fee;

    mapping(address => FeeInfo) private feeInfo;

    constructor(address _owner, address _manager, address _feeReceiver, uint64 _fee) {
        owner = _owner;
        manager = _manager;
        feeInfo[address(this)] = FeeInfo({
            fee: _fee,
            receiver: _feeReceiver
        });
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Non owner");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Non manager");
        _;
    }

    receive() external payable {}

    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function setManager(address _manager) public onlyOwner {
        manager = _manager;
    }

    function setFeeInfo(address _newFeeReceiver, uint64 _newFee) public onlyOwner {
        feeInfo[address(this)] = FeeInfo({
            fee: _newFee,
            receiver: _newFeeReceiver
        });
    }

    function getFeeInfo() public view returns (FeeInfo memory) {
        return feeInfo[address(this)];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdraw failed");
    }

}
