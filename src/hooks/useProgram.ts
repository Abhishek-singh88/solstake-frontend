import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useMemo } from 'react';

// Import your IDL JSON
import idl from '../lib/idl/nft.json';

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey || !connection) {
      return null;
    }

    try {
      return new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
    } catch (error) {
      console.error('Error creating provider:', error);
      return null;
    }
  }, [connection, wallet, wallet?.publicKey]);

  const program = useMemo(() => {
    if (!provider || !idl) {
      return null;
    }

    try {
      // New constructor signature - only idl and provider
      return new Program(idl as Idl, provider);
    } catch (error) {
      console.error('Error creating anchor Program:', error);
      return null;
    }
  }, [provider]);

  return { 
    program, 
    provider,
    isReady: !!(program && provider && wallet?.connected)
  };
}
