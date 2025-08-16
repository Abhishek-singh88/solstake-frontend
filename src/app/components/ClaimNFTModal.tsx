import { useState } from 'react';
import { useProgram } from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface ClaimNFTModalProps {
  lesson: {
    id: number;
    title: string;
    nftMetadata: {
      name: string;
      symbol: string;
      uri: string;
    };
  };
  onClose: () => void;
  onClaimed: () => void;
}

export function ClaimNFTModal({ lesson, onClose, onClaimed }: ClaimNFTModalProps) {
  const [claiming, setClaiming] = useState(false);
  const { program } = useProgram();
  const { publicKey } = useWallet();

  const claimNFT = async () => {
    if (!program || !publicKey) return;
    
    setClaiming(true);
    try {
      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      
      // Find user progress PDA
      const [userProgressPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_progress"), publicKey.toBuffer()],
        program.programId
      );
      
      // Find associated token account
      const [tokenAccount] = PublicKey.findProgramAddressSync(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      // Find metadata account
      const [metadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      );

      await program.methods
        .mintNftReward(
          lesson.id,
          lesson.nftMetadata.uri,
          lesson.nftMetadata.name,
          lesson.nftMetadata.symbol
        )
        .accounts({
          userProgress: userProgressPDA,
          mint: mintKeypair.publicKey,
          tokenAccount: tokenAccount,
          metadata: metadata,
          user: publicKey,
          payer: publicKey,
          mintAuthority: publicKey, // You might want to use a different authority
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        })
        .signers([mintKeypair])
        .rpc();

      onClaimed();
      
    } catch (error) {
      console.error('Error claiming NFT:', error);
     
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Claim Your NFT Badge</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-4xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{lesson.nftMetadata.name}</h3>
          <p className="text-gray-600">
            Congratulations on completing "{lesson.title}"! 
            Claim your exclusive NFT badge as proof of your achievement.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Later
          </button>
          <button
            onClick={claimNFT}
            disabled={claiming}
            className="cursor-pointer flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {claiming ? 'Claiming...' : 'Claim NFT'}
          </button>
        </div>

        {claiming && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              Minting your NFT badge on Solana...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
