import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import { config } from "../config";
import { getConnection } from "./solana.connection";

let _platformKeypair: Keypair | null = null;

export function getPlatformKeypair(): Keypair {
  if (_platformKeypair) return _platformKeypair;
  if (!config.solana.platformWalletPrivateKey) {
    throw new Error("PLATFORM_WALLET_PRIVATE_KEY not set");
  }
  const secretKey = bs58.decode(config.solana.platformWalletPrivateKey);
  _platformKeypair = Keypair.fromSecretKey(secretKey);
  return _platformKeypair;
}

export function getPlatformAddress(): string {
  return config.solana.platformWalletAddress ?? "";
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getSolBalance(address: string): Promise<number> {
  const lamports = await getConnection().getBalance(new PublicKey(address));
  return lamports / LAMPORTS_PER_SOL;
}

export async function getPlatformBalance(): Promise<number> {
  return getSolBalance(getPlatformAddress());
}
