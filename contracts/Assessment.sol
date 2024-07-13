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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessingGame {
    uint public difficulty;
    uint private secretNumber;
    address public owner;
    mapping(address => int) public balances; // Store the net winnings or losses of each user

    event BetPlaced(address indexed player, bool won, uint amount);
    event BalanceUpdated(address indexed player, int balance);

    constructor() {
        owner = msg.sender;
    }

    function setDifficulty(uint _difficulty) public {
        require(msg.sender == owner, "Only owner can set the difficulty");
        difficulty = _difficulty;
        setSecretNumber();
    }

    function setSecretNumber() private {
        if (difficulty == 1) {
            secretNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10 + 1;
        } else if (difficulty == 2) {
            secretNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 50 + 1;
        } else if (difficulty == 3) {
            secretNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100 + 1;
        }
    }

    function placeBet(uint guess) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0");

        // Check if bet amount is within the allowed range
        (uint minBet, uint maxBet) = getBetRange();
        require(msg.value >= minBet && msg.value <= maxBet, "Bet amount out of range for current difficulty");

        bool won = guess == secretNumber;
        uint multiplier = getMultiplier();
        uint winnings = msg.value * multiplier;

        if (won) {
            require(address(this).balance >= winnings, "Contract has insufficient funds");
            balances[msg.sender] += int(winnings - msg.value);
            payable(msg.sender).transfer(winnings); // Winner gets the bet amount multiplied
            emit BalanceUpdated(msg.sender, balances[msg.sender]);
        } else {
            balances[msg.sender] -= int(msg.value);
            emit BalanceUpdated(msg.sender, balances[msg.sender]);
        }

        emit BetPlaced(msg.sender, won, msg.value);
        // Ensure secret number is reset after every bet
        setSecretNumber();
    }

    function getMultiplier() private view returns (uint) {
        if (difficulty == 1) {
            return 1;
        } else if (difficulty == 2) {
            return 2;
        } else if (difficulty == 3) {
            return 3;
        }
        return 1;
    }

    function getBetRange() public view returns (uint min, uint max) {
        if (difficulty == 1) {
            return (0.5 ether, 2 ether);
        } else if (difficulty == 2) {
            return (2 ether, 5 ether);
        } else if (difficulty == 3) {
            return (5 ether, 10 ether);
        }
        return (0.1 ether, 0.1 ether); // Default fallback
    }

    // Uncomment the following function to add the revealNumber functionality
    
    function revealNumber() public view returns (uint) {
        return secretNumber;
    }
    

    // Fallback function to accept ETH sent directly to the contract
    receive() external payable {}
}

