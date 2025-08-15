import { Lesson } from '@/types/lesson';

export const LESSONS: Lesson[] = [
  {
    id: 0,
    title: 'What is Solana?',
    description: 'Learn the basics of Solana blockchain.',
    content:
      'Solana is a high-performance blockchain that supports fast, secure, and decentralized applications...',
    questions: [
      {
        question: 'What makes Solana unique?',
        options: ['High speed', 'Low fees', 'Both', 'Neither'],
        correct: 2,
      },
      // more questions…
    ],
    nftMetadata: {
      name: 'Solana Basics Badge',
      symbol: 'SBB',
      uri: 'https://your-metadata-uri.com/lesson-0.json',
    },
  },
  {
    id: 1,
    title: 'How Staking Works',
    description: 'Understand Solana’s Proof-of-Stake.',
    content:
      'Staking in Solana allows you to earn rewards by delegating your SOL to validators...',
    questions: [
      {
        question: 'What is the purpose of staking?',
        options: ['Security', 'Rewards', 'Both', 'Neither'],
        correct: 2,
      },
    ],
    nftMetadata: {
      name: 'Staking Expert Badge',
      symbol: 'SEB',
      uri: 'https://your-metadata-uri.com/lesson-1.json',
    },
  },
  {
    id: 2,
    title: 'Who are you?',
    description: 'meow.',
    content:
      'meow meow...',
    questions: [
      {
        question: 'your name?',
        options: ['a', 'b', 'c', 'abhi'],
        correct: 3,
      },
      // more questions…
    ],
    nftMetadata: {
      name: 'Solana Basics Badge',
      symbol: 'SBB',
      uri: 'https://your-metadata-uri.com/lesson-3.json',
    },
  },
  // …add the remaining three lessons
];
