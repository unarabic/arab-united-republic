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

app.listen(3001, () => console.log("Server running on port 3001"));import React, { useState } from "react";
import { ethers } from "ethers";
import CONTRACT_ABI from "./abi/DinarArabToken.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

function App() {
  const [amount, setAmount] = useState("");
  const [agent, setAgent] = useState("");
  
  const requestWithdrawal = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.requestCashWithdrawal(ethers.utils.parseUnits(amount, 18), agent);
    await tx.wait();
    alert("Request sent successfully!");
  };

  return (
    <div>
      <h1>طلب سحب نقدي</h1>
      <input type="text" placeholder="المبلغ" value={amount} onChange={e => setAmount(e.target.value)} />
      <input type="text" placeholder="عنوان الوكيل المفوض" value={agent} onChange={e => setAgent(e.target.value)} />
      <button onClick={requestWithdrawal}>إرسال الطلب</button>
    </div>
  );
}

export default App;<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>خدمات الجمهورية العربية المتحدة</title>
<style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; direction: rtl; }
  .map { width: 100%; height: 500px; background: url('map-placeholder.png') no-repeat center/contain; position: relative; }
  .service { position: absolute; cursor: pointer; padding: 5px 10px; background: #0077cc; color: white; border-radius: 5px; }
  #info { margin-top: 20px; padding: 15px; background: white; border-radius: 10px; }
</style>
</head>
<body>

<h1>الجمهورية العربية المتحدة – الخدمات الرقمية</h1>

<div class="map">
  <div class="service" style="top: 50px; left: 100px;" onclick="showInfo('البنك المركزي')">البنك المركزي</div>
  <div class="service" style="top: 150px; left: 300px;" onclick="showInfo('البرلمان')">البرلمان</div>
  <div class="service" style="top: 250px; left: 200px;" onclick="showInfo('وزارة الاقتصاد')">وزارة الاقتصاد</div>
  <div class="service" style="top: 350px; left: 400px;" onclick="showInfo('وزارة التعليم')">وزارة التعليم</div>
  <div class="service" style="top: 450px; left: 150px;" onclick="showInfo('وزارة الصحة')">وزارة الصحة</div>
</div>

<div id="info">
  اضغط على أي وزارة أو خدمة لمعرفة التفاصيل.
</div>

<script>
function showInfo(serviceName) {
  let infoText = "";
  switch(serviceName) {
    case "البنك المركزي":
      infoText = "البنك المركزي يصدر ويُدير الدينار العربي (DAD) ويشرف على التفويضات المالية.";
      break;
    case "البرلمان":
      infoText = "البرلمان الرقمي يصدر التشريعات وينظم السياسات العامة للجمهورية.";
      break;
    case "وزارة الاقتصاد":
      infoText = "وزارة الاقتصاد الذكية تدير التجارة الرقمية، الأسواق المشتركة، والاستثمارات.";
      break;
    case "وزارة التعليم":
      infoText = "وزارة التعليم توفر المنصات التعليمية الرقمية والتدريب الافتراضي للمواطنين.";
      break;
    case "وزارة الصحة":
      infoText = "وزارة الصحة الذكية توفر خدمات الرعاية الصحية الرقمية، مثل حجز المواعيد ومتابعة العلاج.";
      break;
    default:
      infoText = "اختر خدمة لمعرفة التفاصيل.";
  }
  document.getElementById("info").innerHTML = `<h3>${serviceName}</h3><p>${infoText}</p>`;
}
</script>

</body>
</html>