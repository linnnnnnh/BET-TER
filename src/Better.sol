// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

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
    error AlreadyHasTicket();
    error PredictionNotPlayed();
    error GameNotResolved();
    error PredictionNotWon();
    error PredictionGameNotActive();
    error SecondHalftimeGameNotActive();

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
        string team1;
        string team2;
        uint256 startTimePredictionGame;
        uint256 endTimePredictionGame;
        uint256 startTimeSecondHalftimeGame;
        uint256 endTimeSecondHalftimeGame;
        bool active;
        mapping(uint256 => uint256) prizeSupply; // prizeId => supply
        mapping(uint256 => uint256) prizeMinted; // prizeId => minted count
    }

    /// @dev Struct only used as input for createCampaign function
    struct CampaignInput {
        uint256 id;
        string team1;
        string team2;
        uint256 startTimePredictionGame;
        uint256 endTimePredictionGame;
        uint256 startTimeSecondHalftimeGame;
        uint256 endTimeSecondHalftimeGame;
    }

    struct PredictionGame {
        uint256 campaignId;
        string question;
        uint8 team1Score;
        uint8 team2Score;
        bool resolved;
        mapping(address => Prediction) userPrediction;
    }

    /// @notice Score prediction of each team
    struct Prediction {
        bool played;
        uint8 team1Score;
        uint8 team2Score;
    }

    //================================================
    // State Variables
    //================================================

    // --- Oracles & Configuration ---
    IPyth private immutable i_pyth; // 0x23f0e8FAeE7bbb405E7A7C3d60138FCfd43d7509
    IEntropy private immutable i_entropy; // 0xD458261E832415CFd3BAE5E416FdF3230ce6F134
    bytes32 private immutable i_chzUsdPriceId; // 0xe799f456b358a2534aa1b45141d454ac04b444ed23b1440b778549bb758f2b5c

    uint32 private constant CALLBACK_GAS_LIMIT = 200000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    address public trustedDataResolver; // Address authorized to resolve prediction markets
    /// Maximum age of the on-chain price in seconds
    /// @dev 48 hours is for testing purposes, for production use a lower value like 60 seconds
    uint256 private constant MAX_PRICE_AGE = 172800; // 48 hours

    // --- Game State ---
    uint256 public nextCampaignId = 1;
    uint256 public nextPrizeId = 1;
    uint256 public nextTokenId;
    uint256 public constant LOYALTY_PRIZE_ID = 0;
    uint256 public playFeeInUsdCents = 100; // USD cents (e.g., 100 = $1.00)

    // --- Mappings ---
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Prize) public prizes;
    mapping(uint256 => PredictionGame) public predictionGames;
    mapping(address => uint256) public userLoyaltyPoints;
    mapping(address => bool) public userHasHalftimeTicket;
    mapping(uint64 => address) private s_randomnessRequests; // requestId => user address

    //================================================
    // Events
    //================================================

    event CampaignCreated(
        uint256 indexed campaignId,
        string team1,
        string team2,
        uint256 startTimePredictionGame,
        uint256 endTimePredictionGame,
        uint256 startTimeSecondHalftimeGame,
        uint256 endTimeSecondHalftimeGame
    );
    event PredictionGameCreated(uint256 indexed campaignId);
    event PredictionsSubmitted(address indexed user, uint256 indexed campaignId, uint8 team1, uint8 team2);
    event PredictionGameResolved(uint256 indexed campaignId, uint8 team1Score, uint8 team2Score);
    event TicketsAwarded(address indexed user);
    event HeatmapPlayed(address indexed user, uint64 indexed requestId);
    event PrizeAwarded(address indexed user, uint256 prizeId, uint256 tokenId);

    //================================================
    // Constructor
    //================================================

    constructor(
        address _pythAddress,
        bytes32 _chzUsdPriceId,
        address _trustedDataResolver,
        address _initialOwner,
        address _entropyAddress
    ) ERC721("PSG Reward", "PSGR") Ownable(_initialOwner) {
        i_pyth = IPyth(_pythAddress);
        i_chzUsdPriceId = _chzUsdPriceId;
        trustedDataResolver = _trustedDataResolver;
        i_entropy = IEntropy(_entropyAddress);

        // Define the guaranteed loyalty prize
        prizes[LOYALTY_PRIZE_ID] =
            Prize(LOYALTY_PRIZE_ID, "Loyal Supporter Reward", "ipfs://your-loyalty-nft-metadata-uri");
    }

    //================================================
    // Admin Functions
    //================================================

    function createCampaign(CampaignInput memory _campaign) external onlyOwner {
        uint256 campaignId = nextCampaignId;
        campaigns[campaignId].id = _campaign.id;
        campaigns[campaignId].team1 = _campaign.team1;
        campaigns[campaignId].team2 = _campaign.team2;
        campaigns[campaignId].startTimePredictionGame = _campaign.startTimePredictionGame;
        campaigns[campaignId].endTimePredictionGame = _campaign.endTimePredictionGame;
        campaigns[campaignId].startTimeSecondHalftimeGame = _campaign.startTimeSecondHalftimeGame;
        campaigns[campaignId].endTimeSecondHalftimeGame = _campaign.endTimeSecondHalftimeGame;
        nextCampaignId++;

        emit CampaignCreated(
            campaignId,
            _campaign.team1,
            _campaign.team2,
            _campaign.startTimePredictionGame,
            _campaign.endTimePredictionGame,
            _campaign.startTimeSecondHalftimeGame,
            _campaign.endTimeSecondHalftimeGame
        );
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

    function createPredictionGame(uint256 _campaignId, string memory _question) external onlyOwner {
        if (campaigns[_campaignId].startTimePredictionGame == 0) {
            revert CampaignDoesNotExist();
        }
        predictionGames[_campaignId].campaignId = _campaignId;
        predictionGames[_campaignId].question = _question;
        emit PredictionGameCreated(_campaignId);
    }

    /// @notice Called by the trustedDataResolver to provide the final score of the game
    /// @param _campaignId The ID of the campaign
    /// @param _team1Score The score of the first team
    /// @param _team2Score The score of the second team
    /// @dev The players who have submitted predictions will be able to check if they have won a ticket to the second halftime game
    function resolvePredictionGame(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score) external {
        if (msg.sender != trustedDataResolver) {
            revert Unauthorized();
        }
        if (predictionGames[_campaignId].resolved) {
            revert MarketAlreadyResolved();
        }
        if (campaigns[_campaignId].endTimePredictionGame >= block.timestamp || campaigns[_campaignId].active == false) {
            revert PredictionGameNotActive();
        }

        predictionGames[_campaignId].resolved = true;
        predictionGames[_campaignId].team1Score = _team1Score;
        predictionGames[_campaignId].team2Score = _team2Score;

        emit PredictionGameResolved(_campaignId, _team1Score, _team2Score);
    }

    function updatePlayFee(uint256 _playFeeInUsdCents) external onlyOwner {
        playFeeInUsdCents = _playFeeInUsdCents;
    }

    function updateTrustedDataResolver(address _newResolver) external onlyOwner {
        require(_newResolver != address(0), "Invalid resolver address");
        trustedDataResolver = _newResolver;
    }

    //================================================
    // User Functions
    //================================================

    /// @notice Called by the players of the first halftime to play the prediction game
    function submitPredictions(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score) external {
        if (predictionGames[_campaignId].resolved) {
            revert MarketAlreadyResolved();
        }
        if (
            campaigns[_campaignId].startTimePredictionGame > block.timestamp
                || campaigns[_campaignId].endTimePredictionGame < block.timestamp || campaigns[_campaignId].active == false
        ) {
            revert PredictionGameNotActive();
        }
        predictionGames[_campaignId].userPrediction[msg.sender] = Prediction(true, _team1Score, _team2Score);
        emit PredictionsSubmitted(msg.sender, _campaignId, _team1Score, _team2Score);
    }

    /// @notice Called by the players of the prediction game to check if they have won a ticket to the second halftime game
    /// @return wonTicket True if the player has won a ticket, false otherwise
    /// @dev This function checks if the player's prediction matches the final score of the game
    /// @dev Revert if the user has not played the prediction game
    function checkPredictionResult(uint256 _campaignId) external returns (bool) {
        if (campaigns[_campaignId].active == false) {
            revert CampaignNotActive();
        }
        if (!predictionGames[_campaignId].resolved) {
            revert GameNotResolved();
        }
        if (predictionGames[_campaignId].userPrediction[msg.sender].played == false) {
            revert PredictionNotPlayed();
        }
        bool wonTicket = predictionGames[_campaignId].userPrediction[msg.sender].team1Score
            == predictionGames[_campaignId].team1Score
            && predictionGames[_campaignId].userPrediction[msg.sender].team2Score == predictionGames[_campaignId].team2Score;

        if (wonTicket) {
            userHasHalftimeTicket[msg.sender] = true;
            emit TicketsAwarded(msg.sender);
        }

        return wonTicket;
    }

    /// @notice Called by the players who have lost the first halftime game and want to play the heatmap with a free ticket
    /// @dev This function grants the player a free ticket if they have won a ticket to the second halftime game
    /// @dev Revert if the player has not played the prediction game
    /// @dev Revert if the player has already won a ticket
    /// @dev Revert if the campaign is not active
    function getSecondHalftimeFreeTicket(uint256 _campaignId) external {
        if (!campaigns[_campaignId].active) {
            revert CampaignNotActive();
        }
        if (userHasHalftimeTicket[msg.sender]) {
            revert AlreadyHasTicket();
        }
        if (!predictionGames[_campaignId].resolved) {
            revert GameNotResolved();
        }

        // Verify user actually won their prediction
        Prediction memory userPred = predictionGames[_campaignId].userPrediction[msg.sender];
        if (!userPred.played) {
            revert PredictionNotPlayed();
        }

        bool wonPrediction = userPred.team1Score == predictionGames[_campaignId].team1Score
            && userPred.team2Score == predictionGames[_campaignId].team2Score;

        if (!wonPrediction) {
            revert PredictionNotWon();
        }

        userHasHalftimeTicket[msg.sender] = true;
        emit TicketsAwarded(msg.sender);
    }

    /// @notice Called by the players who:
    /// - Won the first halftime game and has a ticket granted by the resolver
    /// - OR have lost the first halftime game and have won a free ticket to the second halftime game after calling getSecondHalftimeFreeTicket
    /// @dev Revert if the campaign is not active
    /// @dev Revert if the player has no ticket
    function playSecondHalftimeWithTicket(uint256 _campaignId) external {
        if (!campaigns[_campaignId].active) {
            revert CampaignNotActive();
        }
        if (userHasHalftimeTicket[msg.sender] == false) {
            revert NoFreeTickets();
        }
        if (
            campaigns[_campaignId].startTimeSecondHalftimeGame > block.timestamp
                || campaigns[_campaignId].endTimeSecondHalftimeGame < block.timestamp
        ) {
            revert SecondHalftimeGameNotActive();
        }

        userHasHalftimeTicket[msg.sender] = false;

        // Generate unique random seed
        bytes32 userRandomNumber = keccak256(abi.encodePacked(msg.sender, _campaignId, block.timestamp, "ticket"));

        _requestRandomness(userRandomNumber);
    }

    /// @notice Called by the players who:
    /// - Have lost the first halftime game
    /// - Don't want to watch the video and do the quiz
    /// - Want to play the second halftime game with a paid ticket
    /// @dev This function grants the player a paid ticket
    /// @dev Revert if the campaign is not active
    function playSecondHalftimeWithChz(uint256 _campaignId) external payable {
        if (!campaigns[_campaignId].active) {
            revert CampaignNotActive();
        }
        uint256 requiredChz = getPlayFeeInUsdCents();
        if (msg.value < requiredChz) {
            revert InsufficientChzSent();
        }
        if (
            campaigns[_campaignId].startTimeSecondHalftimeGame > block.timestamp
                || campaigns[_campaignId].endTimeSecondHalftimeGame < block.timestamp
        ) {
            revert SecondHalftimeGameNotActive();
        }

        // Generate unique random seed
        bytes32 userRandomNumber =
            keccak256(abi.encodePacked(msg.sender, _campaignId, block.timestamp, msg.value, "chz"));

        _requestRandomness(userRandomNumber);
    }

    //================================================
    // Oracle & Internal Logic
    //================================================

    function getPlayFeeInUsdCents() public view returns (uint256) {
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
        // In a real contract, check prize supply for the campaign
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
