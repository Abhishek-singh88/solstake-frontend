
# Solversity

Solversity is a comprehensive DeFi education platform built on Solana devnet that combines staking rewards, interactive learning modules, and NFT collections. Users can stake SOL tokens, complete educational quizzes about blockchain and DeFi concepts, and earn exclusive NFTs as rewards.

**Live Demo**: https://solversity.vercel.app

**NOTE** : This project is built for learning purpose only.


## ✨ Features

- 📈 SOL staking with up to 5% APY on Solana devnet
- 📚 Interactive educational modules covering DeFi and blockchain topics
- 🎯 Quiz-based learning system with progress tracking
- 🏆 NFT rewards minted on completion of educational modules
- 💎 Token rewards for quiz completions
- ⚡ Real-time staking rewards tracking


## Anchor code

**Staking** : [https://github.com/Abhishek-singh88/solstake](https://github.com/Abhishek-singh88/solstake)

**Learn & earn** : [https://github.com/Abhishek-singh88/learning-nft](https://github.com/Abhishek-singh88/learning-nft)


## 📖 How It Works

**Staking**

Users can connect their Solana wallet and stake SOL tokens on the devnet. The platform calculates and distributes rewards automatically based on the configured APY.

**Learning Modules**

The platform offers interactive educational content covering:

- DeFi fundamentals
- Solana blockchain architecture
- Smart contract interactions
- Yield farming strategies
- Risk management in DeFi

**Quiz System**

Users must complete quizzes to demonstrate understanding of each module. Quiz completion is verified before rewards are distributed.

**NFT Rewards**

Upon successful completion of educational modules and quizzes, users receive exclusive NFTs minted on Solana devnet as proof of their learning achievements.

## Project Structure

```bash
Solversity/
├── public/
├── src/
│ ├── app/
│ │ ├── components/
| | | └── ClaimNFTModal.tsx
| | | ├── Footer.tsx
| | | ├── LessonCard.tsx
| | | ├── LessonModal.tsx
| | | ├── NavBar.tsx
| | | ├── SolanaProvider.tsx
| | ├── learn/
| | | └── layout.tsx
| | | ├── page.tsx
| | ├── staking/
| | | └── page.tsx
| | ├── ClientLayout.tsx
| | ├── favicon.ico
| | ├── global.css
| | ├── layout.tsx
| | ├── page.tsx
│ ├── data/
│ │ └── lessons.ts
│ ├── hooks/
│ │ └── useProgram.ts
| | ├── useUserProgress.ts
│ ├── lib/
│ │ └── idl/
| |   └── nft.json
| |   ├── solstake.json
│ ├── types/
|     └── lesson.ts
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss-config.mjs
├── README.md
└── tsconfig.json
```

## Getting Started

**Prerequisites**

- Node.js 18 or higher
- npm, yarn, or pnpm
- Solana CLI
- Anchor CLI
- Solana wallet (Phantom, Solflare, etc.) configured for devnet

**Installation**

Clone the repository:

```bash
git clone https://github.com/abhishek-singh88/solversity.git
cd solversity
```

Install dependencies:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

**Note :** Make sure to check Anchor code(given below) before contributing to this project
```bash
https://github.com/Abhishek-singh88/solstake
#And
https://github.com/Abhishek-singh88/learning-nft
```
