'use client'

import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import { Coins, TrendingUp, RefreshCw, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, X } from 'lucide-react'
import idlData from '../../lib/idl/solstake.json'
import ClientLayout from '../ClientLayout'

const PROGRAM_ID = new PublicKey('DavPb8xssP9AcbaJkQRBFnU132oX1t5nevLxqJXQpCAJ')

// Toast Component
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
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function StakingApp() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { publicKey } = wallet
  
  const [balance, setBalance] = useState<number>(0)
  const [stakeAmount, setStakeAmount] = useState<string>('')
  const [unstakeAmount, setUnstakeAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const getProgram = () => {
    if (!wallet.publicKey || !wallet.signTransaction) return null
    
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    )
    
    // Fix: Use only 2 parameters - idl and provider
    return new Program(idlData as any, provider)
  }

  const getUserStakeAddress = () => {
    if (!publicKey) return null
    const [userStakeAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from('stake'), publicKey.toBuffer()],
      PROGRAM_ID
    )
    return userStakeAddress
  }

  const getPoolAddress = () => {
    const [poolAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from('pool')],
      PROGRAM_ID
    )
    return poolAddress
  }

  const getVaultAddress = () => {
    const [vaultAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      PROGRAM_ID
    )
    return vaultAddress
  }

  const fetchUserStakeInfo = async () => {
    const program = getProgram()
    if (!program || !publicKey) return

    try {
      const userStakeAddress = getUserStakeAddress()
      if (!userStakeAddress) return

      const userStakeAccount = await (program.account as any).userStake.fetchNullable(userStakeAddress)

      if (userStakeAccount) {
        const poolAddress = getPoolAddress()
        const poolAccount = await (program.account as any).pool.fetch(poolAddress)
        
        const currentTime = Math.floor(Date.now() / 1000)
        const timeStaked = currentTime - userStakeAccount.stakeTime.toNumber()
        const principal = userStakeAccount.amountStaked.toNumber()
        const rate = poolAccount.interestRate.toNumber()
        
        const secondsPerYear = 365 * 24 * 60 * 60
        const interest = Math.floor((principal * rate * timeStaked) / (10000 * secondsPerYear))
        const totalBalance = (principal + interest) / LAMPORTS_PER_SOL
        
        setBalance(totalBalance)
      } else {
        setBalance(0)
      }
    } catch (error) {
      console.error('Error fetching user stake info:', error)
      setBalance(0)
    }
  }

  useEffect(() => {
    if (publicKey) {
      fetchUserStakeInfo()
    }
  }, [publicKey])

  const stakeSol = async () => {
    const program = getProgram()
    if (!program || !publicKey || !stakeAmount) return

    setLoading(true)
    try {
      const amount = new BN(parseFloat(stakeAmount) * LAMPORTS_PER_SOL)
      const userStakeAddress = getUserStakeAddress()
      const poolAddress = getPoolAddress()
      const vaultAddress = getVaultAddress()

      if (!userStakeAddress) return

      const userStakeAccount = await (program.account as any).userStake.fetchNullable(userStakeAddress)
      
      let signature
      if (userStakeAccount) {
        signature = await program.methods
          .stakeMoreSol(amount)
          .accounts({
            userStake: userStakeAddress,
            pool: poolAddress,
            vault: vaultAddress,
            user: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
      } else {
        signature = await program.methods
          .stakeSol(amount)
          .accounts({
            userStake: userStakeAddress,
            pool: poolAddress,
            vault: vaultAddress,
            user: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
      }

      await connection.confirmTransaction(signature, 'confirmed')
      
      setStakeAmount('')
      await fetchUserStakeInfo()
      showToast('Successfully staked SOL!', 'success')
    } catch (error) {
      console.error('Error staking SOL:', error)
      showToast('Error staking SOL: ' + error, 'error')
    }
    setLoading(false)
  }

  const unstakeSol = async () => {
    const program = getProgram()
    if (!program || !publicKey || !unstakeAmount) return

    setLoading(true)
    try {
      const amount = new BN(parseFloat(unstakeAmount) * LAMPORTS_PER_SOL)
      const userStakeAddress = getUserStakeAddress()
      const poolAddress = getPoolAddress()
      const vaultAddress = getVaultAddress()

      if (!userStakeAddress) return

      const signature = await program.methods
        .unstakeSol(amount)
        .accounts({
          userStake: userStakeAddress,
          pool: poolAddress,
          vault: vaultAddress,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      await connection.confirmTransaction(signature, 'confirmed')
      
      setUnstakeAmount('')
      await fetchUserStakeInfo()
      showToast('Successfully unstaked SOL!', 'success')
    } catch (error) {
      console.error('Error unstaking SOL:', error)
      showToast('Error unstaking SOL: ' + error, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 pt-20 px-4 pb-8">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-rose-500/15 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-emerald-400 font-medium text-sm">Live on Solana Devnet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-emerald-400">Stake</span> Your SOL
          </h1>
          <p className="text-xl text-gray-300">Earn rewards while securing the network</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden">
          {/* Gradient top border */}
          <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"></div>
          
          <div className="p-8">
            {/* Wallet Connection */}
            <div className="mb-8">
              <WalletMultiButton className="!bg-gradient-to-r !from-emerald-500 !to-teal-600 hover:!from-emerald-600 hover:!to-teal-700 !rounded-xl !font-semibold !transition-all !duration-200 !w-full !py-3" />
            </div>

            {publicKey && (
              <>
                {/* Balance Info */}
                <div className="mb-8 p-6 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Coins className="w-6 h-6 mr-2 text-emerald-400" />
                      Your Stake Info
                    </h2>
                    <div className="flex items-center text-emerald-400">
                      <TrendingUp className="w-5 h-5 mr-1" />
                      <span className="font-medium">5% APY</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{balance.toFixed(4)} SOL</div>
                    <div className="text-gray-400">Current Staked Balance</div>
                  </div>
                </div>

                {/* Stake Section */}
                <div className="mb-6">
                  <label className="block text-lg font-medium text-white mb-3 flex items-center">
                    <ArrowUpRight className="w-5 h-5 mr-2 text-emerald-400" />
                    Stake SOL
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Amount in SOL"
                  />
                  <button
                    onClick={stakeSol}
                    disabled={loading || !stakeAmount}
                    className="cursor-pointer w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className=" flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Stake SOL'
                    )}
                  </button>
                </div>

                {/* Unstake Section */}
                <div className="mb-6">
                  <label className="block text-lg font-medium text-white mb-3 flex items-center">
                    <ArrowDownLeft className="w-5 h-5 mr-2 text-amber-400" />
                    Unstake SOL
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Amount in SOL"
                  />
                  <button
                    onClick={unstakeSol}
                    disabled={loading || !unstakeAmount || balance === 0}
                    className="cursor-pointer w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Unstake SOL'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Cards with bottom margin */}
        {publicKey && (
          <div className="grid md:grid-cols-3 gap-6 mt-8 mb-20">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-semibold text-white mb-1">5% APY</div>
              <div className="text-gray-400 text-sm">Annual Yield</div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-semibold text-white mb-1">Auto Compound</div>
              <div className="text-gray-400 text-sm">Rewards</div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-semibold text-white mb-1">Flexible</div>
              <div className="text-gray-400 text-sm">Unstaking</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Staking() {
  return (
    <ClientLayout>
      <StakingApp />
    </ClientLayout>
  )
}
