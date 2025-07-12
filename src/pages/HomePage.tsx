import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Timer, Trophy, Target, Gamepad2, Gift, Clock, Calendar, Star, Medal, Crown, Award, ChevronDown, ChevronUp } from 'lucide-react'

export default function HomePage() {
  const [rulesOpen, setRulesOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [workflowOpen, setWorkflowOpen] = useState(false)

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
            PSG Fan Hub
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            Predict, Play, and Win with PSG
          </p>
        </motion.div>
      </div>

      {/* Workflow Steps - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl card-glow overflow-hidden"
      >
        {/* Dropdown Header */}
        <button
          onClick={() => setWorkflowOpen(!workflowOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <h2 className="text-lg font-semibold">How It Works ?</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {workflowOpen ? 'Hide' : 'Show'} workflow steps
            </span>
            {workflowOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </button>

        {/* Collapsible Content */}
        <motion.div
          initial={false}
          animate={{ 
            height: workflowOpen ? 'auto' : 0,
            opacity: workflowOpen ? 1 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: 'easeInOut',
            opacity: { duration: workflowOpen ? 0.3 : 0.1 }
          }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Step 1: Predict */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-2">1</div>
                <h3 className="font-semibold text-sm mb-1">Predict</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Make match predictions & earn tickets
                </p>
              </div>

              {/* Step 2: Play */}
              <div className="text-center">
                <div className="w-12 h-12 bg-chiliz-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="h-6 w-6 text-chiliz-red" />
                </div>
                <div className="bg-chiliz-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-2">2</div>
                <h3 className="font-semibold text-sm mb-1">Play</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use tickets in heatmap game
                </p>
              </div>

              {/* Step 3: Win */}
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-2">3</div>
                <h3 className="font-semibold text-sm mb-1">Rewards</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Win prizes & exclusive rewards
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Next Match</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Ligue 1 Championship</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">July 13, 2025</span>
            </div>
            <p className="text-psg-blue font-semibold text-sm">20:00 CET</p>
          </div>
        </div>
        
        {/* Teams */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-psg-blue rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white text-lg font-bold">PSG</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Paris SG</p>
            </div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white text-lg font-bold">OL</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Olympique Lyon</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Match Timeline</h3>
          
          {/* Phase 1 */}
          <div className="flex items-center space-x-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Phase 1: Predictions</h4>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">ACTIVE</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Until 19:00 • 23h 45m remaining</p>
            </div>
          </div>
          
          {/* Phase 2 */}
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Phase 2: Heatmap Game</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">UPCOMING</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">20:45 - 21:00 (Halftime)</p>
            </div>
          </div>
          
          {/* Phase 3 */}
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Phase 3: Results & Rewards</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">UPCOMING</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">After 22:00</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Timer className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Predictions Are Open!</h3>
            <p className="text-green-600 dark:text-green-400 text-sm">
              Make your predictions now and earn Free Play Tickets for the heatmap game
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">23:45</p>
            <p className="text-sm text-green-600 dark:text-green-400">hours left</p>
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
                    exciting heatmap mini-game to win exclusive rewards!
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
                    <p className="text-gray-600 dark:text-gray-300">🎯 <strong>Goal:</strong> Predict the halftime score (e.g., PSG 2-0 Lyon)</p>
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
                    <h3 className="font-semibold text-lg">Heatmap Game</h3>
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
                    <li>• Heatmap game is available only during halftime</li>
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