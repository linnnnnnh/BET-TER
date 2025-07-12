import { ReactNode } from 'react'
import Header from './Header'
import Navigation from './Navigation'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-psg-chiliz-gradient dark:bg-psg-chiliz-gradient-dark">
      <Header />
      
      <main className="pb-20 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4"
        >
          {children}
        </motion.div>
      </main>
      
      <Navigation />
    </div>
  )
}
