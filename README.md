# arab-united-republic
مشروع الجمهورية العربية المتحدة الرقمية – يتضمن البرلمان الافتراضي، البنك المركزي، والوزارات الذكية.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DinarArabToken is ERC20, Ownable {

    // Mapping to store authorized cash withdrawal agents
    mapping(address => bool) public authorizedAgents;

    // Event for logging authorized agents
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);
    event CashWithdrawalRequested(address indexed user, uint256 amount, address indexed agent);

    constructor(uint256 initialSupply) ERC20("Dinar Arab", "DAD") {
        _mint(msg.sender, initialSupply);
    }

    // Owner can authorize an agent
    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    // Owner can revoke authorization
    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }

    // User requests cash withdrawal through an authorized agent
    function requestCashWithdrawal(uint256 amount, address agent) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(authorizedAgents[agent], "Agent not authorized");

        _burn(msg.sender, amount); // Deduct digital balance
        emit CashWithdrawalRequested(msg.sender, amount, agent);
    }
}// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DinarArabToken is ERC20, Ownable {
    mapping(address => bool) public authorizedAgents;

    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);
    event CashWithdrawalRequested(address indexed user, uint256 amount, address indexed agent);

    constructor(uint256 initialSupply) ERC20("Dinar Arab", "DAD") {
        _mint(msg.sender, initialSupply);
    }

    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }

    function requestCashWithdrawal(uint256 amount, address agent) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(authorizedAgents[agent], "Agent not authorized");

        _burn(msg.sender, amount);
        emit CashWithdrawalRequested(msg.sender, amount, agent);
    }
}const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ABI = require("../frontend/src/abi/DinarArabToken.json");
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

app.get("/agents", async (req, res) => {
  // List authorized agents (loop through mapping in practice)
  res.json({ message: "Use contract events to fetch authorized agents" });
});

app.post("/withdraw", async (req, res) => {
  const { userAddress, amount, agentAddress } = req.body;

  try {
    const tx = await contract.connect(wallet).requestCashWithdrawal(amount, agentAddress, { from: userAddress });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));