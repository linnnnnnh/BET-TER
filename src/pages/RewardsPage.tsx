import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Calendar, MapPin, Award, Gift, Sparkles } from 'lucide-react'

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gradient-psg mb-4"
        >
          My Rewards
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your earned prizes and exclusive NFT collections
        </p>
      </div>
      
      {/* NFT Reward Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6"
      >
        {/* Tier 1 NFT Prize */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">Tier 1 Prize</h2>
                <p className="text-purple-600 dark:text-purple-400 text-sm">Exclusive NFT Collection</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-700 dark:text-yellow-300 text-sm font-semibold">Premium</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* NFT Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              {/* NFT Image Placeholder */}
              <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-center text-white">
                  <div className="text-6xl mb-4">⚽👩</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-1">Historic Women's Match</h3>
                    <p className="text-sm opacity-90">Bordeaux vs Dijon</p>
                    <p className="text-xs opacity-75">December 2024</p>
                  </div>
                </div>
                
                {/* NFT Badge */}
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  NFT #001
                </div>
              </div>
              
              {/* NFT Details */}
              <div className="p-4">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Women's Football Historic Moment
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Match Date: December 15, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Stade Matmut-Atlantique, Bordeaux</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>Division 1 Féminine Championship</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Information */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Match Highlights</span>
                </h4>
                
                {/* Teams */}
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <span className="text-white text-sm font-bold">BOR</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">FC Bordeaux</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Women</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">VS</div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <span className="text-white text-sm font-bold">DIJ</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dijon FCO</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Women</p>
                  </div>
                </div>

                {/* Match Stats */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">NFT Features</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Rarity:</span>
                      <span className="ml-1 font-semibold text-purple-600 dark:text-purple-400">Legendary</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Edition:</span>
                      <span className="ml-1 font-semibold">1 of 100</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Collection:</span>
                      <span className="ml-1 font-semibold">Women's Football</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Chain:</span>
                      <span className="ml-1 font-semibold text-chiliz-red">Chiliz</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Your Benefits</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Exclusive NFT ownership certificate</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Access to VIP women's football events</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Priority booking for future matches</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Digital collectible with resale value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 text-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg">
              Claim Your NFT Reward
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              🎉 Congratulations! You've earned this exclusive reward for supporting women's football
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
