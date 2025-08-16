import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from './useProgram';
import { useState, useEffect, useCallback } from 'react';

export interface UserProgress {
  user: PublicKey;
  completedLessons: boolean[];
  nftsClaimed: boolean[];
}

export function useUserProgress() {
  const { publicKey } = useWallet();
  const { program } = useProgram();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const getUserProgressPDA = useCallback(async () => {
    if (!publicKey || !program) return null;
    
    const [userProgressPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_progress"), publicKey.toBuffer()],
      program.programId
    );
    
    return userProgressPDA;
  }, [publicKey, program]);

  const fetchUserProgress = useCallback(async () => {
    if (!program || !publicKey) return;
    
    setLoading(true);
    try {
      const userProgressPDA = await getUserProgressPDA();
      if (!userProgressPDA) return;
      
      const account = await (program.account as any).userProgress.fetch(userProgressPDA);
      setUserProgress(account as UserProgress);
    } catch (error) {
      console.log('User progress not found, needs initialization');
      setUserProgress(null);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getUserProgressPDA]);

  const initializeUser = useCallback(async () => {
    if (!program || !publicKey) return;
    
    setLoading(true);
    try {
      const userProgressPDA = await getUserProgressPDA();
      if (!userProgressPDA) return;
      
      await program.methods.initializeUser()
        .accounts({
          userProgress: userProgressPDA,
          user: publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();
      
      await fetchUserProgress();
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getUserProgressPDA, fetchUserProgress]);

  const completeLesson = useCallback(async (lessonId: number) => {
    if (!program || !publicKey) return;
    
    setLoading(true);
    try {
      const userProgressPDA = await getUserProgressPDA();
      if (!userProgressPDA) return;
      
      await program.methods.completeLesson(lessonId)
        .accounts({
          userProgress: userProgressPDA,
          user: publicKey,
        })
        .rpc();
      
      await fetchUserProgress();
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getUserProgressPDA, fetchUserProgress]);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    userProgress,
    loading,
    initializeUser,
    completeLesson,
    getUserProgressPDA,
    refetch: fetchUserProgress
  };
}
