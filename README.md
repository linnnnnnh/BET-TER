# bet-ter

A Web3 fan engagement platform for PSG supporters built on the Chiliz blockchain, featuring prediction markets, interactive games, and social impact treasury.

## 🧩 Problem
1. Women’s sports suffer from a lack of visibility — not due to absence, but due to lack of awareness and exposure.
2. We know women’s matches exist, but why don’t we think of watching them?
3. Media coverage is minimal, and public awareness is low.
4. Traditional solutions like education take decades, and media/TV lacks incentives to promote them.

## 🧠 Our Solution
1. Credits to stream women’s matches
2. Rewarded curiosity: get educated through play
3. AI-generated insights about women’s teams

## 🚀 Project Overview

This platform provides a two-phase fan engagement experience:

1. **Prediction Phase** (1 hour before match): Fans answer prediction questions with AI chatbot assistance
2. **Heatmap Game** (Halftime): Interactive mini-game with VRF-based outcomes and tiered rewards

### Key Features

- 🎯 **Prediction Market**: Pre-match predictions with AI assistance
- 🎮 **Interactive Heatmap Game**: Halftime mini-game with VRF
- 🏆 **Tiered Reward System**: On-site and online prizes with QR redemption
- 💰 **Dynamic Pricing**: $CHZ/$PSG support with Pyth oracle integration
- 🎬 **AI Consolation Videos**: Unique AI-generated videos for non-winners
- 💝 **Social Impact Treasury**: 30% to women's inclusion, 70% to protocol

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** for components

### Web3
- **ThirdWeb** for blockchain interactions and wallet connections
- **Multi-wallet support** with 500+ wallets built-in
- **Chiliz Chain** integration with custom chain configurations

### APIs
- **Gemini API** for AI chatbot
- **AI Video API** for consolation prizes
- **Pyth Network** for price feeds

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── Header.tsx          # Top navigation with wallet
│   │   └── Navigation.tsx      # Bottom navigation tabs
│   └── ui/                     # Reusable UI components
├── pages/
│   ├── HomePage.tsx            # Landing page with match info
│   ├── PredictionPage.tsx      # Prediction market interface
│   ├── HeatmapPage.tsx         # Heatmap game arena
│   ├── RewardsPage.tsx         # Rewards and QR codes
│   └── ProfilePage.tsx         # User profile and stats
├── providers/
│   └── Web3Provider.tsx        # Web3 configuration
├── lib/
│   └── utils.ts                # Utility functions
└── hooks/                      # Custom React hooks
```

## 🏗 Architecture Decisions

### Mobile-First Design
- Responsive design optimized for mobile usage during matches
- Bottom navigation for easy thumb navigation
- Touch-friendly components and interactions

### Web3 Integration
- **Chiliz Chain** as primary network with testnet support
- **Multi-token payments** supporting both $CHZ and $PSG
- **Dynamic pricing** via Pyth oracle (€1.00 men's, €0.50 women's matches)

### Event-Driven Smart Contracts
- **Gas-efficient design** with minimal on-chain storage
- **Event emission** for prize distribution and consolation triggers
- **Off-chain listeners** for complex reward logic

### AI Integration
- **Gemini API** for prediction assistance chatbot
- **AI Video API** for personalized consolation prizes
- **Context-aware** responses based on match data

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values:
   - `VITE_THIRDWEB_CLIENT_ID`: Get from [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
   - `VITE_GEMINI_API_KEY`: Get from Google AI Studio
   - `VITE_AI_VIDEO_API_KEY`: Get from your AI video provider

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```
6. **Adress**
   
   WOWToken
   ```bash
   0x3b697F4BBE13fbCBE075C611252aBd6D4237AFe9
   ```
   Better
   ```bash
   0xDA2E0cCA054C5d06B78268b0Bd3F7Eeb469474E4
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Design System

### Brand Colors
- **PSG Blue**: `#004C98`
- **PSG Red**: `#E30613`
- **PSG Gold**: `#FFD700`
- **Chiliz Red**: `#CC3340`
- **Chiliz Orange**: `#FF6B35`

### Component Library
Using shadcn/ui components with custom PSG/Chiliz theming:
- Consistent spacing and typography
- Dark mode support
- Accessible design patterns
- Mobile-optimized interactions

## 🌐 Deployment

The application is designed for deployment on:
- **Frontend**: Vercel/Netlify
- **Backend Services**: Serverless functions
- **Smart Contracts**: Chiliz Chain

## 🔮 Next Steps

### Phase 1: Core Implementation
1. Complete UI components and routing
2. Implement Web3 wallet integration
3. Build prediction market interface
4. Create heatmap game mechanics

### Phase 2: Smart Contract Integration
1. Deploy and configure smart contracts
2. Integrate Chainlink VRF for randomness
3. Set up Pyth oracle for price feeds
4. Implement treasury splitting logic

### Phase 3: AI & Backend Services
1. Integrate Gemini API for chatbot
2. Set up AI video generation
3. Build event listener services
4. Implement reward distribution

### Phase 4: Testing & Optimization
1. Comprehensive testing on testnet
2. Performance optimization
3. Security audits
4. User experience testing

## 📄 License

This project is part of the Chiliz hackathon submission.

## 🤝 Contributing

This is a hackathon project. For questions or collaboration, please reach out to the development team.

---

Built with ❤️ for PSG fans by the Chiliz community
