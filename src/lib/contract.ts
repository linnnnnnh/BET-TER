import { getContract, prepareContractCall, type ThirdwebContract } from 'thirdweb'
import { client, chilizSpicyChain } from './thirdweb'
import { engagementPlatformAbi } from '../smart-contract/abi'

// Get the correct chain - using only testnet now
const getChain = () => {
  return chilizSpicyChain
}

// Contract instance
export const getEngagementContract = (): ThirdwebContract => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  
  if (!contractAddress) {
    throw new Error('Contract address not found in environment variables')
  }

  return getContract({
    client,
    chain: getChain(),
    address: contractAddress,
    abi: engagementPlatformAbi as any,
  })
}

// Campaign ID is now dynamically fetched from the contract

// Contract interaction utilities
export const contractUtils = {
  // Get next campaign ID
  getNextCampaignId: () => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function nextCampaignId() view returns (uint256)',
      params: []
    }
  },

  // Get current active campaign ID (nextCampaignId - 1)
  getCurrentCampaignId: () => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function nextCampaignId() view returns (uint256)',
      params: []
    }
  },

  // Submit predictions - updated to match new ABI
  submitPredictions: (campaignId: number, team1Score: number, team2Score: number) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function submitPredictions(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score)',
      params: [BigInt(campaignId), team1Score, team2Score]
    })
  },

  // Play second halftime with CHZ - updated function name
  playSecondHalftimeWithChz: (campaignId: number, chzAmount: string) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function playSecondHalftimeWithChz(uint256 _campaignId)',
      params: [BigInt(campaignId)],
      value: BigInt(chzAmount)
    })
  },

  // Play second halftime with ticket - updated function name
  playSecondHalftimeWithTicket: (campaignId: number) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function playSecondHalftimeWithTicket(uint256 _campaignId)',
      params: [BigInt(campaignId)]
    })
  },

  // Get play fee in USD cents - updated function name
  getPlayFeeInUsdCents: () => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function getPlayFeeInUsdCents() view returns (uint256)',
      params: []
    }
  },

  // Get second halftime free ticket - updated function name
  getSecondHalftimeFreeTicket: (campaignId: number) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function getSecondHalftimeFreeTicket(uint256 _campaignId)',
      params: [BigInt(campaignId)]
    })
  },

  // Check if user has halftime ticket - new function
  userHasHalftimeTicket: (address: string) => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function userHasHalftimeTicket(address) view returns (bool)',
      params: [address]
    }
  },

  // Get user loyalty points
  getUserLoyaltyPoints: (address: string) => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function userLoyaltyPoints(address) view returns (uint256)',
      params: [address]
    }
  },

  // Get campaign details - updated to match new structure
  getCampaign: (campaignId: number) => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function campaigns(uint256) view returns (uint256 id, string team1, string team2, uint256 startTimePredictionGame, uint256 endTimePredictionGame, uint256 startTimeSecondHalftimeGame, uint256 endTimeSecondHalftimeGame, bool active)',
      params: [BigInt(campaignId)]
    }
  },

  // Create campaign - updated to match new structure
  createCampaign: (campaignInput: {
    id: number;
    team1: string;
    team2: string;
    startTimePredictionGame: number;
    endTimePredictionGame: number;
    startTimeSecondHalftimeGame: number;
    endTimeSecondHalftimeGame: number;
  }) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function createCampaign((uint256,string,string,uint256,uint256,uint256,uint256))',
      params: [[
        BigInt(campaignInput.id),
        campaignInput.team1,
        campaignInput.team2,
        BigInt(campaignInput.startTimePredictionGame),
        BigInt(campaignInput.endTimePredictionGame),
        BigInt(campaignInput.startTimeSecondHalftimeGame),
        BigInt(campaignInput.endTimeSecondHalftimeGame)
      ]]
    })
  },

  // Check prediction result - new function
  checkPredictionResult: (campaignId: number) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function checkPredictionResult(uint256 _campaignId) returns (bool)',
      params: [BigInt(campaignId)]
    })
  },

  // Create prediction game - updated function
  createPredictionGame: (campaignId: number, question: string) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function createPredictionGame(uint256 _campaignId, string _question)',
      params: [BigInt(campaignId), question]
    })
  },

  // Resolve prediction game - new function
  resolvePredictionGame: (campaignId: number, team1Score: number, team2Score: number) => {
    const contract = getEngagementContract()
    return prepareContractCall({
      contract,
      method: 'function resolvePredictionGame(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score)',
      params: [BigInt(campaignId), team1Score, team2Score]
    })
  },

  // Get prediction game details
  getPredictionGame: (campaignId: number) => {
    const contract = getEngagementContract()
    return {
      contract,
      method: 'function predictionGames(uint256) view returns (uint256 campaignId, string question, uint8 team1Score, uint8 team2Score, bool resolved)',
      params: [BigInt(campaignId)]
    }
  }
}

// PSG Token contract
export const getPsgTokenContract = () => {
  const psgTokenAddress = import.meta.env.VITE_PSG_TOKEN_ADDRESS
  
  if (!psgTokenAddress) {
    throw new Error('PSG token address not found in environment variables')
  }

  return getContract({
    client,
    chain: getChain(),
    address: psgTokenAddress,
    // Standard ERC-20 ABI methods we'll use
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view'
      },
      {
        type: 'function',
        name: 'transfer',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable'
      },
      {
        type: 'function',
        name: 'approve',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable'
      },
      {
        type: 'function',
        name: 'allowance',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view'
      }
    ]
  })
}
