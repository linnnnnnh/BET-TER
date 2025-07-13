import { Link, useLocation } from 'react-router-dom'
import { Home, User } from 'lucide-react'

// Numbered circle components
const NumberIcon = ({ number, isActive }: { number: number, isActive: boolean }) => {
  const getColors = () => {
    if (isActive) {
      switch (number) {
        case 1: return 'bg-blue-500'
        case 2: return 'bg-chiliz-red'
        case 3: return 'bg-yellow-500'
        default: return 'bg-gray-500'
      }
    }
    return 'bg-gray-400'
  }
  
  return (
    <div className={`w-5 h-5 ${getColors()} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
      {number}
    </div>
  )
}

const navItems = [
  { href: '/', icon: Home, label: 'Home', isNumbered: false as const },
  { href: '/predictions', icon: NumberIcon, label: 'Predict Game', isNumbered: true as const, number: 1 },
  { href: '/halftime', icon: NumberIcon, label: 'Play Lottery', isNumbered: true as const, number: 2 },
  { href: '/rewards', icon: NumberIcon, label: 'Win Rewards', isNumbered: true as const, number: 3 },
  { href: '/profile', icon: User, label: 'Profile', isNumbered: false as const },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const { href, icon: Icon, label, isNumbered } = item
          const isActive = location.pathname === href
          
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-chiliz-red'
                  : 'text-gray-500 hover:text-chiliz-red dark:text-gray-400 dark:hover:text-chiliz-red'
              }`}
            >
              {isNumbered && 'number' in item ? (
                <Icon number={item.number} isActive={isActive} />
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-chiliz-red rounded-t-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
