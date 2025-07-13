import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReadContract } from 'thirdweb/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Timer, Trophy, Target, Gamepad2, Gift, Clock, Calendar, Star, Medal, Crown, Award } from 'lucide-react'
import { getEngagementContract } from '@/lib/contract'

export default function HomePage() {
  const [rulesOpen, setRulesOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  // Get current campaign ID from smart contract
  const { data: nextCampaignId } = useReadContract({
    contract: getEngagementContract(),
    method: 'function nextCampaignId() view returns (uint256)',
    params: []
  })

  // Calculate current campaign ID (always nextCampaignId - 1)
  const actualCurrentCampaignId = nextCampaignId ? Number(nextCampaignId) - 1 : 1

  // Get current campaign info
  const { data: campaignData } = useReadContract({
    contract: getEngagementContract(),
    method: 'function campaigns(uint256) view returns (uint256 id, string team1, string team2, uint256 startTimePredictionGame, uint256 endTimePredictionGame, uint256 startTimeSecondHalftimeGame, uint256 endTimeSecondHalftimeGame, bool active)',
    params: [BigInt(actualCurrentCampaignId)]
  })

  // Extract campaign data
  const team1 = campaignData?.[1] || "PSG"
  const team2 = campaignData?.[2] || "Lyon"
  const startTimePredictionGame = Number(campaignData?.[3] || 0)
  const endTimePredictionGame = Number(campaignData?.[4] || 0)
  const startTimeSecondHalftimeGame = Number(campaignData?.[5] || 0)
  const endTimeSecondHalftimeGame = Number(campaignData?.[6] || 0)
  const isActive = campaignData?.[7] || false

  // Calculate time remaining for predictions
  const [timeRemaining, setTimeRemaining] = useState('')
  const [currentPhase, setCurrentPhase] = useState<'predictions' | 'halftime' | 'results' | 'waiting'>('waiting')

  useEffect(() => {
    if (!campaignData) return

    const updateTimeAndPhase = () => {
      const now = Math.floor(Date.now() / 1000)
      
      if (now < startTimePredictionGame) {
        setCurrentPhase('waiting')
        const diff = startTimePredictionGame - now
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        setTimeRemaining(`${hours}h ${minutes}m until predictions open`)
      } else if (now >= startTimePredictionGame && now < endTimePredictionGame) {
        setCurrentPhase('predictions')
        const diff = endTimePredictionGame - now
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else if (now >= startTimeSecondHalftimeGame && now < endTimeSecondHalftimeGame) {
        setCurrentPhase('halftime')
        const diff = endTimeSecondHalftimeGame - now
        const minutes = Math.floor(diff / 60)
        setTimeRemaining(`${minutes}m`)
      } else {
        setCurrentPhase('results')
        setTimeRemaining('Match completed')
      }
    }

    updateTimeAndPhase()
    const interval = setInterval(updateTimeAndPhase, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [campaignData, startTimePredictionGame, endTimePredictionGame, startTimeSecondHalftimeGame, endTimeSecondHalftimeGame])

  // Format timestamp to readable date
  const formatMatchTime = (timestamp: number) => {
    if (timestamp === 0) return { date: "July 13, 2025", time: "20:00 CET" }
    const date = new Date(timestamp * 1000)
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      })
    }
  }

  const matchTime = formatMatchTime(startTimePredictionGame)

  // Helper function to get team abbreviation
  const getTeamAbbreviation = (teamName: string) => {
    if (teamName.toLowerCase().includes('psg') || teamName.toLowerCase().includes('paris')) return 'PSG'
    if (teamName.toLowerCase().includes('lyon') || teamName.toLowerCase().includes('ol')) return 'OL'
    if (teamName.toLowerCase().includes('marseille') || teamName.toLowerCase().includes('om')) return 'OM'
    if (teamName.toLowerCase().includes('monaco')) return 'MON'
    // Default to first 3 characters
    return teamName.substring(0, 3).toUpperCase()
  }

  // Fake leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Alex_PSG", points: 2450, rewards: 8, avatar: "🏆" },
    { rank: 2, name: "Marie_Paris", points: 2180, rewards: 6, avatar: "⭐" },
    { rank: 3, name: "Lucas_Ultras", points: 1950, rewards: 5, avatar: "🎯" },
    { rank: 4, name: "Sophie_Fan", points: 1720, rewards: 4, avatar: "🎮" },
    { rank: 5, name: "Thomas_PSG", points: 1580, rewards: 3, avatar: "🏅" },
    { rank: 6, name: "Emma_Parisien", points: 1340, rewards: 3, avatar: "⚽" },
    { rank: 7, name: "Jules_Supporter", points: 1210, rewards: 2, avatar: "🌟" },
    { rank: 8, name: "Chloe_Blue", points: 980, rewards: 2, avatar: "💫" },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gradient-psg mb-3">
            Start from here
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            Predict, Play, and Win Better
          </p>
        </motion.div>
      </div>

      {/* Workflow Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl card-glow p-6"
      >
        <h2 className="text-lg font-semibold mb-6">How It Works ?</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Step 1: Predict */}
          <div className="text-center">
            <div className="bg-blue-500 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold text-sm mb-1">Predict</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Predict to win a ticket for the halftime game
            </p>
          </div>

          {/* Step 2: Play */}
          <div className="text-center">
            <div className="bg-chiliz-red text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold text-sm mb-1">Play</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use the ticket to play
            </p>
          </div>

          {/* Step 3: Win */}
          <div className="text-center">
            <div className="bg-yellow-500 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold text-sm mb-1">Rewards</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Win prizes & exclusive rewards
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next Match Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow border-l-4 border-l-psg-blue"
      >
        {/* Match Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Match</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Ligue 1 Championship</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{matchTime.date}</span>
            </div>
            <p className="text-psg-blue font-semibold text-sm">{matchTime.time}</p>
          </div>
        </div>
        
        {/* Teams */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-psg-blue rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white text-lg font-bold">{getTeamAbbreviation(team1)}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{team1}</p>
            </div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white text-lg font-bold">{getTeamAbbreviation(team2)}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{team2}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Match Timeline</h3>
          
          {/* Phase 1 */}
          <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
            currentPhase === 'predictions' 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPhase === 'predictions' ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${
                  currentPhase === 'predictions' 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>Phase 1: Predictions</h4>
                <span className={`text-sm font-medium ${
                  currentPhase === 'predictions' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {currentPhase === 'predictions' ? 'ACTIVE' : 
                   currentPhase === 'waiting' ? 'UPCOMING' : 'CLOSED'}
                </span>
              </div>
              <p className={`text-sm ${
                currentPhase === 'predictions' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {currentPhase === 'predictions' ? timeRemaining + ' remaining' : 
                 formatMatchTime(startTimePredictionGame).time + ' - ' + formatMatchTime(endTimePredictionGame).time}
              </p>
            </div>
          </div>
          
          {/* Phase 2 */}
          <div className={`flex items-center space-x-4 p-3 rounded-lg ${
            currentPhase === 'halftime' 
              ? 'bg-chiliz-red/10 border border-chiliz-red/20' 
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPhase === 'halftime' ? 'bg-chiliz-red' : 'bg-gray-400'
            }`}>
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${
                  currentPhase === 'halftime' 
                    ? 'text-chiliz-red' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>Phase 2: halftime Game</h4>
                <span className={`text-sm ${
                  currentPhase === 'halftime' 
                    ? 'text-chiliz-red font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {currentPhase === 'halftime' ? 'ACTIVE' : 'UPCOMING'}
                </span>
              </div>
              <p className={`text-sm ${
                currentPhase === 'halftime' 
                  ? 'text-chiliz-red' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {currentPhase === 'halftime' ? timeRemaining + ' remaining' : 
                 formatMatchTime(startTimeSecondHalftimeGame).time + ' - ' + formatMatchTime(endTimeSecondHalftimeGame).time}
              </p>
            </div>
          </div>
          
          {/* Phase 3 */}
          <div className={`flex items-center space-x-4 p-3 rounded-lg ${
            currentPhase === 'results' 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPhase === 'results' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${
                  currentPhase === 'results' 
                    ? 'text-yellow-700 dark:text-yellow-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>Phase 3: Results & Rewards</h4>
                <span className={`text-sm ${
                  currentPhase === 'results' 
                    ? 'text-yellow-600 dark:text-yellow-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {currentPhase === 'results' ? 'ACTIVE' : 'UPCOMING'}
                </span>
              </div>
              <p className={`text-sm ${
                currentPhase === 'results' 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {currentPhase === 'results' ? timeRemaining : 
                 'After ' + formatMatchTime(endTimeSecondHalftimeGame).time}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`rounded-xl p-6 border ${
          currentPhase === 'predictions' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : currentPhase === 'halftime'
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : currentPhase === 'results'
            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            currentPhase === 'predictions' ? 'bg-green-500' :
            currentPhase === 'halftime' ? 'bg-orange-500' :
            currentPhase === 'results' ? 'bg-purple-500' :
            'bg-gray-500'
          }`}>
            {currentPhase === 'predictions' && <Timer className="h-6 w-6 text-white" />}
            {currentPhase === 'halftime' && <Gamepad2 className="h-6 w-6 text-white" />}
            {currentPhase === 'results' && <Trophy className="h-6 w-6 text-white" />}
            {currentPhase === 'waiting' && <Clock className="h-6 w-6 text-white" />}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              currentPhase === 'predictions' ? 'text-green-700 dark:text-green-300' :
              currentPhase === 'halftime' ? 'text-orange-700 dark:text-orange-300' :
              currentPhase === 'results' ? 'text-purple-700 dark:text-purple-300' :
              'text-gray-700 dark:text-gray-300'
            }`}>
              {currentPhase === 'predictions' && 'Predictions Are Open!'}
              {currentPhase === 'halftime' && 'halftime Game Active!'}
              {currentPhase === 'results' && 'Results Available!'}
              {currentPhase === 'waiting' && 'Waiting for Next Match'}
            </h3>
            <p className={`text-sm ${
              currentPhase === 'predictions' ? 'text-green-600 dark:text-green-400' :
              currentPhase === 'halftime' ? 'text-orange-600 dark:text-orange-400' :
              currentPhase === 'results' ? 'text-purple-600 dark:text-purple-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {currentPhase === 'predictions' && 'Make your predictions now and earn Free Play Tickets for the halftime game'}
              {currentPhase === 'halftime' && 'Use your tickets to play the halftime game and win prizes!'}
              {currentPhase === 'results' && 'Check your results and claim your rewards'}
              {currentPhase === 'waiting' && 'The next match campaign will start soon'}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              currentPhase === 'predictions' ? 'text-green-700 dark:text-green-300' :
              currentPhase === 'halftime' ? 'text-orange-700 dark:text-orange-300' :
              currentPhase === 'results' ? 'text-purple-700 dark:text-purple-300' :
              'text-gray-700 dark:text-gray-300'
            }`}>
              {currentPhase === 'predictions' || currentPhase === 'halftime' ? 
                timeRemaining.split(' ')[0] : 
                currentPhase === 'results' ? '✓' : '⏳'}
            </p>
            <p className={`text-sm ${
              currentPhase === 'predictions' ? 'text-green-600 dark:text-green-400' :
              currentPhase === 'halftime' ? 'text-orange-600 dark:text-orange-400' :
              currentPhase === 'results' ? 'text-purple-600 dark:text-purple-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {currentPhase === 'predictions' && 'hours left'}
              {currentPhase === 'halftime' && 'minutes left'}
              {currentPhase === 'results' && 'completed'}
              {currentPhase === 'waiting' && 'waiting'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Rules Modal */}
          <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="py-4">
                View Rules
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-xl">
                  <Target className="h-6 w-6 text-psg-blue" />
                  <span>PSG Fan Hub - Game Rules</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Overview */}
                <div className="bg-gradient-to-r from-psg-blue/10 to-chiliz-red/10 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">🎯 Game Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    PSG Fan Hub is a two-phase engagement platform designed for match days. 
                    Predict match outcomes to earn Free Play Tickets, then use them in our 
                    exciting halftime mini-game to win exclusive rewards!
                  </p>
                </div>

                {/* Phase 1 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-lg">Prediction Phase</h3>
                  </div>
                  <div className="ml-10 space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">📅 <strong>When:</strong> 1 hour before match until kickoff</p>
                    <p className="text-gray-600 dark:text-gray-300">🎯 <strong>Goal:</strong> Predict the halftime score (e.g., {team1} 2-0 {team2})</p>
                    <p className="text-gray-600 dark:text-gray-300">🎁 <strong>Reward:</strong> Correct predictions earn Free Play Tickets</p>
                    <p className="text-gray-600 dark:text-gray-300">🤖 <strong>Help:</strong> AI chatbot available for assistance</p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-chiliz-red rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-lg">halftime Game</h3>
                  </div>
                  <div className="ml-10 space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">📅 <strong>When:</strong> During halftime (15 minutes)</p>
                    <p className="text-gray-600 dark:text-gray-300">🎮 <strong>Game:</strong> Select a PSG player card to win prizes</p>
                    <p className="text-gray-600 dark:text-gray-300">🎫 <strong>Entry:</strong> Use Free Play Tickets or purchase entry (€1)</p>
                    <p className="text-gray-600 dark:text-gray-300">📺 <strong>Alt Entry:</strong> Watch partner video + answer quiz</p>
                  </div>
                </div>

                {/* Rewards */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Gift className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Rewards & Prizes</h3>
                  </div>
                  <div className="ml-10 space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                      <p className="font-medium text-green-700 dark:text-green-300">🏆 Winners:</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">PSG merchandise, signed items, match tickets, exclusive experiences</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                      <p className="font-medium text-orange-700 dark:text-orange-300">🎬 Consolation Prize:</p>
                      <p className="text-orange-600 dark:text-orange-400 text-sm">Personalized AI-generated video with your selected PSG player</p>
                    </div>
                  </div>
                </div>

                {/* Social Impact */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">💜 Social Impact</h3>
                  <p className="text-purple-600 dark:text-purple-400">
                    30% of all game entry purchases go to women's football inclusion initiatives, 
                    supporting the growth and development of women's sports.
                  </p>
                </div>

                {/* Important Notes */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">📝 Important Notes</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• You must be logged in to participate</li>
                    <li>• Predictions close at match kickoff</li>
                    <li>• halftime game is available only during halftime</li>
                    <li>• Winners are randomly selected from all participants</li>
                    <li>• Rewards can be claimed in the "My Rewards" section</li>
                    <li>• All transactions are secured on the Chiliz blockchain</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Leaderboard Modal */}
          <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="py-4">
                Leaderboard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-xl">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span>Season Leaderboard</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-1">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      player.rank === 1 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700' 
                        : player.rank === 2
                        ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/30 dark:to-gray-600/20 border border-gray-200 dark:border-gray-600'
                        : player.rank === 3
                        ? 'bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700'
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 h-8">
                      {player.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                      {player.rank === 2 && <Medal className="h-5 w-5 text-gray-500" />}
                      {player.rank === 3 && <Award className="h-5 w-5 text-orange-500" />}
                      {player.rank > 3 && (
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {player.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="text-lg">{player.avatar}</div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {player.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {player.rewards} rewards won
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="font-bold text-psg-blue text-sm">
                        {player.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* User's Rank */}
              <div className="mt-4 p-3 bg-psg-blue/10 border border-psg-blue/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-psg-blue" />
                    <span className="font-medium text-psg-blue">Your Position</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-psg-blue">#42</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">650 points</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rankings updated every match • Season ends May 2025
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  )
}