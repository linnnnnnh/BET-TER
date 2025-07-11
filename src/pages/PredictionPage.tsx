import { useState } from 'react'
import { motion } from 'framer-motion'
import { useActiveAccount } from 'thirdweb/react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Target, Trophy, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function PredictionPage() {
  const account = useActiveAccount()
  const [psgScore, setPsgScore] = useState('')
  const [lyonScore, setLyonScore] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        title: "Wallet not connected",
        description: "Please connect your wallet to make a prediction",
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
      // TODO: Implement smart contract call
      // const prediction = `${psgScore}-${lyonScore}`
      // await contract.submitPrediction(prediction)
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Prediction submitted!",
        description: `Your halftime prediction: PSG ${psgScore}-${lyonScore} Lyon`,
      })
      
      // Reset form
      setPsgScore('')
      setLyonScore('')
      
    } catch (error) {
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
          <div className="flex items-center justify-center space-x-8">
            {/* PSG Score */}
            <div className="text-center">
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
            <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">-</div>

            {/* Lyon Score */}
            <div className="text-center">
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
              Connect your wallet to submit predictions
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
