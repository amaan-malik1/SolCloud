import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  type Cluster,
} from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export function getConnection(): Connection {
  return new Connection("https://api.devnet.solana.com", "confirmed");
}

export interface SendPaymentParams {
  wallet: WalletContextState;
  platformAddress: string;
  solAmount: number;
  userId: string;
}

export async function sendPayment({
  wallet,
  platformAddress,
  solAmount,
  userId,
}: SendPaymentParams): Promise<{ signature: string; solAmount: number }> {
  if (!wallet.publicKey || !wallet.signTransaction)
    throw new Error("Wallet not connected");
  const connection = getConnection();
  const toPubkey = new PublicKey(platformAddress);
  const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);
  const memo = `solstore:${userId}:v1`;
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey,
      lamports,
    }),
  );
  tx.add(
    new TransactionInstruction({
      keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: false }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memo, "utf8"),
    }),
  );
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;
  const signed = await wallet.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });
  return { signature, solAmount };
}

export async function getWalletBalance(address: string): Promise<number> {
  const lamports = await getConnection().getBalance(new PublicKey(address));
  return lamports / LAMPORTS_PER_SOL;
}
