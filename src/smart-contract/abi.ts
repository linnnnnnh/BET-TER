export const engagementPlatformAbi = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_pythAddress", "type": "address", "internalType": "address" },
      { "name": "_chzUsdPriceId", "type": "bytes32", "internalType": "bytes32" },
      { "name": "_trustedDataResolver", "type": "address", "internalType": "address" },
      { "name": "_initialOwner", "type": "address", "internalType": "address" },
      { "name": "_entropyAddress", "type": "address", "internalType": "address" },
      { "name": "_wowTokenAddress", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "LOYALTY_PRIZE_ID",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "_entropyCallback",
    "inputs": [
      { "name": "sequence", "type": "uint64", "internalType": "uint64" },
      { "name": "provider", "type": "address", "internalType": "address" },
      { "name": "randomNumber", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addPrize",
    "inputs": [
      { "name": "_description", "type": "string", "internalType": "string" },
      { "name": "_uri", "type": "string", "internalType": "string" },
      { "name": "_supply", "type": "uint256", "internalType": "uint256" },
      { "name": "_campaignId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "campaigns",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" },
      { "name": "team1", "type": "string", "internalType": "string" },
      { "name": "team2", "type": "string", "internalType": "string" },
      { "name": "startTimePredictionGame", "type": "uint256", "internalType": "uint256" },
      { "name": "endTimePredictionGame", "type": "uint256", "internalType": "uint256" },
      { "name": "startTimeSecondHalftimeGame", "type": "uint256", "internalType": "uint256" },
      { "name": "endTimeSecondHalftimeGame", "type": "uint256", "internalType": "uint256" },
      { "name": "active", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "checkPredictionResult",
    "inputs": [{ "name": "_campaignId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createCampaign",
    "inputs": [
      {
        "name": "_campaign",
        "type": "tuple",
        "internalType": "struct Better.CampaignInput",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "team1", "type": "string", "internalType": "string" },
          { "name": "team2", "type": "string", "internalType": "string" },
          { "name": "startTimePredictionGame", "type": "uint256", "internalType": "uint256" },
          { "name": "endTimePredictionGame", "type": "uint256", "internalType": "uint256" },
          { "name": "startTimeSecondHalftimeGame", "type": "uint256", "internalType": "uint256" },
          { "name": "endTimeSecondHalftimeGame", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createPredictionGame",
    "inputs": [
      { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
      { "name": "_question", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayFeeInUsdCents",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSecondHalftimeFreeTicket",
    "inputs": [{ "name": "_campaignId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTokenURI",
    "inputs": [{ "name": "_tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserWOWTokens",
    "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getWOWTokenAddress",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" },
      { "name": "operator", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextCampaignId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextPrizeId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextTokenId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "playFeeInUsdCents",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "playSecondHalftimeWithChz",
    "inputs": [{ "name": "_campaignId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "playSecondHalftimeWithTicket",
    "inputs": [{ "name": "_campaignId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "predictionGames",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "campaignId", "type": "uint256", "internalType": "uint256" },
      { "name": "question", "type": "string", "internalType": "string" },
      { "name": "team1Score", "type": "uint8", "internalType": "uint8" },
      { "name": "team2Score", "type": "uint8", "internalType": "uint8" },
      { "name": "resolved", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "prizes",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" },
      { "name": "description", "type": "string", "internalType": "string" },
      { "name": "uri", "type": "string", "internalType": "string" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolvePredictionGame",
    "inputs": [
      { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
      { "name": "_team1Score", "type": "uint8", "internalType": "uint8" },
      { "name": "_team2Score", "type": "uint8", "internalType": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      { "name": "from", "type": "address", "internalType": "address" },
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      { "name": "from", "type": "address", "internalType": "address" },
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
      { "name": "data", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      { "name": "operator", "type": "address", "internalType": "address" },
      { "name": "approved", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCampaignActive",
    "inputs": [
      { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
      { "name": "_isActive", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitPredictions",
    "inputs": [
      { "name": "_campaignId", "type": "uint256", "internalType": "uint256" },
      { "name": "_team1Score", "type": "uint8", "internalType": "uint8" },
      { "name": "_team2Score", "type": "uint8", "internalType": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "swapContractBalanceToWOWTokens",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      { "name": "from", "type": "address", "internalType": "address" },
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "trustedDataResolver",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updatePlayFee",
    "inputs": [{ "name": "_playFeeInUsdCents", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateTrustedDataResolver",
    "inputs": [{ "name": "_newResolver", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateWOWTokenPerBetLoss",
    "inputs": [{ "name": "_wowTokenPerBetLoss", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userHasHalftimeTicket",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userLoyaltyPoints",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "wowToken",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "contract WOWToken" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "wowTokenPerBetLoss",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "approved", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "operator", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "approved", "type": "bool", "indexed": false, "internalType": "bool" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BatchMetadataUpdate",
    "inputs": [
      { "name": "_fromTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "_toTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CampaignCreated",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "team1", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "team2", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "startTimePredictionGame", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "endTimePredictionGame", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "startTimeSecondHalftimeGame", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "endTimeSecondHalftimeGame", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "HeatmapPlayed",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "requestId", "type": "uint64", "indexed": true, "internalType": "uint64" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MetadataUpdate",
    "inputs": [
      { "name": "_tokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      { "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PredictionGameCreated",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PredictionGameResolved",
    "inputs": [
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "team1Score", "type": "uint8", "indexed": false, "internalType": "uint8" },
      { "name": "team2Score", "type": "uint8", "indexed": false, "internalType": "uint8" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PredictionsSubmitted",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "campaignId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "team1", "type": "uint8", "indexed": false, "internalType": "uint8" },
      { "name": "team2", "type": "uint8", "indexed": false, "internalType": "uint8" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PrizeAwarded",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "prizeId", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "tokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TicketsAwarded",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "to", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WOWTokensAwarded",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyHasTicket",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CampaignDoesNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CampaignNotActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ERC721IncorrectOwner",
    "inputs": [
      { "name": "sender", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
      { "name": "owner", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InsufficientApproval",
    "inputs": [
      { "name": "operator", "type": "address", "internalType": "address" },
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidApprover",
    "inputs": [
      { "name": "approver", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOperator",
    "inputs": [
      { "name": "operator", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOwner",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidReceiver",
    "inputs": [
      { "name": "receiver", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidSender",
    "inputs": [
      { "name": "sender", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "ERC721NonexistentToken",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "GameNotResolved",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientChzSent",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MarketAlreadyResolved",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoFreeTickets",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      { "name": "account", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "PredictionGameNotActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PredictionNotPlayed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PredictionNotWon",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RequestNotFound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SecondHalftimeGameNotActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  }
] as const;