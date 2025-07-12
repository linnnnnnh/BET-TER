import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'
import { Menu, X, Ticket, Moon, Sun } from 'lucide-react'

export default function Header() {
  const account = useActiveAccount()
  const [showMenu, setShowMenu] = useState(false)
  const [isDark, setIsDark] = useState(true)

  // Check for existing dark mode preference
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(!isDark)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-psg-blue to-chiliz-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PSG</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Fan Hub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Tickets Display */}
            {account && (
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  3 Free Tickets
                </span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* User Authentication */}
            <ConnectButton
              client={client}
              connectButton={{
                label: "Log In",
              }}
              connectModal={{
                title: "Log In to PSG Fan Hub",
              }}
              detailsButton={{
                displayBalanceToken: {
                  // You can specify tokens to display
                }
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {showMenu ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Tickets */}
            {account && (
              <div className="flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4">
                <Ticket className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  3 Free Play Tickets Available
                </span>
              </div>
            )}
            
            {/* Mobile Auth */}
            <div className="flex justify-center">
              <ConnectButton
                client={client}
                connectButton={{
                  label: account ? "Logged In" : "Log In",
                }}
                connectModal={{
                  title: "Log In to PSG Fan Hub",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}