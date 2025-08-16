'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, TrendingUp, Award, Shield, Users, ArrowRight, Star, Coins, BookOpen } from 'lucide-react';
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAPY] = useState(5);
  const router = useRouter();
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Stake SOL",
      description: "Stake your SOL tokens on devnet and earn competitive APY rewards",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Earn Rewards",
      description: "Get up to 5% APY on your staked SOL tokens automatically",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Collect NFTs",
      description: "Learn about DeFi and blockchain to earn exclusive NFT rewards",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learn & Earn",
      description: "Complete educational modules and earn tokens plus knowledge",
      color: "from-rose-500 to-pink-600"
    }
  ];
  const stats = [
    { label: "Total Value Locked", value: "$2.4M", icon: <Shield /> },
    { label: "Active Stakers", value: "1,250+", icon: <Users /> },
    { label: "NFTs Distributed", value: "890", icon: <Award /> },
    { label: "Current APY", value: `${currentAPY}%`, icon: <TrendingUp /> }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-2 mb-8">
              <span className="text-emerald-400 font-medium text-sm">🚀 Now Live on Solana Devnet</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stake SOL,
              <span className="block bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                Learn & Earn NFTs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              The ultimate Solana staking platform where you earn rewards, gain knowledge, 
              and collect exclusive NFTs. Start your DeFi journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/staking')}
                className="cursor-pointer group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center"
              >
                Start Staking
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-200 flex items-center"
              >
                Learn & Earn
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="relative z-10 -mt-16 mb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50 hover:bg-gray-700/40 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-emerald-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-emerald-400">Solversity</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of DeFi with our comprehensive platform that combines staking, learning, and NFT rewards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* APY Highlight Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-700/50 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-4 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Earn up to <span className="text-emerald-400">{currentAPY}% APY</span>
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Stake your SOL on our devnet platform and watch your rewards grow automatically
              </p>
              <button
                onClick={() => router.push('/staking')}
                className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                Start Earning Now
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Learning Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                Learn While You <span className="text-amber-400">Earn</span>
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Complete interactive lessons about DeFi, blockchain technology, and Solana ecosystem. 
                Each completed module rewards you with tokens and exclusive NFTs.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4 shadow-lg shadow-emerald-400/50"></div>
                  Interactive DeFi tutorials
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-3 h-3 bg-amber-400 rounded-full mr-4 shadow-lg shadow-amber-400/50"></div>
                  Solana blockchain deep dives
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-3 h-3 bg-rose-400 rounded-full mr-4 shadow-lg shadow-rose-400/50"></div>
                  Exclusive NFT rewards
                </li>
              </ul>
              <button
                onClick={() => router.push('/learn')}
                className="cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700/50 hover:border-emerald-500/30 transition-all duration-200"
              >
                Explore Learning Hub
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { gradient: "from-emerald-500 to-teal-600" },
                    { gradient: "from-amber-500 to-orange-600" },
                    { gradient: "from-indigo-500 to-purple-600" },
                    { gradient: "from-rose-500 to-pink-600" }
                  ].map((nft, i) => (
                    <div key={i} className="bg-gray-700/30 rounded-xl p-4 text-center border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200">
                      <div className={`w-12 h-12 bg-gradient-to-r ${nft.gradient} rounded-lg mx-auto mb-3 flex items-center justify-center shadow-lg`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white font-medium text-sm">NFT #{i + 1}</div>
                      <div className="text-gray-400 text-xs mt-1">Earned</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/50">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-emerald-400">DeFi Journey</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already earning rewards and collecting NFTs on Solversity
            </p>
            <button
              onClick={() => router.push('/learn')}
              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 text-lg shadow-lg hover:shadow-emerald-500/25"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}