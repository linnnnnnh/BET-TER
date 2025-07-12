Let users pay with whatever they have without leaving your app

Docs

Search Docs
K
Ask AI
Wallets
Payments
Transactions
Contracts
Insight
Vault
SDKs
APIs
Tools
Support
Changelog
Payments

Overview
Supported Routes
Onramp Providers
Service Fees

Get Started

Tutorials
Cross-Chain Swapping
Swap with Smart Accounts
Fiat Onramp
NFT Checkout

Customization
API Reference

SDK Reference
Webhooks
Troubleshoot
FAQs
Fiat-to-Crypto Onramp Integration
Learn how to integrate seamless fiat-to-crypto onramps using Payments. This guide covers integration with Stripe, Coinbase, and Transak providers, enabling your users to purchase crypto directly with fiat currency.

Payments's onramp functionality provides a unified interface across multiple providers, automatic routing to the best rates, and comprehensive status tracking.

Install the SDK
npm
yarn
pnpm
npm i thirdweb

Setup and Configuration
Configure your client and understand the available onramp providers:

import { createThirdwebClient } from "thirdweb";
import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
 
const client = createThirdwebClient({
  clientId: "your_client_id",
});

Basic Onramp Integration
Create a basic onramp experience for your users:

Stripe
Coinbase
Transak
import { Bridge, NATIVE_TOKEN_ADDRESS, toWei } from "thirdweb";
 
async function createTransakOnramp(userAddress: string) {
  try {
    const onrampSession = await Bridge.Onramp.prepare({
      client,
      onramp: "transak",
      chainId: 137, // Polygon
      tokenAddress: NATIVE_TOKEN_ADDRESS, // MATIC
      receiver: userAddress,
      amount: toWei("10"), // 10 MATIC
      currency: "USD",
      country: "US",
    });
 
    // Redirect to Transak
    window.open(onrampSession.link);
 
    return onrampSession;
  } catch (error) {
    console.error("Failed to create Transak onramp:", error);
    throw error;
  }
}

Status Monitoring
Monitor onramp transactions and handle completion:

import { Bridge } from "thirdweb";
 
// Monitor onramp status
const status = await Bridge.Onramp.status({
  sessionId,
  client,
});
 
switch (status.status) {
  case "COMPLETED":
    console.log("Onramp completed successfully!");
    console.log("Transaction hash:", status.transactionHash);
    console.log("Amount received:", status.destinationAmount);
    // Update your UI to show success
    break;
 
  case "PENDING":
    console.log("Onramp in progress...");
    // Show loading state to user
    setTimeout(() => monitorOnrampStatus(sessionId), 10000); // Check again in 10s
    break;
 
  case "FAILED":
    console.log("Onramp failed:", status.error);
    // Show error message to user
    break;
 
  case "CANCELLED":
    console.log("Onramp was cancelled by user");
    // Handle cancellation
    break;
 
  default:
    console.log("Unknown status:", status.status);
}

Next Steps
Onramp Providers - Detailed provider comparison and features
Webhooks - Set up real-time onramp status notifications
Testing - Test onramp flows in development mode
Payments API - Complete API reference
Edit this page
Was this page helpful?

Yes
No
Need help?
Visit our support site
Watch our
video Tutorials
View our
changelog
Using AI?
View llms.txt
Subscribe for the latest dev updates

Email
Subscribe
On this page
Install the SDK
Setup and Configuration
Basic Onramp Integration
Status Monitoring
Next Steps
thirdweb Payments - Onramp Integration | thirdweb