// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WOW Token - Women On Win / Win Or Win Fan Token
 * @notice A fan token designed to promote and support women's sports through engagement rewards
 * 
 * @dev This token serves as both a symbolic and utility token for the Better betting platform,
 * specifically focused on creating a positive feedback loop for women's sports engagement.
 * 🚀 UTILITY:
 * - Unlock tickets for women's matches
 * - Claim merchandise and exclusive perks
 * - Vote on which women's clubs receive platform support
 * - Access gated content and VIP channels
 * This design ensures WOW tokens represent genuine community participation
 * rather than speculative trading, aligning with the mission to support women's sports.
 */
contract WOWToken is ERC20, Ownable {
    //================================================
    // Configuration
    //================================================

    // Token supply limits
    uint256 public constant MAX_SUPPLY = 10000000 * 10 ** 18; // 10 million WOW tokens max
    uint256 public totalMinted;

    // Transfer restrictions
    bool public transfersEnabled = false; // Start with transfers disabled
    mapping(address => bool) public authorizedTransferContracts; // Contracts that can facilitate transfers

    //================================================
    // Earning Mechanisms
    //================================================

    struct MissionReward {
        uint256 amount;
        bool active;
        string description;
    }

    mapping(string => MissionReward) public missionRewards;
    mapping(address => mapping(string => bool)) public userCompletedMissions;

    //================================================
    // Events
    //================================================

    event TokensEarned(address indexed user, uint256 amount, string reason);
    event MissionCompleted(address indexed user, string missionId, uint256 reward);
    event TransfersToggled(bool enabled);
    event AuthorizedContractUpdated(address indexed contractAddr, bool authorized);
    event MissionUpdated(string missionId, uint256 reward, bool active);

    //================================================
    // Constructor
    //================================================

    constructor(address _initialOwner) ERC20("WOW Token", "WOW") Ownable(_initialOwner) {
        // Initialize some default missions
        _setMission("watch_womens_match", 5 * 10 ** 18, true, "Watch a women's match");
        _setMission("quiz_completion", 3 * 10 ** 18, true, "Complete sports quiz");
        _setMission("referral", 10 * 10 ** 18, true, "Refer a new user");
        _setMission("bet_loss_consolation", 2 * 10 ** 18, true, "Consolation for bet loss");
    }

    //================================================
    // Earning Functions (Only Owner/Authorized)
    //================================================

    /**
     * @notice Award tokens for losing a game
     */
    function awardBetLossTokens(address user, uint256 amount) external onlyOwner {
        _mintTokens(user, amount, "bet_loss_consolation");
    }

    /**
     * @notice Award tokens for completing a mission
     */
    function completeMission(address user, string memory missionId) external onlyOwner {
        require(missionRewards[missionId].active, "Mission not active");
        require(!userCompletedMissions[user][missionId], "Mission already completed");

        uint256 reward = missionRewards[missionId].amount;
        userCompletedMissions[user][missionId] = true;

        _mintTokens(user, reward, string(abi.encodePacked("mission:", missionId)));
        emit MissionCompleted(user, missionId, reward);
    }

    /**
     * @notice General token awarding function
     */
    function awardTokens(address user, uint256 amount, string memory reason) external onlyOwner {
        _mintTokens(user, amount, reason);
    }

    //================================================
    // Admin Functions
    //================================================

    /**
     * @notice Set or update a mission reward
     */
    function setMission(string memory missionId, uint256 reward, bool active, string memory description)
        external
        onlyOwner
    {
        _setMission(missionId, reward, active, description);
    }

    function _setMission(string memory missionId, uint256 reward, bool active, string memory description) internal {
        missionRewards[missionId] = MissionReward(reward, active, description);
        emit MissionUpdated(missionId, reward, active);
    }

    /**
     * @notice Toggle transfer functionality (for potential future economy)
     */
    function setTransfersEnabled(bool enabled) external onlyOwner {
        transfersEnabled = enabled;
        emit TransfersToggled(enabled);
    }

    /**
     * @notice Authorize contracts that can facilitate transfers (like DEX, marketplace)
     */
    function setAuthorizedTransferContract(address contractAddr, bool authorized) external onlyOwner {
        authorizedTransferContracts[contractAddr] = authorized;
        emit AuthorizedContractUpdated(contractAddr, authorized);
    }

    //================================================
    // Internal Functions
    //================================================

    function _mintTokens(address user, uint256 amount, string memory reason) internal {
        require(user != address(0), "Cannot mint to zero address");
        require(totalMinted + amount <= MAX_SUPPLY, "Exceeds maximum supply");

        totalMinted += amount;
        _mint(user, amount);

        emit TokensEarned(user, amount, reason);
    }

    //================================================
    // Transfer Restrictions (Soulbound/Limited Transfer)
    //================================================

    /**
     * @notice Override _update to implement transfer restrictions
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        // Allow minting (from = address(0))
        if (from == address(0)) {
            super._update(from, to, value);
            return;
        }

        // If transfers are disabled, only allow authorized contracts
        if (!transfersEnabled) {
            require(
                authorizedTransferContracts[msg.sender] || authorizedTransferContracts[from]
                    || authorizedTransferContracts[to],
                "Transfers not enabled"
            );
        }

        super._update(from, to, value);
    }

    //================================================
    // View Functions
    //================================================

    /**
     * @notice Get user's WOW token balance in whole tokens
     */
    function tokensOf(address user) external view returns (uint256) {
        return balanceOf(user) / 10 ** 18;
    }

    /**
     * @notice Check if user completed a specific mission
     */
    function hasCompletedMission(address user, string memory missionId) external view returns (bool) {
        return userCompletedMissions[user][missionId];
    }

    /**
     * @notice Get mission details
     */
    function getMission(string memory missionId)
        external
        view
        returns (uint256 reward, bool active, string memory description)
    {
        MissionReward memory mission = missionRewards[missionId];
        return (mission.amount, mission.active, mission.description);
    }

    /**
     * @notice Check remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }

    /**
     * @notice Check if transfers are currently allowed
     */
    function areTransfersEnabled() external view returns (bool) {
        return transfersEnabled;
    }
}
