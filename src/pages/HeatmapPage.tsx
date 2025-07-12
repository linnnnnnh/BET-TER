import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useActiveAccount } from 'thirdweb/react'
import { Button } from '@/components/ui/button'
import { Trophy, CreditCard, Play, CheckCircle, Clock, Gamepad2, Star, Gift } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function HeatmapPage() {
  const account = useActiveAccount()
  const [hasWonPrediction, setHasWonPrediction] = useState(false) // TODO: Get from smart contract
  const [gameEntry, setGameEntry] = useState<'none' | 'won' | 'purchased' | 'video'>('none')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false)
  const [hasPlayedGame, setHasPlayedGame] = useState(false)
  
  // Football game states
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [winningCard, setWinningCard] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // PSG Players data
  const psgPlayers = [
    { id: 1, name: "Kylian Mbappé", position: "Forward", number: 7, photo: "🇫🇷" },
    { id: 2, name: "Neymar Jr", position: "Forward", number: 10, photo: "🇧🇷" },
    { id: 3, name: "Lionel Messi", position: "Forward", number: 30, photo: "🇦🇷" },
    { id: 4, name: "Marco Verratti", position: "Midfielder", number: 6, photo: "🇮🇹" },
    { id: 5, name: "Marquinhos", position: "Defender", number: 5, photo: "🇧🇷" },
    { id: 6, name: "Achraf Hakimi", position: "Defender", number: 2, photo: "🇲🇦" },
  ]

  // Check if user won prediction (TODO: Replace with smart contract call)
  useEffect(() => {
    // Simulate checking prediction result
    const checkPredictionResult = async () => {
      // TODO: Call smart contract to check if user's prediction was correct
      // const result = await contract.checkPredictionResult(account?.address)
      // setHasWonPrediction(result)
      
      // For demo, randomly set to true/false
      setHasWonPrediction(Math.random() > 0.5)
    }
    
    if (account) {
      checkPredictionResult()
    }
  }, [account])

  // Game timer effect
  useEffect(() => {
    // No timer needed for card game - instant selection
  }, [])

  const startCardGame = () => {
    setGameStarted(true)
    setSelectedCard(null)
    setShowResult(false)
    // TODO: Get winning card from smart contract
    // const winningCardId = await contract.getWinningCard()
    // For demo, randomly select winning card
    const randomWinner = Math.floor(Math.random() * psgPlayers.length) + 1
    setWinningCard(randomWinner)
  }

  const handleCardSelection = (cardId: number) => {
    if (!account) {
      toast({
        title: "Not logged in",
        description: "Please log in to play the game",
        variant: "destructive",
      })
      return
    }
    
    if (selectedCard !== null || showResult) return
    
    setSelectedCard(cardId)
    
    // Show result after selection
    setTimeout(() => {
      setShowResult(true)
      const isWinner = cardId === winningCard
      
      if (isWinner) {
        toast({
          title: "🎉 Congratulations!",
          description: `You selected the winning card! You've won a reward!`,
        })
        
        // Set game as completed and add reward
        setTimeout(() => {
          setHasPlayedGame(true)
          // TODO: Add reward to user's account
          // await contract.addReward(account?.address, "PSG_MERCHANDISE")
        }, 2000)
      } else {
        toast({
          title: "😅 Not this time!",
          description: `Better luck next time! But we have something special for you...`,
        })
        
        // Offer AI video compensation
        setTimeout(() => {
          setHasPlayedGame(true)
        }, 2000)
      }
    }, 1000)
  }

  const handlePurchaseEntry = async () => {
    setIsSubmittingEntry(true)
    try {
      // TODO: Implement fiat on-ramp integration
      // await fiatOnRamp.purchaseGameEntry()
      
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setGameEntry('purchased')
      toast({
        title: "Entry purchased!",
        description: "You can now play the heatmap game",
      })
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEntry(false)
    }
  }

  const handleWatchVideo = () => {
    setIsPlayingVideo(true)
    // Simulate video watching
    setTimeout(() => {
      setVideoWatched(true)
      setIsPlayingVideo(false)
      toast({
        title: "Video completed!",
        description: "Please answer the questions to unlock the game",
      })
    }, 3000) // 3 seconds for demo
  }

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answer
    setQuizAnswers(newAnswers)
  }

  const handleSubmitQuiz = async () => {
    if (quizAnswers.length < 2 || quizAnswers.some(answer => !answer)) {
      toast({
        title: "Incomplete quiz",
        description: "Please answer all questions",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingEntry(true)
    try {
      // TODO: Validate quiz answers
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGameEntry('video')
      toast({
        title: "Quiz completed!",
        description: "You can now play the heatmap game",
      })
    } catch (error) {
      toast({
        title: "Quiz submission failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEntry(false)
    }
  }

  const canPlayGame = hasWonPrediction || gameEntry === 'purchased' || gameEntry === 'video'

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient-psg mb-4"
        >
          Heatmap Game
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Interactive halftime mini-game
        </p>
      </div>

      {/* Game Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow border-l-4 border-l-psg-blue"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Game Entry Status</h2>
          <div className="flex items-center space-x-1 text-psg-blue">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Available during halftime</span>
          </div>
        </div>
        
        {hasWonPrediction ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Congratulations! You won the prediction!</span>
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              You have free access to the heatmap game
            </p>
          </div>
        ) : (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-medium">Your prediction didn't win</span>
            </div>
            <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">
              Choose an option below to unlock the game
            </p>
          </div>
        )}
      </motion.div>

      {/* Entry Options (if didn't win prediction) */}
      {!hasWonPrediction && gameEntry === 'none' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Purchase Entry */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-6 w-6 text-psg-blue" />
              <h3 className="text-xl font-semibold">Purchase Entry</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get instant access to the heatmap game
            </p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-psg-blue">€1</span>
              <span className="text-gray-500 ml-2">One-time payment</span>
            </div>
            <Button
              onClick={handlePurchaseEntry}
              disabled={!account || isSubmittingEntry}
              className="w-full bg-psg-blue hover:bg-psg-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingEntry ? "Processing..." : "Purchase Now"}
            </Button>
            
            {!account && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Log in to purchase entry
              </p>
            )}
          </div>

          {/* Watch Video */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow">
            <div className="flex items-center space-x-2 mb-4">
              <Play className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold">Watch & Learn</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Watch a short partner video and answer 2 quick questions
            </p>
            <div className="mb-4">
              <span className="text-green-600 font-semibold">FREE</span>
              <span className="text-gray-500 ml-2">~2 minutes</span>
            </div>
            <Button
              onClick={handleWatchVideo}
              disabled={!account || isPlayingVideo}
              className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlayingVideo ? "Playing Video..." : "Start Video"}
            </Button>
            
            {!account && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Log in to watch video
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Video Quiz */}
      {videoWatched && gameEntry === 'none' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow"
        >
          <h3 className="text-xl font-semibold mb-4">Quick Quiz</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Answer these questions about the video to unlock the game
          </p>

          <div className="space-y-4 mb-6">
            {/* Question 1 */}
            <div>
              <p className="font-medium mb-2">1. What was the main topic of the video?</p>
              <div className="space-y-2">
                {['Sustainability in Sports', 'Fan Engagement Technology', 'Player Training Methods'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="question1"
                      value={option}
                      onChange={(e) => handleQuizAnswer(0, e.target.value)}
                      className="text-psg-blue"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <p className="font-medium mb-2">2. Which technology was featured in the video?</p>
              <div className="space-y-2">
                {['Blockchain & Web3', 'Virtual Reality', 'Artificial Intelligence'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="question2"
                      value={option}
                      onChange={(e) => handleQuizAnswer(1, e.target.value)}
                      className="text-psg-blue"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmitQuiz}
            disabled={!account || isSubmittingEntry}
            className="bg-psg-blue hover:bg-psg-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingEntry ? "Submitting..." : "Submit Quiz"}
          </Button>
          
          {!account && (
            <p className="text-sm text-red-500 mt-2">
              Log in to submit quiz
            </p>
          )}
        </motion.div>
      )}

      {/* Game Arena */}
      {canPlayGame && !hasPlayedGame && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Gamepad2 className="h-6 w-6 text-psg-blue" />
            <h3 className="text-xl font-semibold">PSG Player Challenge ⚽</h3>
          </div>

          {!gameStarted ? (
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-psg-blue to-chiliz-red rounded-lg p-6 mb-4">
                <div className="text-6xl mb-4">🃏</div>
                <h4 className="text-xl font-bold text-white mb-2">Choose Your Champion</h4>
                <p className="text-white/90">
                  Select the PSG player card that you think will be randomly chosen as the winner!<br/>
                  Only one card holds the victory - choose wisely!
                </p>
              </div>
              
              <Button
                onClick={startCardGame}
                disabled={!account}
                className="bg-psg-blue hover:bg-psg-blue/90 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star className="w-5 h-5 mr-2" />
                Start Card Game
              </Button>
              
              {!account && (
                <p className="text-sm text-red-500 mt-2">
                  Log in to play the game
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Game Instructions */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                <h4 className="font-semibold mb-2">🎯 Choose Your PSG Champion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on one player card. Only one is the randomly selected winner!
                </p>
              </div>

              {/* Player Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {psgPlayers.map((player) => {
                  const isSelected = selectedCard === player.id
                  const isWinner = showResult && winningCard === player.id
                  const isLoser = showResult && selectedCard === player.id && winningCard !== player.id
                  
                  return (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: selectedCard === null && account ? 1.05 : 1 }}
                      whileTap={{ scale: account ? 0.95 : 1 }}
                      onClick={() => handleCardSelection(player.id)}
                      className={`relative transition-all duration-300 ${
                        !account 
                          ? 'cursor-not-allowed opacity-50'
                          : selectedCard === null
                          ? 'cursor-pointer'
                          : 'cursor-default'
                      } ${
                        isWinner 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : isLoser
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : isSelected
                          ? 'border-psg-blue bg-blue-50 dark:bg-blue-900/20'
                          : selectedCard === null && account
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-psg-blue hover:shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
                      } rounded-xl p-4 border-2`}
                    >
                      {/* Player Photo */}
                      <div className="text-center mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-psg-blue to-chiliz-red rounded-full flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg">
                          {player.photo}
                        </div>
                        <div className="w-8 h-8 bg-psg-blue text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                          {player.number}
                        </div>
                      </div>
                      
                      {/* Player Info */}
                      <div className="text-center">
                        <h5 className="font-bold text-sm mb-1">{player.name}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{player.position}</p>
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-psg-blue rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Winner/Loser Indicator */}
                      {showResult && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          {isWinner ? (
                            <div className="text-center text-white">
                              <Trophy className="w-8 h-8 mx-auto mb-1 text-yellow-400" />
                              <span className="text-sm font-bold">WINNER!</span>
                            </div>
                          ) : (
                            <div className="text-center text-white">
                              <div className="text-2xl mb-1">😢</div>
                              <span className="text-xs">Not this time</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* User Authentication Notice */}
              {!account && (
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    🔗 Log in to select a player card
                  </p>
                </div>
              )}

              {/* Selection Status */}
              {selectedCard && !showResult && (
                <div className="text-center p-4 bg-psg-blue/10 rounded-lg">
                  <p className="text-psg-blue font-semibold">
                    You selected: {psgPlayers.find(p => p.id === selectedCard)?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Revealing the winner...
                  </p>
                </div>
              )}

              {/* Game Result */}
              {showResult && (
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-bold mb-2">
                    {selectedCard === winningCard ? "🎉 Congratulations!" : "😅 Better luck next time!"}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The winning card was: <strong>{psgPlayers.find(p => p.id === winningCard)?.name}</strong>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Adding you to the winner pool...
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Game Completed */}
      {hasPlayedGame && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {selectedCard === winningCard ? (
            // Winner - Show Reward
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                  🎉 Congratulations! You Won!
                </h3>
                <p className="text-green-600 dark:text-green-400 mb-4">
                  You selected the winning card: <strong>{psgPlayers.find(p => p.id === selectedCard)?.name}</strong>
                </p>
                
                {/* Reward Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Gift className="h-6 w-6 text-psg-blue" />
                    <span className="font-bold text-lg">Your Reward</span>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎁</div>
                    <h4 className="font-semibold text-psg-blue">PSG Exclusive Merchandise</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Official PSG jersey or accessory
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.location.href = '/rewards'}
                  className="bg-psg-blue hover:bg-psg-blue/90 text-white"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  View My Rewards
                </Button>
              </div>
            </div>
          ) : (
            // Loser - AI Video Compensation
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-2">
                  😅 Not This Time, But...
                </h3>
                <p className="text-orange-600 dark:text-orange-400 mb-4">
                  The winning card was: <strong>{psgPlayers.find(p => p.id === winningCard)?.name}</strong><br/>
                  You selected: <strong>{psgPlayers.find(p => p.id === selectedCard)?.name}</strong>
                </p>
                
                {/* AI Video Compensation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Play className="h-6 w-6 text-purple-600" />
                    <span className="font-bold text-lg">Special Compensation</span>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎬</div>
                    <h4 className="font-semibold text-purple-600">AI Video with Your Player</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                      Upload your photo and we'll create an AI video of you playing alongside {psgPlayers.find(p => p.id === selectedCard)?.name}!
                    </p>
                    
                    {/* Photo Upload */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="photo-upload"
                      />
                      <label 
                        htmlFor="photo-upload" 
                        className="cursor-pointer inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Upload Your Photo</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        We'll generate your AI video within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 justify-center">
                  <Button 
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Create AI Video
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/rewards'}
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    View Progress
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
