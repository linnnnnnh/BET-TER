# BET-TER Project Documentation

## Project Overview
BET-TER is a fan engagement platform for PSG fans, built using React, TypeScript, and Vite. It integrates blockchain technology via ThirdWeb to enable smart contract interactions for predictions, heatmap games, and rewards. The platform allows users to:

- Submit match predictions
- Play interactive halftime games
- Earn rewards through campaigns

## Current State
### Features Implemented
1. **Header Component**
   - Displays free tickets fetched from the smart contract.
   - Dark mode toggle with persistence via localStorage.
   - Wallet connection using ThirdWeb.

2. **PredictionPage Component**
   - Allows users to submit halftime score predictions.
   - UI for inputting scores and submitting predictions.
   - Placeholder logic for smart contract integration (submitPredictions).

3. **HeatmapPage Component**
   - Interactive halftime game with multiple entry options:
     - Free tickets (fetched from smart contract).
     - Paid entry using CHZ or PSG tokens.
     - Video watching and quiz completion.
   - Placeholder logic for smart contract integration (playHeatmapWithTicket, playHeatmapWithChz).

4. **Contract Utility**
   - `getEngagementContract`: Utility function to access the EngagementPlatform smart contract.
   - `CURRENT_CAMPAIGN_ID`: Constant for the current campaign.

### Smart Contract Integration
#### Completed
- **Header Component**: Reads `userFreeTickets` from the smart contract.
- **HeatmapPage Component**: Reads `userFreeTickets` and displays free ticket options.

#### Pending
1. **PredictionPage**
   - Implement `submitPredictions` smart contract call.

2. **HeatmapPage**
   - Implement `playHeatmapWithTicket` smart contract call.
   - Implement `playHeatmapWithChz` smart contract call.

3. **RewardsPage**
   - Integrate campaign and prize management functions.

### Known Issues
1. **ThirdWeb TypeScript Compatibility**
   - Type mismatches in `useSendTransaction` and `prepareContractCall`.
   - Workaround: Placeholder logic for smart contract calls.

2. **Dark Mode Initialization**
   - Fixed: Properly initializes based on localStorage and DOM state.

## Next Steps
### Development Tasks
1. **Smart Contract Integration**
   - Replace placeholder logic with actual smart contract calls.
   - Ensure proper error handling and user feedback.

2. **Testing**
   - Unit tests for smart contract interactions.
   - End-to-end tests for user flows (predictions, game entry, rewards).

3. **Deployment**
   - Deploy smart contracts to the Chiliz blockchain.
   - Update `.env` with deployed contract addresses.

### Documentation
1. **API Documentation**
   - Document all API endpoints (e.g., `VITE_BACKEND_API_URL`).

2. **Smart Contract Documentation**
   - ABI details for EngagementPlatform contract.
   - Function descriptions (inputs, outputs, state mutability).

3. **User Guide**
   - How to connect wallet and interact with the platform.
   - Explanation of game mechanics and rewards.

## Environment Variables
### Current
- `VITE_THIRDWEB_CLIENT_ID`: ThirdWeb client ID.
- `VITE_PREDICTION_CONTRACT_ADDRESS`: Prediction contract address.
- `VITE_HEATMAP_CONTRACT_ADDRESS`: Heatmap contract address (pending deployment).
- `VITE_TREASURY_CONTRACT_ADDRESS`: Treasury contract address (pending deployment).
- `VITE_BACKEND_API_URL`: Backend API URL.
- `VITE_PYTH_ENDPOINT`: Pyth network endpoint.

### Required
- Update contract addresses after deployment.

## Team Notes
- Ensure all teammates have access to the `.env` file.
- Use the `PROJECT_DOCUMENTATION.md` file as a reference for development tasks.
- Coordinate on resolving ThirdWeb TypeScript issues.

---
This documentation provides a comprehensive overview of the project and outlines the next steps for development. Please reach out if you have any questions or need clarification on specific tasks.
