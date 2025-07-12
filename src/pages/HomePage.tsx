import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Timer, Trophy, Target, Gamepad2, Gift, Clock, Calendar } from 'lucide-react'

export default function HomePage() {

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

      {/* Workflow Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 card-glow"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">How It Works</h2>
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
          <Button variant="outline" className="py-4">
            View Rules
          </Button>
          <Button variant="outline" className="py-4">
            Leaderboard
          </Button>
        </motion.div>
      </div>

    </div>
  )
}
