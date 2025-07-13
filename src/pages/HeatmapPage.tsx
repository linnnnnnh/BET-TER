import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useActiveAccount, useReadContract, useWalletBalance, useSendTransaction } from 'thirdweb/react'
import { Button } from '@/components/ui/button'
import { Trophy, CreditCard, Play, CheckCircle, Clock, Gamepad2, Star, Gift, Loader2, Share2, Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { client, chilizSpicyChain as chiliz } from '@/lib/thirdweb'
import { getContract, toWei, prepareContractCall } from 'thirdweb'
import { getEngagementContract, contractUtils } from '@/lib/contract'


export default function HeatmapPage() {
  const account = useActiveAccount()
  const [gameEntry, setGameEntry] = useState<'none' | 'purchased' | 'video' | 'ticket'>('none')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false)
  const [hasPlayedGame, setHasPlayedGame] = useState(false)
  
  // Smart contract transaction hook
  const { mutate: sendTransaction, isPending: isTransactionPending } = useSendTransaction()
  
  // Get current campaign ID from smart contract
  const { data: nextCampaignId } = useReadContract({
    contract: getEngagementContract(),
    method: 'function nextCampaignId() view returns (uint256)',
    params: []
  })

  // Calculate current campaign ID (always nextCampaignId - 1)
  const actualCurrentCampaignId = nextCampaignId ? Number(nextCampaignId) - 1 : 1
  
  // Mock purchase modal states
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseTokenType, setPurchaseTokenType] = useState<'CHZ' | 'PSG'>('CHZ')
  const [purchaseProcessing, setPurchaseProcessing] = useState(false)
  
  // Football game states
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [winningCard, setWinningCard] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Token contract addresses (Chiliz network)
  const PSG_TOKEN_ADDRESS = "0x6fc212cdE3b420733A88496CbdbB15d85beAb1Ca" // PSG Fan Token address on Chiliz

  // PSG Token contract (CHZ is native, no contract needed)
  const psgContract = getContract({
    client,
    chain: chiliz,
    address: PSG_TOKEN_ADDRESS,
  })

  // Read CHZ balance (native token)
  const { data: chzBalance } = useWalletBalance({
    client,
    chain: chiliz,
    address: account?.address,
  })

  // Read PSG balance
  const { data: psgBalance } = useReadContract({
    contract: psgContract,
    method: "balanceOf", 
    params: [account?.address || ""],
  })

  // Read user's halftime ticket from smart contract
  const { data: hasHalftimeTicket = false } = useReadContract({
    contract: getEngagementContract(),
    method: "function userHasHalftimeTicket(address) view returns (bool)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"]
  })

  // PSG Players data (2024 squad, updated)
  const playerPhotos = [
    "https://media.psg.fr/image/upload/c_limit,w_257/f_avif/q_85/v1/donarumma1_nz1rvx?_a=BAVAZGE70",
    "https://media.psg.fr/image/upload/c_limit,w_641/f_avif/q_85/v1/hakimi2_cq3wlm?_a=BAVAZGE70",
    "https://media.psg.fr/image/upload/c_limit,w_641/f_avif/q_85/v1/kimpembe3_d4lsli?_a=BAVAZGE70",
    "https://media.psg.fr/image/upload/c_limit,w_641/f_avif/q_85/v1/marquinhos5_p98fnm?_a=BAVAZGE70"
  ];
  const psgPlayers = [
    { id: 1, name: "Gianluigi Donnarumma", position: "Gardien de but", number: 1, photo: playerPhotos[0] },
    { id: 2, name: "Achraf Hakimi", position: "Défenseur", number: 2, photo: playerPhotos[1] },
    { id: 3, name: "Presnel Kimpembe", position: "Défenseur", number: 3, photo: playerPhotos[2] },
    { id: 5, name: "Marquinhos", position: "Défenseur", number: 5, photo: playerPhotos[3] },
    { id: 7, name: "Khvicha Kvaratskhelia", position: "Attaquant", number: 7, photo: playerPhotos[2] },
    { id: 8, name: "Fabián Ruiz", position: "Milieu de terrain", number: 8, photo: playerPhotos[1] },
    { id: 9, name: "Gonçalo Ramos", position: "Attaquant", number: 9, photo: playerPhotos[2] },
    { id: 10, name: "Ousmane Dembélé", position: "Attaquant", number: 10, photo: playerPhotos[3] },
    { id: 14, name: "Désiré Doué", position: "Attaquant", number: 14, photo: playerPhotos[2] },
    { id: 17, name: "Vitinha", position: "Milieu de terrain", number: 17, photo: playerPhotos[1] },
    { id: 19, name: "Lee Kang-In", position: "Milieu de terrain", number: 19, photo: playerPhotos[2] },
    { id: 21, name: "Lucas Hernández", position: "Défenseur", number: 21, photo: playerPhotos[3] },
    { id: 24, name: "Senny Mayulu", position: "Milieu de terrain", number: 24, photo: playerPhotos[2] },
    { id: 25, name: "Nuno Mendes", position: "Défenseur", number: 25, photo: playerPhotos[1] },
    { id: 29, name: "Bradley Barcola", position: "Attaquant", number: 29, photo: playerPhotos[2] },
    { id: 33, name: "Warren Zaïre-Emery", position: "Milieu de terrain", number: 33, photo: playerPhotos[3] },
    { id: 35, name: "Beraldo", position: "Défenseur", number: 35, photo: playerPhotos[0] },
    { id: 39, name: "Matvey Safonov", position: "Gardien de but", number: 39, photo: playerPhotos[1] },
    { id: 49, name: "Ibrahim Mbaye", position: "Attaquant", number: 49, photo: playerPhotos[2] },
    { id: 51, name: "Willian Pacho", position: "Défenseur", number: 51, photo: playerPhotos[3] },
    { id: 80, name: "Arnau Tenas", position: "Gardien de but", number: 80, photo: playerPhotos[0] },
    { id: 87, name: "João Neves", position: "Milieu de terrain", number: 87, photo: playerPhotos[1] },
  ]

  // Free tickets are now managed by the smart contract
  // Users get free tickets when they win predictions or through other rewards

  // Load game entry status from localStorage
  useEffect(() => {
    if (account?.address) {
      const savedGameEntry = localStorage.getItem(`gameEntry_${account.address}`)
      if (savedGameEntry === 'purchased' || savedGameEntry === 'video') {
        setGameEntry(savedGameEntry as 'purchased' | 'video')
        // If user has a valid entry, they haven't played yet
        setHasPlayedGame(false)
      } else {
        // No valid entry means they either haven't gained access or have already played
        setGameEntry('none')
      }
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

  const handleCardSelection = async (cardId: number) => {
    if (!account) {
      toast({
        title: "Not logged in",
        description: "Please log in to play the game",
        variant: "destructive",
      })
      return
    }
    
    if (selectedCard !== null || showResult || isTransactionPending) return
    
    if (!hasHalftimeTicket) {
      toast({
        title: "No ticket available",
        description: "You don't have a halftime ticket to play",
        variant: "destructive",
      })
      return
    }
    
    setSelectedCard(cardId)
    
    // Debug logging
    console.log('Debug - Transaction details:')
    console.log('- Account:', account.address)
    console.log('- Campaign ID:', actualCurrentCampaignId)
    console.log('- Next Campaign ID:', nextCampaignId)
    console.log('- Has Halftime Ticket:', hasHalftimeTicket)
    console.log('- Selected Card:', cardId)
    
    try {
      // Validate campaign ID
      if (!actualCurrentCampaignId || actualCurrentCampaignId < 1) {
        throw new Error(`Invalid campaign ID: ${actualCurrentCampaignId}`)
      }
      
      // Prepare the smart contract transaction using existing utility
      const transaction = contractUtils.playSecondHalftimeWithTicket(actualCurrentCampaignId)
      
      toast({
        title: "Transaction submitted",
        description: "Please wait while your lottery ticket is being processed...",
      })
      
      // Send the transaction
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log('Transaction successful:', result)
          toast({
            title: "🎉 Transaction successful!",
            description: "Your lottery ticket has been played! The winner will be determined by the smart contract.",
          })
          
          // Set game as completed since the ticket has been consumed
          setTimeout(() => {
            setShowResult(true)
            completeGame()
            
            // Note: In a real implementation, you would listen for contract events
            // to determine the actual winner from the randomness result
            toast({
              title: "🎲 Lottery completed",
              description: "Check your rewards page to see if you won!",
            })
          }, 3000)
        },
        onError: (error) => {
          console.error("Transaction failed:", error)
          console.error("Error details:", {
            message: error.message,
            cause: error.cause,
            stack: error.stack
          })
          
          // More specific error messages
          let errorMessage = "There was an error processing your lottery ticket. Please try again."
          
          if (error.message.includes("execution reverted")) {
            errorMessage = "Transaction was rejected by the smart contract. This could be due to:\n" +
                         "• You don't have a valid halftime ticket\n" +
                         "• The campaign is not in the halftime period\n" +
                         "• The campaign ID is incorrect\n" +
                         "Please check the console for more details."
          }
          
          toast({
            title: "Transaction failed",
            description: errorMessage,
            variant: "destructive",
          })
          
          // Reset selection on error
          setSelectedCard(null)
        }
      })
      
    } catch (error) {
      console.error("Error preparing transaction:", error)
      toast({
        title: "Error",
        description: "Failed to prepare the lottery transaction. Please try again.",
        variant: "destructive",
      })
      
      // Reset selection on error
      setSelectedCard(null)
    }
  } 

  const handlePurchaseEntry = async (paymentMethod: 'CHZ' | 'PSG') => {
    if (!account?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingEntry(true)
    
    try {
      // Check token balance based on payment method
      const currentBalance = paymentMethod === 'CHZ' ? chzBalance?.value : psgBalance
      const requiredAmount = toWei("1") // 1 token required for entry
      
      // If user doesn't have enough tokens, trigger fiat onramp
      if (
        !currentBalance ||
        (typeof currentBalance === "bigint" && currentBalance < requiredAmount)
      ) {

        // Show purchase modal instead of popup window
        setPurchaseTokenType(paymentMethod)
        setShowPurchaseModal(true)
        return
      }

      // User has sufficient tokens - proceed with direct token payment
      toast({
        title: "Processing payment...",
        description: `Using your existing $${paymentMethod} tokens`,
      })

      // TODO: Implement direct token payment via smart contract
      // For CHZ (native token): send native currency transaction
      // For PSG: use ERC-20 transfer
      // const txResult = await writeContract({
      //   contract: psgContract, // only for PSG payments
      //   method: "transfer",
      //   params: [GAME_CONTRACT_ADDRESS, requiredAmount],
      // })

      // Simulate successful payment for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setGameEntry('purchased')
      // Save to localStorage for header ticket count
      if (account?.address) {
        localStorage.setItem(`gameEntry_${account.address}`, 'purchased')
        // Dispatch custom event to update header
        window.dispatchEvent(new CustomEvent('gameEntryUpdated'))
      }
      toast({
        title: "Entry purchased!",
        description: `You can now play the halftime game. Paid with $${paymentMethod}`,
      })

    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Purchase failed",
        description: `There was an error processing your $${paymentMethod} payment`,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEntry(false)
    }
  }

  // Handle using free ticket to play the game
  const handleUseFreeTicket = async () => {
    if (!account?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      })
      return
    }

    if (!hasHalftimeTicket) {
      toast({
        title: "No free tickets",
        description: "You don't have any free tickets to use",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingEntry(true)
    
    try {
      // TODO: Implement smart contract call to consume the free ticket
      // This will consume one free ticket and allow the user to play
      
      // Simulate successful ticket usage for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGameEntry('ticket')
      toast({
        title: "Free ticket used!",
        description: "You can now play the halftime game with your free ticket",
      })

    } catch (error) {
      console.error("Ticket usage error:", error)
      toast({
        title: "Failed to use ticket",
        description: "There was an error using your free ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEntry(false)
    }
  }

  const handleWatchVideo = () => {
    setIsPlayingVideo(true)
    // No automatic completion - user must watch the full video
  }



  const handleUnlockGame = async () => {
    setIsSubmittingEntry(true)
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGameEntry('video')
      // Save to localStorage for header ticket count
      if (account?.address) {
        localStorage.setItem(`gameEntry_${account.address}`, 'video')
        // Dispatch custom event to update header
        window.dispatchEvent(new CustomEvent('gameEntryUpdated'))
      }
      toast({
        title: "Game unlocked!",
        description: "You can now play the halftime game. Thanks for supporting women's football!",
      })
    } catch (error) {
      toast({
        title: "Failed to unlock game",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEntry(false)
    }
  }

  const handlePurchaseSuccess = async () => {
    setPurchaseProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setPurchaseProcessing(false)
    setShowPurchaseModal(false)
    
    const tokenName = purchaseTokenType === 'CHZ' ? 'CHZ' : 'PSG Fan Token'
    toast({
      title: "Payment successful!",
      description: `${tokenName} purchased successfully. You can now play the game!`,
    })
    setGameEntry('purchased')
    // Save to localStorage for header ticket count
    if (account?.address) {
      localStorage.setItem(`gameEntry_${account.address}`, 'purchased')
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('gameEntryUpdated'))
    }
  }

  const handlePurchaseCancel = () => {
    setShowPurchaseModal(false)
    setPurchaseProcessing(false)
    toast({
      title: "Payment cancelled",
      description: "The payment was cancelled by user",
    })
  }

  // Convert boolean to number for UI logic
  const freeTicketsCount = hasHalftimeTicket ? 1 : 0
  const hasFreePlays = hasHalftimeTicket
  
  // Get current campaign info for debugging
  const { data: campaignData } = useReadContract(contractUtils.getCampaign(actualCurrentCampaignId))
  
  // Debug logging
  console.log('Debug HeatmapPage - Campaign Info:')
  console.log('- actualCurrentCampaignId:', actualCurrentCampaignId)
  console.log('- nextCampaignId:', nextCampaignId)
  console.log('- campaignData:', campaignData)
  console.log('- hasHalftimeTicket:', hasHalftimeTicket)
  console.log('- freeTicketsCount:', freeTicketsCount)
  console.log('- hasFreePlays:', hasFreePlays)
  
  // Check campaign timing
  if (campaignData) {
    const now = Math.floor(Date.now() / 1000)
    const startTimeSecondHalftime = Number(campaignData[5])
    const endTimeSecondHalftime = Number(campaignData[6])
    const isActive = campaignData[7]
    
    console.log('- Campaign timing:')
    console.log('  - Current time:', now)
    console.log('  - Halftime start:', startTimeSecondHalftime)
    console.log('  - Halftime end:', endTimeSecondHalftime)
    console.log('  - Campaign active:', isActive)
    console.log('  - Is halftime period:', now >= startTimeSecondHalftime && now <= endTimeSecondHalftime)
  }
  
  const canPlayGame = hasFreePlays || gameEntry === 'purchased' || gameEntry === 'video' || gameEntry === 'ticket'


  // Photo upload states
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [aiVideoGenerating, setAiVideoGenerating] = useState(false)
  
  // Social media sharing states
  const [showTweetPopup, setShowTweetPopup] = useState(false)


  const ShowQuizAfterVideo = () => {
    setVideoWatched(true)
    setIsPlayingVideo(false)
  }

  const completeGame = () => {
    setHasPlayedGame(true)
    // Decrement tickets and update localStorage
    if (account?.address) {
      const gameEntry = localStorage.getItem(`gameEntry_${account.address}`)
      if (gameEntry === 'purchased' || gameEntry === 'video') {
        // Remove the game entry to decrement tickets
        localStorage.removeItem(`gameEntry_${account.address}`)
        // Dispatch event to update header
        window.dispatchEvent(new CustomEvent('gameEntryUpdated'))
      }
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingPhoto(true)
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setUploadedPhoto(previewUrl)
      setPhotoFile(file)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo is ready for AI video generation",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleGenerateAIVideo = async () => {
    if (!photoFile) {
      toast({
        title: "No photo uploaded",
        description: "Please upload your photo first",
        variant: "destructive",
      })
      return
    }

    setAiVideoGenerating(true)
    
    try {
      // Simulate AI video generation process
      toast({
        title: "AI Video Generation Started",
        description: "Creating your personalized video with the PSG player...",
      })
      
      // Simulate processing time (5 seconds for demo)
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      toast({
        title: "🎬 AI Video Generated!",
        description: "Your personalized video is ready! Check your rewards page.",
      })
      
      // TODO: In production, this would upload to cloud storage and trigger AI video generation
      // const formData = new FormData()
      // formData.append('photo', photoFile)
      // formData.append('playerId', selectedCard?.toString() || '')
      // const response = await fetch('/api/generate-ai-video', { method: 'POST', body: formData })
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your AI video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAiVideoGenerating(false)
    }
  }

  // Social media sharing functions
  const tweetText = "I am watching the PSG/OL match right now and learning something! 📺⚽ Did you know? Women's football has grown by over 60% globally in the past decade! 🔥👩 More than 50 million women and girls are now playing the beautiful game worldwide, breaking barriers and inspiring the next generation! 💪 #WomensFootball #BreakingBarriers #PSG #OL"
  
  const handleShareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(tweetUrl, '_blank')
    setShowTweetPopup(false)
    toast({
      title: "Opening Twitter",
      description: "Share this amazing fact about women's football!",
    })
  }

  const handleCopyTweet = async () => {
    try {
      await navigator.clipboard.writeText(tweetText)
      setShowTweetPopup(false)
      toast({
        title: "Tweet copied!",
        description: "You can now paste it on your favorite social media platform",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient-psg mb-4"
        >
          Halftime Lottery
        </motion.h1>
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
          </div>
        </div>
        
{hasFreePlays ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">You have {freeTicketsCount} free play ticket{freeTicketsCount !== 1 ? 's' : ''}!</span>
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              Congratulations! You have free access to the halftime game
            </p>
          </div>
        ) : canPlayGame ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {gameEntry === 'purchased' 
                  ? 'Entry purchased successfully!' 
                  : 'Video quiz completed successfully!'
                }
              </span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              You earned 1 participation ticket and can now play the halftime game
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

      {/* Prediction Game Winner - Only show if user has free tickets */}
      {hasHalftimeTicket && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow border-l-4 border-l-purple-500"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Play The Lottery</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <Gift className="h-5 w-5" />
              <span className="font-medium text-sm">1 free ticket available</span>
            </div>
          </div>
          

          <div className="space-y-4">
            {/* Game Instructions */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2">🎯 Choose Your PSG Champion</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on one of the player cards. The winner of the lottery will be randomly selected!
              </p>
            </div>

              {/* Player Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {psgPlayers.map((player) => {
                  const isSelected = selectedCard === player.id
                  const isWinner = showResult && winningCard === player.id
                  const isLoser = showResult && selectedCard === player.id && winningCard !== player.id
                  const isPendingTransaction = isTransactionPending && selectedCard === player.id
                  
                  return (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: selectedCard === null && account && !isTransactionPending ? 1.05 : 1 }}
                      whileTap={{ scale: account && !isTransactionPending ? 0.95 : 1 }}
                      onClick={() => handleCardSelection(player.id)}
                      className={`relative transition-all duration-300 ${
                        !account 
                          ? 'cursor-not-allowed opacity-50'
                          : selectedCard === null && !isTransactionPending
                          ? 'cursor-pointer'
                          : 'cursor-default'
                      } ${
                        isPendingTransaction
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 
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
                        {typeof player.photo === "string" && player.photo.startsWith("http") ? (
                          <img
                          src={player.photo}
                          alt={player.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2 shadow-lg border-2 border-psg-blue"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-psg-blue to-chiliz-red rounded-full flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg">
                          {player.photo}
                          </div>
                        )}
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
                      {isSelected && !isPendingTransaction && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-psg-blue rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Transaction Pending Indicator */}
                      {isPendingTransaction && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
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

              {/* Transaction Status */}
              {isTransactionPending && selectedCard && (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p className="font-semibold">
                      Processing transaction for {psgPlayers.find(p => p.id === selectedCard)?.name}...
                    </p>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    Please wait while your lottery ticket is being processed on the blockchain.
                  </p>
                </div>
              )}

              {/* Selection Status */}
              {selectedCard && !showResult && !isTransactionPending && (
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
                </div>
              )}
            </div>
        </motion.div>
      )}

      {/* Free Ticket Option (if user has free tickets) */}
      {hasFreePlays && !canPlayGame && gameEntry === 'none' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 card-glow border border-green-200 dark:border-green-800"
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Gift className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300">
                You have {freeTicketsCount} free ticket{freeTicketsCount !== 1 ? 's' : ''}!
              </h3>
            </div>
            
            <p className="text-green-600 dark:text-green-400 mb-6">
              Use your free ticket to play the halftime game. You earned this by making accurate predictions!
            </p>
            
            <Button
              onClick={handleUseFreeTicket}
              disabled={isSubmittingEntry}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            >
              {isSubmittingEntry ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Using Ticket...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Use Free Ticket
                </>
              )}
            </Button>
            
            <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-3">
              Free • No payment required
            </p>
          </div>
        </motion.div>
      )}

      {/* Entry Options (if didn't win prediction and hasn't gained access) */}
      {!hasFreePlays && !canPlayGame && gameEntry === 'none' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Purchase Ticket */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow">
            <div className="flex items-start justify-between">
              {/* Left Column - Content */}
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-6 w-6 text-psg-blue" />
                  <h3 className="text-xl font-semibold">Purchase A Ticket</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get instant access to the halftime game
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-psg-blue">€1</span>
                  <span className="text-gray-500 ml-2">One-time payment</span>
                </div>
              </div>
              
              {/* Right Column - Payment Buttons */}
              <div className="flex flex-col space-y-3 min-w-[140px]">
                <span className='font-semibold text-sm text-gray-600 dark:text-gray-400'>Pay with</span>
                
                {/* CHZ Payment Button */}
                <div className="space-y-1">
                  <Button
                    onClick={() => handlePurchaseEntry('CHZ')}
                    disabled={!account || isSubmittingEntry}
                    className="w-full bg-chiliz-red hover:bg-chiliz-red/90 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
                  >
                    <span className="font-bold">$CHZ</span>
                  </Button>
                </div>
                
                {/* PSG Payment Button */}
                <div className="space-y-1">
                  <Button
                    onClick={() => handlePurchaseEntry('PSG')}
                    disabled={!account || isSubmittingEntry}
                    className="w-full bg-psg-blue hover:bg-psg-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
                  >
                    <span className="font-bold">$PSG</span>
                  </Button>
                </div>
                
                {isSubmittingEntry && (
                  <p className="text-xs text-gray-500 text-center">Processing...</p>
                )}
              </div>
            </div>
            
            {!account && (
              <p className="text-sm text-red-500 mt-4 text-center">
                Log in to purchase entry
              </p>
            )}
          </div>

          {/* Watch Video */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow">
            <div className="flex items-start justify-between">
              {/* Left Column - Content */}
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Play className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold">Watch, Learn & Earn A Ticket</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Watch a short video, learn about women's football, and help spread awareness by engaging with the content
                </p>
                <div className="mb-4">
                  <span className="text-green-600 font-semibold">FREE</span>
                  <span className="text-gray-500 ml-2">~2 minutes maximum</span>
                </div>
              </div>
              
              {/* Right Column - Video Button/Player */}
              <div className="flex flex-col justify-center min-w-[140px]">
                {!isPlayingVideo ? (
                  <Button
                    onClick={handleWatchVideo}
                    disabled={!account}
                    className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Video
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-2">
                      <iframe 
                        width="100%" 
                        height="200" 
                        src="https://www.youtube.com/embed/X_wLVRYHIS4?si=Rckp5wRhmeoJ72VP" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                    <p className="text-xs text-gray-500">Watch the full video to continue</p>
                    
                    
                    {/* Demo fallback button */}
                    <Button
                      onClick={ShowQuizAfterVideo}
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      Done ! Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {!account && (
              <p className="text-sm text-red-500 mt-4 text-center">
                Log in to watch video
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Video Completed - Female Football Promotion */}
      {videoWatched && gameEntry === 'none' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow border-l-4 border-l-green-500"
        >
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold">Video Completed - Thank You!</h3>
          </div>
          
          {/* Female Football Promotion */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6 text-center">
            <div className="text-5xl mb-4">👩💙⚽</div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Did you know?
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-4">
              Women's football has grown by over 60% globally in the past decade, with more than 50 million women and girls now playing the beautiful game worldwide, breaking barriers and inspiring the next generation!
            </p>
            
            {/* Social Media Sharing Button */}
            <Button
              onClick={() => setShowTweetPopup(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 text-sm font-medium rounded-full"
            >
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share this fact!</span>
              </div>
            </Button>
          </div>

          <Button
            onClick={handleUnlockGame}
            disabled={!account || isSubmittingEntry}
            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingEntry ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Unlocking...</span>
              </div>
            ) : (
              "Unlock Game Access"
            )}
          </Button>
          
          {!account && (
            <p className="text-sm text-red-500 mt-4 text-center">
              🔗 Log in to unlock the game
            </p>
          )}
        </motion.div>
      )}

      {/* Game Arena */}
      {canPlayGame && !hasPlayedGame && !hasHalftimeTicket && (
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
                        {typeof player.photo === "string" && player.photo.startsWith("http") ? (
                          <img
                          src={player.photo}
                          alt={player.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2 shadow-lg border-2 border-psg-blue"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-psg-blue to-chiliz-red rounded-full flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg">
                          {player.photo}
                          </div>
                        )}
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
                
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-2">
                  😅 Not This Time, But...
                </h3>
                <p className="text-orange-600 dark:text-orange-400 mb-4">
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
                      <div className='flex items-center justify-center'>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3 w-fit">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="photo-upload"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                      />
                      
                      {!uploadedPhoto ? (
                        <label 
                          htmlFor="photo-upload" 
                          className={`cursor-pointer inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isUploadingPhoto ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              <span className="text-sm font-medium">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Upload Your Photo</span>
                            </>
                          )}
                        </label>
                      ) : (
                        <div className="text-center">
                          <div className="mb-3">
                            <img 
                              src={uploadedPhoto} 
                              alt="Uploaded photo" 
                              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-300"
                            />
                          </div>
                          <p className="text-sm text-green-600 font-medium mb-2">✅ Photo uploaded successfully!</p>
                          <button
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            className="text-xs text-purple-600 hover:text-purple-700 underline"
                          >
                            Change photo
                          </button>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {uploadedPhoto ? 'Ready for AI video generation' : 'JPG, PNG up to 5MB'}
                      </p>
                    </div>
                      </div>
                    
                  </div>
                </div>
                
                <div className="flex space-x-2 justify-center">
                  <Button 
                    onClick={handleGenerateAIVideo}
                    disabled={!uploadedPhoto || aiVideoGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiVideoGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {uploadedPhoto ? 'Generate AI Video' : 'Upload Photo First'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🪙</div>
              <h2 className="text-xl font-bold mb-4">1€ Ticket Purchase</h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <p><strong>Token:</strong> ${purchaseTokenType}</p>
                <p><strong>Price:</strong> ~€1.00</p>
                <p><strong>Amount:</strong> 1.00 {purchaseTokenType}</p> //FIXME: get the real price from the contract

              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                This is a simulation of the token purchase flow. In production, this would connect to a real payment provider.
              </p>
              
              {purchaseProcessing ? (
                <div className="text-orange-600 font-medium">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  Processing payment...
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    onClick={handlePurchaseSuccess}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✅ Simulate Success
                  </Button>
                  <Button
                    onClick={handlePurchaseCancel}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    ❌ Cancel
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Social Media Sharing Popup */}
      {showTweetPopup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowTweetPopup(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📱✨</div>
              <h2 className="text-xl font-bold mb-4">Share Women's Football Facts!</h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ready to share:</p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {tweetText}
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Help us spread awareness about women's football! 🚀
              </p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleShareOnTwitter}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share on Twitter</span>
                  </div>
                </Button>
                <Button
                  onClick={handleCopyTweet}
                  variant="outline"
                  className="flex-1 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <div className="flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Copy Text</span>
                  </div>
                </Button>
              </div>
              
              <Button
                onClick={() => setShowTweetPopup(false)}
                variant="ghost"
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
