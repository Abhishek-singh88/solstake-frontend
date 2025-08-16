"use client";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { LESSONS } from '@/data/lessons';          
import { LessonCard } from '../components/LessonCard';
import { LessonModal } from '../components/LessonModal';
import { ClaimNFTModal } from '../components/ClaimNFTModal';
import { useState } from 'react';
import { BookOpen, Award, Star, TrendingUp, Users, Brain } from 'lucide-react';


import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-22 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-lg border w-80 ${
        type === 'success' 
          ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100' 
          : 'bg-red-900/80 border-red-500/50 text-red-100'
      }`}>
        <div className="flex items-center">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 mr-3 text-red-400" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const { connected } = useWallet();
  const { userProgress, loading, initializeUser, completeLesson, refetch } = useUserProgress();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [showClaimModal, setShowClaimModal] = useState<number | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const completedCount = userProgress ? userProgress.completedLessons.filter(Boolean).length : 0;
  const nftCount = userProgress ? userProgress.nftsClaimed.filter(Boolean).length : 0;

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
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

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Learn & Earn
              <span className="block bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
                NFT Badges
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Complete interactive lessons about Solana and DeFi to earn exclusive NFT badges. 
              Connect your wallet to start your learning journey!
            </p>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
              <WalletMultiButton className="!bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white !px-8 !py-4 !rounded-xl !font-semibold hover:!from-emerald-600 hover:!to-teal-700 !transition-all !duration-200 !transform hover:!scale-105" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-white font-semibold">5 Lessons</div>
                <div className="text-gray-400 text-sm">Available</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-white font-semibold">5 NFTs</div>
                <div className="text-gray-400 text-sm">To Collect</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Free</div>
                <div className="text-gray-400 text-sm">Learning</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <Star className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Rewards</div>
                <div className="text-gray-400 text-sm">On Chain</div>
              </div>
            </div>
          </div>
        </div>

        {/*Toast mount */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your progress...</p>
        </div>

        {/* Toast mount */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // User needs initialization
  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/50">
              <div className="bg-gradient-to-r from-emerald-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-lg">
                <BookOpen className="w-12 h-12 text-white mx-auto" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Welcome to Learn & Earn!
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Initialize your learning journey to start earning NFT badges. 
                Complete lessons and collect exclusive rewards on Solana!
              </p>
              
              <button
                onClick={initializeUser}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Initializing...' : 'Start Learning Journey'}
              </button>
            </div>
          </div>
        </div>

        {/* Toast mount */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // Main app state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
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

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-2 mb-6">
              <span className="text-emerald-400 font-medium text-sm">📚 Learning Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Learn & Earn
              <span className="block bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
                NFT Badges
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Complete interactive lessons and earn exclusive NFT badges on Solana blockchain
            </p>

            <div className="flex justify-center mb-8">
              <WalletMultiButton className="!bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white !px-6 !py-3 !rounded-xl !font-semibold hover:!from-emerald-600 hover:!to-teal-700 !transition-all !duration-200" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50 hover:bg-gray-700/40 hover:border-emerald-500/30 transition-all duration-300">
              <BookOpen className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{completedCount}/5</div>
              <div className="text-gray-400 text-sm">Lessons Completed</div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50 hover:bg-gray-700/40 hover:border-amber-500/30 transition-all duration-300">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{nftCount}</div>
              <div className="text-gray-400 text-sm">NFTs Collected</div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50 hover:bg-gray-700/40 hover:border-purple-500/30 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{Math.round((completedCount / 5) * 100)}%</div>
              <div className="text-gray-400 text-sm">Progress</div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-700/50 hover:bg-gray-700/40 hover:border-rose-500/30 transition-all duration-300">
              <Users className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">1,250+</div>
              <div className="text-gray-400 text-sm">Active Learners</div>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Available <span className="text-emerald-400">Lessons</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LESSONS.map((lesson) => {
                const isCompleted = userProgress.completedLessons[lesson.id];
                const isNftClaimed = userProgress.nftsClaimed[lesson.id];
                
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={isCompleted}
                    isNftClaimed={isNftClaimed}
                    onStartLesson={() => setSelectedLesson(lesson.id)}
                    onClaimNFT={() => setShowClaimModal(lesson.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedLesson !== null && (
          <LessonModal
            lesson={LESSONS[selectedLesson]}
            onClose={() => setSelectedLesson(null)}
            onComplete={() => {
              completeLesson(selectedLesson);
              setSelectedLesson(null);
            
              setToast({ message: 'Lesson completed successfully!', type: 'success' });
            }}
          />
        )}

        {showClaimModal !== null && (
          <ClaimNFTModal
            lesson={LESSONS[showClaimModal]}
            onClose={() => setShowClaimModal(null)}
            onClaimed={() => {
              setShowClaimModal(null);
              refetch();
              
              setToast({ message: 'NFT claimed successfully!', type: 'success' });
            }}
          />
        )}

       
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
