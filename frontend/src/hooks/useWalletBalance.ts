import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getWalletBalance } from "../lib/payment";

export function useWalletBalance() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const bal = await getWalletBalance(publicKey.toBase58());
        if (!cancelled) setBalance(bal);
      } catch {
        if (!cancelled) setBalance(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connected, publicKey]);

  return { balance, loading };
}
