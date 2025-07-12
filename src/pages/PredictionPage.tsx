import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useActiveAccount, useSendTransaction, useReadContract } from 'thirdweb/react'
import { readContract } from 'thirdweb'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Target, Trophy, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getEngagementContract, contractUtils } from '@/lib/contract'

export default function PredictionPage() {
  const account = useActiveAccount()
  const [psgScore, setPsgScore] = useState('')
  const [lyonScore, setLyonScore] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentCampaignId, setCurrentCampaignId] = useState<number>(1) // Default to campaign 1

  // Get current campaign ID from smart contract
  const { data: nextCampaignId } = useReadContract({
    contract: getEngagementContract(),
    method: 'function nextCampaignId() view returns (uint256)',
    params: []
  })

  // Calculate current campaign ID (always nextCampaignId - 1)
  const actualCurrentCampaignId = nextCampaignId ? Number(nextCampaignId) - 1 : 1

  // Get current campaign info to check if it's active
  const { data: campaignData } = useReadContract({
    contract: getEngagementContract(),
    method: 'function campaigns(uint256) view returns (uint256 id, string team1, string team2, uint256 startTimePredictionGame, uint256 endTimePredictionGame, uint256 startTimeSecondHalftimeGame, uint256 endTimeSecondHalftimeGame, bool active)',
    params: [BigInt(actualCurrentCampaignId)]
  })

  // Smart contract transaction hook
  const { mutate: sendTransaction } = useSendTransaction()

  // Update campaign ID when contract data is available
  useEffect(() => {
    if (nextCampaignId) {
      // Always use nextCampaignId - 1 as the current campaign
      const campaignId = Number(nextCampaignId) - 1
      setCurrentCampaignId(campaignId > 0 ? campaignId : 1)
    }
  }, [nextCampaignId])

  // Debug logging
  useEffect(() => {
    console.log('Campaign Debug Info:', {
      currentCampaignId,
      actualCurrentCampaignId,
      nextCampaignId: nextCampaignId ? Number(nextCampaignId) : 'loading',
      campaignData,
      campaignActive: campaignData ? campaignData[7] : 'loading'
    })
  }, [currentCampaignId, actualCurrentCampaignId, nextCampaignId, campaignData])

  const handleScoreChange = (team: 'psg' | 'lyon', value: string) => {
    // Only allow numbers 0-9
    if (value === '' || /^[0-9]$/.test(value)) {
      if (team === 'psg') {
        setPsgScore(value)
      } else {
        setLyonScore(value)
      }
    }
  }

  const handleSubmitPrediction = async () => {
    if (!account) {
      toast({
        title: "Not logged in",
        description: "Please log in to make a prediction",
        variant: "destructive",
      })
      return
    }

    if (psgScore === '' || lyonScore === '') {
      toast({
        title: "Incomplete prediction",
        description: "Please enter scores for both teams",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Fresh fetch of nextCampaignId to ensure we have the latest value
      const contract = getEngagementContract()
      const freshNextCampaignId = await readContract({
        contract,
        method: 'function nextCampaignId() view returns (uint256)',
        params: []
      })
      const campaignIdToUse = Number(freshNextCampaignId) - 1

      console.log('Fresh campaign ID fetch:', {
        freshNextCampaignId: Number(freshNextCampaignId),
        campaignIdToUse,
        previousNextCampaignId: nextCampaignId ? Number(nextCampaignId) : 'loading'
      })

      // Validate campaign ID
      if (campaignIdToUse < 1) {
        toast({
          title: "No active campaign",
          description: "No campaigns have been created yet.",
          variant: "destructive",
        })
        return
      }

      // Check if the campaign exists and is active
      try {
        const contract = getEngagementContract()
        const campaignInfo = await readContract({
          contract,
          method: 'function campaigns(uint256) view returns (uint256 id, string team1, string team2, uint256 startTimePredictionGame, uint256 endTimePredictionGame, uint256 startTimeSecondHalftimeGame, uint256 endTimeSecondHalftimeGame, bool active)',
          params: [BigInt(campaignIdToUse)]
        })
        
        console.log('Campaign info:', {
          campaignId: campaignIdToUse,
          campaignInfo,
          isActive: campaignInfo[7]
        })

        // Check if campaign is active
        if (!campaignInfo[7]) {
          toast({
            title: "Campaign not active",
            description: "This campaign is not currently active for predictions.",
            variant: "destructive",
          })
          return
        }

        // Check if we're in the prediction time window
        const now = Math.floor(Date.now() / 1000)
        const startTime = Number(campaignInfo[3])
        const endTime = Number(campaignInfo[4])
        
        if (now < startTime) {
          toast({
            title: "Predictions not yet open",
            description: "The prediction period for this campaign hasn't started yet.",
            variant: "destructive",
          })
          return
        }

        if (now > endTime) {
          toast({
            title: "Predictions closed",
            description: "The prediction period for this campaign has ended.",
            variant: "destructive",
          })
          return
        }

      } catch (campaignCheckError) {
        console.error('Error checking campaign:', campaignCheckError)
        toast({
          title: "Campaign check failed",
          description: "Could not verify campaign status. Please try again.",
          variant: "destructive",
        })
        return
      }

      const team1Score = parseInt(psgScore)
      const team2Score = parseInt(lyonScore)
      
      // Validate score inputs
      if (isNaN(team1Score) || isNaN(team2Score) || team1Score < 0 || team2Score < 0 || team1Score > 9 || team2Score > 9) {
        toast({
          title: "Invalid scores",
          description: "Please enter valid scores (0-9)",
          variant: "destructive",
        })
        return
      }
      
      console.log('Submitting prediction:', {
        campaignId: campaignIdToUse,
        team1Score,
        team2Score,
        freshNextCampaignId: Number(freshNextCampaignId)
      })
      
      // Prepare the smart contract call with fresh campaign ID
      const transaction = contractUtils.submitPredictions(
        campaignIdToUse,
        team1Score,
        team2Score
      )
      
      // Submit the transaction
      sendTransaction(transaction, {
        onSuccess: (result) => {
          toast({
            title: "Prediction submitted!",
            description: `Your halftime prediction: PSG ${psgScore}-${lyonScore} Lyon (Campaign ${campaignIdToUse})`,
          })
          
          // Reset form
          setPsgScore('')
          setLyonScore('')
          
          console.log('Transaction successful:', result)
        },
        onError: (error) => {
          console.error('Transaction failed:', error)
          console.error('Error details:', {
            message: error.message,
            cause: error.cause,
            stack: error.stack,
            name: error.name
          })
          
          // Try to provide more specific error messages
          let errorMessage = "There was an error submitting your prediction. Please try again."
          
          if (error.message.includes('CampaignNotActive')) {
            errorMessage = "The prediction period for this campaign has ended."
          } else if (error.message.includes('CampaignDoesNotExist')) {
            errorMessage = "This campaign does not exist."
          } else if (error.message.includes('AlreadyHasTicket')) {
            errorMessage = "You have already submitted a prediction for this campaign."
          } else if (error.message.includes('0x55a5ff0a')) {
            errorMessage = "Contract error: This might be due to campaign timing, duplicate submission, or campaign not being active."
          }
          
          toast({
            title: "Submission failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      })
      
    } catch (error) {
      console.error('Error preparing transaction:', error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidPrediction = psgScore !== '' && lyonScore !== ''

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient-psg mb-4"
        >
          Prediction Market
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Make your predictions for the upcoming match
        </p>
      </div>

      {/* Match Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow border-l-4 border-l-psg-blue"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">PSG vs Lyon</h2>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">July 13, 2025</span>
            </div>
            <div className="flex items-center space-x-1 text-psg-blue">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">20:00 CET</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <Target className="h-5 w-5" />
            <span className="font-medium">Predictions close at 19:00 CET</span>
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
            Make your prediction before the match starts to earn Free Play Tickets!
          </p>
        </div>
      </motion.div>

      {/* Halftime Score Prediction */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="h-6 w-6 text-psg-blue" />
          <h3 className="text-xl font-semibold">Halftime Score Prediction</h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          What do you think the score will be at halftime?
        </p>

        {/* Score Input */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center">
            {/* PSG Score */}
            <div className="flex flex-col justify-center text-center items-center">
              <div className="w-20 h-20 bg-psg-blue rounded-full flex items-center justify-center mb-3 shadow-lg">
                <span className="text-white text-lg font-bold">PSG</span>
              </div>
              <input
                type="text"
                value={psgScore}
                onChange={(e) => handleScoreChange('psg', e.target.value)}
                placeholder="0"
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-psg-blue focus:outline-none transition-colors"
                maxLength={1}
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Paris SG</p>
            </div>

            {/* VS Separator */}
            <div className="font-bold text-gray-400 dark:text-gray-500" style={{ marginRight: '5em', marginLeft: '5em' }}>-</div>

            {/* Lyon Score */}
            <div className="flex flex-col justif-center text-center items-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <span className="text-white text-lg font-bold">OL</span>
              </div>
              <input
                type="text"
                value={lyonScore}
                onChange={(e) => handleScoreChange('lyon', e.target.value)}
                placeholder="0"
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-psg-blue focus:outline-none transition-colors"
                maxLength={1}
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Olympique Lyon</p>
            </div>
          </div>

          {/* Preview */}
          {isValidPrediction && (
            <div className="text-center mt-6 p-4 bg-psg-blue/10 rounded-lg">
              <p className="text-lg font-semibold text-psg-blue">
                Your prediction: PSG {psgScore}-{lyonScore} Lyon
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmitPrediction}
            disabled={!account || !isValidPrediction || isSubmitting}
            className="bg-psg-blue hover:bg-psg-blue/90 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Submit Prediction
              </>
            )}
          </Button>
          
          {!account && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Log in to submit predictions
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
