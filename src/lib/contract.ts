import { getContract } from 'thirdweb'
import { client, chilizChain } from './thirdweb'
import { engagementPlatformAbi } from '../smart-contract/abi'

// Contract instance
export const getEngagementContract = () => {
  const contractAddress = import.meta.env.VITE_PREDICTION_CONTRACT_ADDRESS
  
  if (!contractAddress) {
    throw new Error('Contract address not found in environment variables')
  }

  return getContract({
    client,
    chain: chilizChain,
    address: contractAddress,
    abi: engagementPlatformAbi,
  })
}

// Campaign ID - you can make this dynamic or get from contract
export const CURRENT_CAMPAIGN_ID = 1
