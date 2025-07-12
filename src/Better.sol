// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

contract Better is Ownable, ERC721URIStorage, IEntropyConsumer {
    //================================================
    // Custom Errors
    //================================================

    error Unauthorized();
    error InputArrayMismatch();
    error CampaignDoesNotExist();
    error MarketAlreadyResolved();
    error CampaignNotActive();
    error NoFreeTickets();
    error InsufficientChzSent();
    error RequestNotFound();

    //================================================
    // Structs
    //================================================

    struct Prize {
        uint256 id;
        string description;
        string uri; // IPFS URI for NFT metadata
    }

    struct Campaign {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        bool active;
        mapping(uint256 => uint256) prizeSupply; // prizeId => supply
        mapping(uint256 => uint256) prizeMinted; // prizeId => minted count
    }

    struct PredictionMarket {
        uint256 campaignId;
        string[] questions; // e.g., "First goalscorer?"
        // In a real-world scenario, answers would be more complex.
        // For this example, we assume a simple index-based answer.
        bool resolved;
        mapping(address => uint8[]) userPredictions;
    }

    //================================================
    // State Variables
    //================================================

    // --- Oracles & Configuration ---
    IPyth private immutable i_pyth;
    IEntropy private immutable i_entropy;
    bytes32 private immutable i_entropyId;
    bytes32 private immutable i_chzUsdPriceId;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;

    uint32 private constant CALLBACK_GAS_LIMIT = 200000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    address public trustedDataResolver; // Address authorized to resolve prediction markets
    // Maximum age of the on-chain price in seconds
    uint256 private constant MAX_PRICE_AGE = 60;

    // --- Game State ---
    uint256 public nextCampaignId = 1;
    uint256 public nextPrizeId = 1;
    uint256 public nextTokenId;
    uint256 public constant LOYALTY_PRIZE_ID = 0;
    uint256 public playFeeInUsdCents = 100; // USD cents (e.g., 100 = $1.00)

    // --- Mappings ---
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Prize) public prizes;
    mapping(uint256 => PredictionMarket) public predictionMarkets;
    mapping(address => uint256) public userLoyaltyPoints;
    mapping(address => uint256) public userFreeTickets;
    mapping(uint64 => address) private s_randomnessRequests; // requestId => user address

    //================================================
    // Events
    //================================================

    event CampaignCreated(uint256 indexed campaignId, uint256 startTime, uint256 endTime);
    event PredictionMarketCreated(uint256 indexed campaignId);
    event PredictionsSubmitted(address indexed user, uint256 indexed campaignId, uint8[] predictions);
    event PredictionMarketResolved(uint256 indexed campaignId, address indexed resolver);
    event TicketsAwarded(address indexed user, uint256 amount);
    event HeatmapPlayed(address indexed user, uint64 indexed requestId);
    event PrizeAwarded(address indexed user, uint256 prizeId, uint256 tokenId);

    //================================================
    // Constructor
    //================================================

    constructor(
        address _pythAddress,
        bytes32 _chzUsdPriceId,
        uint64 _subscriptionId,
        bytes32 _keyHash,
        address _trustedDataResolver,
        address _initialOwner,
        address _entropyAddress
    ) ERC721("PSG Reward", "PSGR") Ownable(_initialOwner) {
        i_pyth = IPyth(_pythAddress);
        i_chzUsdPriceId = _chzUsdPriceId;
        i_subscriptionId = _subscriptionId;
        i_keyHash = _keyHash;
        trustedDataResolver = _trustedDataResolver;
        i_entropy = IEntropy(_entropyAddress);

        // Define the guaranteed loyalty prize
        prizes[LOYALTY_PRIZE_ID] =
            Prize(LOYALTY_PRIZE_ID, "Loyal Supporter Reward", "ipfs://your-loyalty-nft-metadata-uri");
    }

    //================================================
    // Admin Functions
    //================================================

    function createCampaign(uint256 _startTime, uint256 _endTime) external onlyOwner {
        uint256 campaignId = nextCampaignId;
        campaigns[campaignId].id = campaignId;
        campaigns[campaignId].startTime = _startTime;
        campaigns[campaignId].endTime = _endTime;
        nextCampaignId++;
        emit CampaignCreated(campaignId, _startTime, _endTime);
    }

    function setCampaignActive(uint256 _campaignId, bool _isActive) external onlyOwner {
        campaigns[_campaignId].active = _isActive;
    }

    function addPrize(string memory _description, string memory _uri, uint256 _supply, uint256 _campaignId)
        external
        onlyOwner
    {
        uint256 prizeId = nextPrizeId;
        prizes[prizeId] = Prize(prizeId, _description, _uri);
        campaigns[_campaignId].prizeSupply[prizeId] = _supply;
        nextPrizeId++;
    }

    function createPredictionMarket(uint256 _campaignId, string[] memory _questions) external onlyOwner {
        if (campaigns[_campaignId].startTime == 0) {
            revert CampaignDoesNotExist();
        }
        predictionMarkets[_campaignId].campaignId = _campaignId;
        predictionMarkets[_campaignId].questions = _questions;
        emit PredictionMarketCreated(_campaignId);
    }

    function resolvePredictionsForUsers(uint256 _campaignId, address[] memory _users, uint256[] memory _ticketCounts)
        external
    {
        if (msg.sender != trustedDataResolver) {
            revert Unauthorized();
        }
        if (_users.length != _ticketCounts.length) {
            revert InputArrayMismatch();
        }
        predictionMarkets[_campaignId].resolved = true;
        for (uint256 i = 0; i < _users.length; i++) {
            userFreeTickets[_users[i]] += _ticketCounts[i];
            emit TicketsAwarded(_users[i], _ticketCounts[i]);
        }
        emit PredictionMarketResolved(_campaignId, msg.sender);
    }

    function updatePlayFee(uint256 _playFeeInUsdCents) external onlyOwner {
        playFeeInUsdCents = _playFeeInUsdCents;
    }

    //================================================
    // User Functions
    //================================================

    function submitPredictions(uint256 _campaignId, uint8[] memory _predictions) external {
        if (predictionMarkets[_campaignId].resolved) {
            revert MarketAlreadyResolved();
        }
        predictionMarkets[_campaignId].userPredictions[msg.sender] = _predictions;
        emit PredictionsSubmitted(msg.sender, _campaignId, _predictions);
    }

    function playHeatmapWithTicket(uint256 _campaignId) external {
        if (!campaigns[_campaignId].active) {
            revert CampaignNotActive();
        }
        if (userFreeTickets[msg.sender] == 0) {
            revert NoFreeTickets();
        }
        userFreeTickets[msg.sender]--;

        // Generate unique random seed
        bytes32 userRandomNumber = keccak256(abi.encodePacked(msg.sender, _campaignId, block.timestamp, "ticket"));

        _requestRandomness(userRandomNumber);
    }

    function playHeatmapWithChz(uint256 _campaignId) external payable {
        if (!campaigns[_campaignId].active) {
            revert CampaignNotActive();
        }
        uint256 requiredChz = getSpinCostInChz();
        if (msg.value < requiredChz) {
            revert InsufficientChzSent();
        }

        // Generate unique random seed
        bytes32 userRandomNumber =
            keccak256(abi.encodePacked(msg.sender, _campaignId, block.timestamp, msg.value, "chz"));

        _requestRandomness(userRandomNumber);
    }

    //================================================
    // Oracle & Internal Logic
    //================================================

    function getSpinCostInChz() public view returns (uint256) {
        PythStructs.Price memory price = i_pyth.getPriceNoOlderThan(i_chzUsdPriceId, MAX_PRICE_AGE);
        // price.price is the price of 1 CHZ in USD (e.g., 5000000 with expo -8 for $0.05)
        // price.expo is the exponent (e.g., -8)
        // Actual price = price.price * (10^price.expo)

        // Handle negative prices by reverting - prices should always be positive
        require(price.price > 0, "Invalid price");

        // Safe conversion from int64 to uint256
        uint256 priceUint = uint256(uint64(price.price));

        // Calculate cost in CHZ using fixed-point math to avoid precision loss
        // Formula: (playFeeInUsdCents / 100) / (priceUint * 10^expo)
        // Became: (playFeeInUsdCents * 10^(-expo)) / (priceUint * 100)

        uint256 cost;
        if (price.expo >= 0) {
            // If expo is positive, multiply the numerator by 10^expo
            cost = (playFeeInUsdCents * 1e18 * (10 ** uint256(int256(price.expo)))) / (priceUint * 100);
        } else {
            // If expo is negative, multiply the denominator by 10^(-expo)
            cost = (playFeeInUsdCents * 1e18) / (priceUint * 100 * (10 ** uint256(int256(-price.expo))));
        }

        return cost;
    }

    function _requestRandomness(bytes32 userRandomNumber) internal {
        // Get the default randomness provider
        address provider = i_entropy.getDefaultProvider();

        // Request a random number from Entropy and get the sequence number of the request
        uint256 fee = i_entropy.getFee(provider);
        uint64 sequenceNumber = i_entropy.requestWithCallback{value: fee}(provider, userRandomNumber);

        // Store the sequence number to be used in the entropyCallback
        s_randomnessRequests[sequenceNumber] = msg.sender;

        emit HeatmapPlayed(msg.sender, sequenceNumber);
    }

    // @param sequenceNumber The sequence number of the request.
    // @param provider The address of the provider that generated the random number. If your app uses multiple providers, you can use this argument to distinguish which one is calling the app back.
    // @param randomNumber The generated random number.
    // This method is called by the entropy contract when a random number is generated.
    // This method **must** be implemented on the same contract that requested the random number.
    // This method should **never** return an error -- if it returns an error, then the keeper will not be able to invoke the callback.
    // If you are having problems receiving the callback, the most likely cause is that the callback is erroring.
    // See the callback debugging guide here to identify the error https://docs.pyth.network/entropy/debug-callback-failures
    function entropyCallback(uint64 sequenceNumber, address provider, bytes32 randomNumber) internal override {
        // Validate that the callback is from our expected provider
        require(provider == i_entropy.getDefaultProvider(), "Unexpected provider");

        address user = s_randomnessRequests[sequenceNumber];
        if (user == address(0)) {
            revert RequestNotFound();
        }
        delete s_randomnessRequests[sequenceNumber];

        // Get a value between 0 and 99
        uint256 randomValue = uint256(randomNumber) % 100; 

        // Example Prize Logic: 5% top prize, 15% mid prize, 80% loyalty point
        // This should be configured per campaign for more flexibility
        uint256 prizeIdToAward;
        bool hasWon = true;

        if (randomValue < 5) {
            // 0-4 (5%)
            prizeIdToAward = 1; // Top prize ID
        } else if (randomValue < 20) {
            // 5-19 (15%)
            prizeIdToAward = 2; // Mid-tier prize ID
        } else {
            hasWon = false;
        }

        if (hasWon) {
            _awardPrize(user, prizeIdToAward);
        }

        _incrementLoyalty(user);
    }

    function _incrementLoyalty(address _user) internal {
        userLoyaltyPoints[_user]++;
        if (userLoyaltyPoints[_user] >= 5) {
            _awardPrize(_user, LOYALTY_PRIZE_ID);
            userLoyaltyPoints[_user] = 0; // Reset loyalty
        }
    }

    function _awardPrize(address _user, uint256 _prizeId) internal {
        // In a real contract, you would check prize supply for the campaign
        // require(campaigns[activeCampaignId].prizeMinted[_prizeId] < campaigns[activeCampaignId].prizeSupply[_prizeId], "Prize sold out");
        // campaigns[activeCampaignId].prizeMinted[_prizeId]++;

        uint256 tokenId = nextTokenId;
        _mint(_user, tokenId);
        _setTokenURI(tokenId, prizes[_prizeId].uri);
        nextTokenId++;
        emit PrizeAwarded(_user, _prizeId, tokenId);
    }

    // This method is required by the IEntropyConsumer interface.
    // It returns the address of the entropy contract which will call the callback.
    function getEntropy() internal view override returns (address) {
        return address(i_entropy);
    }
    
    //================================================
    // View Functions
    //================================================

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return tokenURI(_tokenId);
    }
}
