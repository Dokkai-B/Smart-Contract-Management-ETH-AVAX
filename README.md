markdown
Copy code
# Online Metacrafters Bank

## Description

Online Metacrafters Bank is a decentralized application (DApp) that allows users to interact with a smart contract on the Ethereum blockchain. Users can deposit, withdraw, and transfer Ether (ETH) using the DApp, which is connected to their MetaMask wallet. The application is built using Solidity for the smart contract and Next.js with Chakra UI for the frontend.

## Features

- Connect to MetaMask wallet
- Display user's Ethereum account address and balance
- Deposit ETH into the smart contract
- Withdraw ETH from the smart contract
- Transfer ETH to another Ethereum address
- Error handling for insufficient balance and other transaction errors

## Technologies Used

- Solidity
- Hardhat
- Next.js
- Chakra UI
- Ethers.js
- MetaMask

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MetaMask extension installed in your browser

### Clone the Repository

```bash
git clone https://github.com/your-username/online-metacrafters-bank.git
cd online-metacrafters-bank
Install Dependencies
bash
Copy code
npm install
Configure MetaMask
Open MetaMask and create a new account if you don't have one.
Connect MetaMask to the local Ethereum network:
Click on the network dropdown and select "Localhost 8545".
If "Localhost 8545" is not available, click on "Add Network" and configure it with the following details:
Network Name: Localhost 8545
New RPC URL: http://localhost:8545
Chain ID: 1337
Compile and Deploy the Smart Contract
Start a local Ethereum network using Hardhat:

bash
Copy code
npx hardhat node
Open a new terminal in the project directory and deploy the smart contract:

bash
Copy code
npx hardhat run scripts/deploy.js --network localhost
Note the contract address displayed in the terminal after deployment. Update the contractAddress variable in pages/index.js with this address.

Run the Development Server
bash
Copy code
npm run dev
Open the Application
Open your browser and navigate to http://localhost:3000 to access the Online Metacrafters Bank application.

Usage
Open the application in your browser.
Click on "Connect MetaMask" to connect your MetaMask wallet to the application.
Once connected, you will see your Ethereum account address and balance displayed.
You can now perform the following actions:
Deposit: Enter an amount in ETH and click "Deposit" to deposit ETH into the smart contract.
Withdraw: Enter an amount in ETH and click "Withdraw" to withdraw ETH from the smart contract.
Transfer: Enter a recipient address and an amount in ETH, then click "Transfer" to send ETH to another Ethereum address.
Smart Contract
The smart contract Assessment.sol is located in the contracts directory. It contains the logic for depositing, withdrawing, and transferring ETH.

Frontend
The frontend is built using Next.js and Chakra UI. The main application file is pages/index.js, which handles the interaction with the smart contract using Ethers.js.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
MetaMask
Hardhat
Chakra UI
Ethers.js
Next.js
csharp
