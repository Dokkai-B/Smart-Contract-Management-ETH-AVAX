/*
    INSTRUCTIONS
    For this project, create a simple contract with 2-3 functions. Then show the values of those functions in frontend of the application. You can use this starter template to get a head start.
    
    REQUIREMENTS
    1. You will submit your project on GitHub, so you will need an account and know how to share a public repository
    2. You will include a README.md file in your project's GitHub repository (root folder). The README should provide a concise and clear overview of your project's purpose and functionality. This will help other developers understand the motivation behind your project and how to use it.
       - To assist you in creating your README, we have provided a starter template you can use.
       - This is an example of a README. Note that yours does not need to be this detailed. This is simply a reference.
    3. You will record a video of 5 mins or less reviewing the three contracts you choose - Loom is a great tool to use if needed.
       - In the video, you will do a code walk-through where you share your screen and explain the code. In the video, explain the code and what it is doing.
       - Note: we will accept just audio with a screenshare, but, we highly recommend doing the video and screenshare since it will better prepare you for job interviews.
    4. For some assessments/projects, you will need to share a transaction ID. (This project is NOT one of them.)
*/

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Transfer(address to, uint256 amount);

    constructor() payable {
        owner = payable(msg.sender);
        balance = msg.value;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += msg.value;
        emit Deposit(msg.value);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(_withdrawAmount);
    }

    function transfer(address payable _to, uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _amount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _amount
            });
        }
        balance -= _amount;
        _to.transfer(_amount);
        emit Transfer(_to, _amount);
    }
}

