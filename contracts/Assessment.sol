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
    // State variables
    address payable public owner; // The owner of the contract
    uint256 public totalFunds; // The total funds in the contract
    uint256 public lockTime; // The time until which withdrawals are locked

    // Events to log significant contract activities
    event FundsDeposited(uint256 amount);
    event FundsWithdrawn(uint256 amount);
    event FundsTransferred(address to, uint256 amount);
    event LockTimeSet(uint256 lockTime);

    // Constructor to initialize the contract with an initial fund balance
    constructor(uint256 initialFunds) payable {
        owner = payable(msg.sender); // Set the contract deployer as the owner
        totalFunds = initialFunds; // Set the initial funds
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Function to check the total funds available in the contract
    function checkTotalFunds() public view returns (uint256) {
        return totalFunds;
    }

    // Function to add funds to the contract, restricted to the owner
    function addFunds(uint256 amount) public payable onlyOwner {
        uint256 previousFunds = totalFunds;
        totalFunds += amount; // Increase the total funds by the specified amount
        assert(totalFunds == previousFunds + amount); // Ensure the funds have been added correctly
        emit FundsDeposited(amount); // Emit an event to log the deposit
    }

    // Custom error to handle insufficient funds for withdrawal
    error InsufficientFunds(uint256 available, uint256 requested);

    // Function to remove funds from the contract, restricted to the owner
    function removeFunds(uint256 amount) public onlyOwner {
        require(block.timestamp >= lockTime, "Cannot withdraw funds before the lock time");
        if (totalFunds < amount) {
            // Revert with custom error if there are insufficient funds
            revert InsufficientFunds({available: totalFunds, requested: amount});
        }
        uint256 previousFunds = totalFunds;
        totalFunds -= amount; // Decrease the total funds by the specified amount
        assert(totalFunds == previousFunds - amount); // Ensure the funds have been removed correctly
        emit FundsWithdrawn(amount); // Emit an event to log the withdrawal
    }

    // Function to transfer funds to a specified address, restricted to the owner
    function transferFunds(address payable recipient, uint256 amount) public onlyOwner {
        require(totalFunds >= amount, "Insufficient funds for transfer");
        uint256 previousFunds = totalFunds;
        totalFunds -= amount; // Decrease the total funds by the specified amount
        recipient.transfer(amount); // Transfer the specified amount to the recipient
        assert(totalFunds == previousFunds - amount); // Ensure the funds have been transferred correctly
        emit FundsTransferred(recipient, amount); // Emit an event to log the transfer
    }

    // Function to set a time lock for withdrawals, restricted to the owner
    function setLockTime(uint256 time) public onlyOwner {
        lockTime = time; // Set the lock time
        emit LockTimeSet(time); // Emit an event to log the lock time setting
    }

    // Function to verify if a given address is the owner of the contract
    function verifyOwner(address addr) public view returns (bool) {
        return addr == owner; // Return true if the address is the owner, false otherwise
    }
}
