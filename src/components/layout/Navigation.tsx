import { Link, useLocation } from 'react-router-dom'
import { Home, Target, Grid3X3, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/predictions', icon: Target, label: 'Before Match' },
  { href: '/halftime', icon: Grid3X3, label: 'Halftime Game' },
  { href: '/rewards', icon: Gift, label: 'Rewards' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
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
              <Icon className="h-5 w-5" />
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
