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
}