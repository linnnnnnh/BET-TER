import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PredictionPage from './pages/PredictionPage'
import HeatmapPage from './pages/HeatmapPage'
import RewardsPage from './pages/RewardsPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predictions" element={<PredictionPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App
