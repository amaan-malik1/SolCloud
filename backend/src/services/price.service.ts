import axios from "axios";

interface PriceCache {
  usd: number;
  fetchedAt: number;
}
let cache: PriceCache | null = null;
const CACHE_TTL_MS = 60_000;

export async function getSolPriceUsd(): Promise<number> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.usd;

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids: "solana", vs_currencies: "usd" },
        timeout: 5000,
      },
    );
    const price = res.data?.solana?.usd;
    if (!price || typeof price !== "number")
      throw new Error("Invalid price response");
    cache = { usd: price, fetchedAt: now };
    console.log(`SOL price updated: $${price}`);
    return price;
  } catch (err) {
    if (cache) {
      console.warn("Price fetch failed, using stale cache:", cache.usd);
      return cache.usd;
    }
    // Return a fallback price so the indexer keeps working
    console.warn("Price fetch failed, using fallback $150");
    return 80;
  }
}

export async function solToUsd(
  solAmount: number,
): Promise<{ usdAmount: number; solPriceUsd: number }> {
  const solPriceUsd = await getSolPriceUsd();
  const usdAmount = parseFloat((solAmount * solPriceUsd).toFixed(6));
  return { usdAmount, solPriceUsd };
}
