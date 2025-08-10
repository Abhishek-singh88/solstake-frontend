'use client'

import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import idlData from '../lib/idl/solstake.json'
import ClientLayout from './ClientLayout'

const PROGRAM_ID = new PublicKey('DavPb8xssP9AcbaJkQRBFnU132oX1t5nevLxqJXQpCAJ')

function StakingApp() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { publicKey } = wallet
  
  const [balance, setBalance] = useState<number>(0)
  const [stakeAmount, setStakeAmount] = useState<string>('')
  const [unstakeAmount, setUnstakeAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)

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

      const userStakeAccount = await program.account.userStake.fetchNullable(userStakeAddress)

      if (userStakeAccount) {
        const poolAddress = getPoolAddress()
        const poolAccount = await program.account.pool.fetch(poolAddress)
        
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

      const userStakeAccount = await program.account.userStake.fetchNullable(userStakeAddress)
      
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
      alert('Successfully staked SOL!')
    } catch (error) {
      console.error('Error staking SOL:', error)
      alert('Error staking SOL: ' + error)
    }
    setLoading(false)
  }

  const initializePool = async () => {
  const program = getProgram()
  if (!program || !publicKey) return

  setLoading(true)
  try {
    const poolAddress = getPoolAddress()
    const vaultAddress = getVaultAddress()

    // Check if pool is already initialized
    const poolAccount = await program.account.pool.fetchNullable(poolAddress)
    if (poolAccount) {
      alert('Pool is already initialized!')
      setLoading(false)
      return
    }

    const signature = await program.methods
      .initializePool()
      .accounts({
        pool: poolAddress,
        vault: vaultAddress,
        authority: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    await connection.confirmTransaction(signature, 'confirmed')
    alert('Pool initialized successfully!')
  } catch (error) {
    console.error('Error initializing pool:', error)
    alert('Error initializing pool: ' + error)
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
      alert('Successfully unstaked SOL!')
    } catch (error) {
      console.error('Error unstaking SOL:', error)
      alert('Error unstaking SOL: ' + error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">SOL Staking DApp</h1>
        
        <div className="mb-6">
          <WalletMultiButton className="w-full" />
        </div>

        {publicKey && (
          <>
            {/* Add this new section for pool initialization */}
    <div className="mb-4">
      <button
        onClick={initializePool}
        disabled={loading}
        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Initialize Pool (Run Once)'}
      </button>
    </div>
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h2 className="text-lg font-semibold mb-2">Your Stake Info</h2>
              <p className="text-sm text-gray-600">Current Balance: {balance.toFixed(4)} SOL</p>
              <p className="text-sm text-gray-600">Interest Rate: 5% APY</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Stake SOL</label>
              <input
                type="number"
                step="0.1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Amount in SOL"
              />
              <button
                onClick={stakeSol}
                disabled={loading || !stakeAmount}
                className="w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Stake SOL'}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unstake SOL</label>
              <input
                type="number"
                step="0.1"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Amount in SOL"
              />
              <button
                onClick={unstakeSol}
                disabled={loading || !unstakeAmount || balance === 0}
                className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Unstake SOL'}
              </button>
            </div>

            <button
              onClick={fetchUserStakeInfo}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Refresh Balance
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ClientLayout>
      <StakingApp />
    </ClientLayout>
  )
}
