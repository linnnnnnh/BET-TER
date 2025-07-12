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
Connect

React
Overview
Getting Started
Live Playground
API Reference
Onboarding Users
UI Components
Connection Hooks
In-App Wallets
Ecosystems Wallets
External Wallets
Account Abstraction
Funding wallets
User Identity
UI Components
Sign in with Ethereum
Link Profiles
Web3 Social Identities
Permissions
Export private key
Onchain Interactions
UI Components
Reading State
Transactions
Sponsored Transactions
Chain Abstraction
Advanced
Usage with other libraries

Shared Logins

Migrate from v4
Migrate from RainbowKit
Getting Started
You can get started by creating a new project or adding thirdweb to an existing project.

New Projects
You can quickly create a new project with the thirdweb CLI

npx thirdweb create app

or clone the Next.js or Vite starter repo:

Next.js + thirdweb starter repo
Vite + thirdweb starter repo
Existing Projects
Install the thirdweb packages in your project

npm
yarn
pnpm
npm i thirdweb

Build your app
Setup the ThirdwebProvider
At the root of your application, wrap your app with a ThirdwebProvider component. This keeps state around like the active wallet and chain.

// src/main.tsx
import { ThirdwebProvider } from "thirdweb/react";
 
function Main() {
  return (
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  );
}

Create the thirdweb client
Head to the thirdweb dashboard, create your account (or sign in), and click Projects to see all your projects.

Create a Project with localhost included in the allowed domains. Securely store your secret key and copy your client id for use in the next step.

Create a .env file and add your client ID there. Then create a client.ts file with the following content:

// src/client.ts
import { createThirdwebClient } from "thirdweb";
 
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

You only need to define the client once. Exporting the client variable will allow you to use anywhere in your app.

Connect a wallet
There are two ways to connect users to your app:

The prebuilt ConnectButton or ConnectEmbed components.
Your own custom button.
In this guide, we'll use the prebuilt ConnectButton component.

// src/app.tsx
import { client } from "./client";
import { ConnectButton } from "thirdweb/react";
 
function App() {
  return (
    <div>
      <ConnectButton client={client} />
    </div>
  );
}

The ConnectButton and ConnectEmbed components come with built-in support for 500+ of wallets, 2000+ chains, fiat on-ramping, crypto swapping, transaction tracking, and more.

You can also build your own custom button using the useConnect hook.

Get the connected wallet information
Once the user has connected their wallet, you can get the wallet address, balance, and other details.

import { useActiveAccount, useWalletBalance } from "thirdweb/react";
 
export default function App() {
  const account = useActiveAccount();
  const { data: balance, isLoading } = useWalletBalance({
    client,
    chain,
    address: account.address,
  });
 
  return (
    <div>
      <p>Wallet address: {account.address}</p>
      <p>
        Wallet balance: {balance?.displayValue} {balance?.symbol}
      </p>
    </div>
  );
}

Read blockchain data
You can read contract state with the useReadContract hook. This works with any contract call. Simply specify the solidity function signature to get a type safe API for your contract.

import { client } from "./client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
 
const contract = getContract({
  client,
  address: "0x...",
  chain: sepolia,
});
 
export default function App() {
  const { data, isLoading } = useReadContract({
    contract,
    method: "function tokenURI(uint256 tokenId) returns (string)",
    params: [1n], // type safe params
  });
 
  return (
    <div>
      <p>Token URI: {data}</p>
    </div>
  );
}

Using Extensions you can do powerful queries like getting all the owned NFTs of a specific address, and generate performant typesafe functions for your contract.

import { client } from "./client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
 
const contract = getContract({
  client,
  address: "0x...",
  chain: sepolia,
});
 
export default function App() {
  const { data: ownedNFTs } = useReadContract(getOwnedNFTs, {
    contract,
    address: "0x...",
  });
 
  return (
    <div>
      <p>Owned NFTs: {ownedNFTs}</p>
    </div>
  );
}

Execute transactions
You can execute transactions with the useSendTransaction hook. Prepare a transaction with the prepareContractCall function and pass it to the sendTransaction function.

import { client } from "./client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
 
const contract = getContract({
  client,
  address: "0x...",
  chain: sepolia,
});
 
export default function App() {
  const { mutate: sendTransaction } = useSendTransaction();
 
  const onClick = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function mint(address to)",
      params: ["0x..."], // type safe params
    });
    sendTransaction(transaction);
  };
 
  return (
    <div>
      <button onClick={onClick}>Mint</button>
    </div>
  );
}

Using Extensions you can do more complex transactions like a claim, batch mint, and more. These will handle all the preprocessing needed before calling the contract.

import { client } from "./client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
import { mintTo } from "thirdweb/extensions/erc721";
 
const contract = getContract({
  client,
  address: "0x...",
  chain: sepolia,
});
 
export default function App() {
  const { mutate: sendTransaction } = useSendTransaction();
 
  const onClick = async () => {
    // this mint extension handles uploading metadata to IPFS and pining it
    const transaction = mintTo({
      contract,
      to: "0x...",
      nft: {
        name: "NFT Name",
        description: "NFT Description",
        image: "https://example.com/image.png",
      },
    });
    sendTransaction(transaction);
  };
 
  return (
    <div>
      <button onClick={onClick}>Mint</button>
    </div>
  );
}

Learn more
You now have all the basics to build your own app with thirdweb. You can also check out the full thirdweb SDK reference to learn more about the different hooks and functions available.

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
New Projects
Existing Projects
Build your app
Setup the ThirdwebProvider
Create the thirdweb client
Connect a wallet
Get the connected wallet information
Read blockchain data
Execute transactions
Learn more
thirdweb React SDK