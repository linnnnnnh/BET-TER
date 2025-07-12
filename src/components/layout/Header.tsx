import { ConnectButton, useActiveAccount } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'
import { Button } from '../ui/button'
import { Menu, Bell, Ticket } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const account = useActiveAccount()
  const [showMenu, setShowMenu] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-psg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-psg">PSG Fan Hub</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Chiliz</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Tickets Display - Desktop */}
            {account && (
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">3</span>
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-chiliz-red rounded-full animate-pulse"></span>
            </Button>

            {/* Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Wallet Connection - Desktop */}
            <div className="hidden md:block">
              <ConnectButton 
                client={client}
                theme="light"
                connectButton={{
                  label: "Connect Wallet",
                  style: {
                    background: "linear-gradient(135deg, #CC3340 0%, #FF6B35 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "1rem",
                    fontWeight: "500",
                  }
                }}
                connectModal={{
                  title: "Connect to PSG Fan Hub",
                  titleIcon: "https://psg-fan-platform.app/logo.png",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Mobile Tickets Display */}
              {account && (
                <div className="flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg">
                  <Ticket className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">3 Free Play Tickets</span>
                </div>
              )}

              {account ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Connected: {formatAddress(account.address)}
                  </p>
                </div>
              ) : null}
              <ConnectButton 
                client={client}
                theme="light"
                connectButton={{
                  label: account ? "Wallet Connected" : "Connect Wallet",
                  style: {
                    background: "linear-gradient(135deg, #CC3340 0%, #FF6B35 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    fontWeight: "500",
                    width: "100%",
                  }
                }}
                connectModal={{
                  title: "Connect to PSG Fan Hub",
                  titleIcon: "https://psg-fan-platform.app/logo.png",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
