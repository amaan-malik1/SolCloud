import axios from 'axios'

const CACHE_TTL_MS = 60_000 // 60 seconds — protects against rate limits
const FALLBACK_PRICE_USD = 150 // last-resort only, logged loudly when used

let _cachedPrice: number | null = null
let _cachedAt = 0

async function fetchCoinGecko(): Promise<number> {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    { timeout: 5000 }
  )
  const price = res.data?.solana?.usd
  if (typeof price !== 'number' || price <= 0) throw new Error('Invalid CoinGecko response')
  return price
}

async function fetchBinance(): Promise<number> {
  const res = await axios.get(
    'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
    { timeout: 5000 }
  )
  const price = parseFloat(res.data?.price)
  if (isNaN(price) || price <= 0) throw new Error('Invalid Binance response')
  return price
}

/**
 * Returns current SOL/USD price with 60s caching.
 * Tries CoinGecko first, falls back to Binance, then to a hardcoded
 * fallback as an absolute last resort (logged as a warning so billing
 * inaccuracies are visible in logs).
 */
export async function getSolPriceUsd(): Promise<number> {
  const now = Date.now()
  if (_cachedPrice !== null && now - _cachedAt < CACHE_TTL_MS) {
    return _cachedPrice
  }

  // Race both sources — use whichever responds first successfully
  try {
    const price = await Promise.any([fetchCoinGecko(), fetchBinance()])
    _cachedPrice = price
    _cachedAt = now
    return price
  } catch {
    // Both failed
    console.warn(
      `[price] ⚠️  Both CoinGecko and Binance failed — using fallback price $${FALLBACK_PRICE_USD}. ` +
      `Billing accuracy may be affected until price sources recover.`
    )

    // If we have a stale cached price, prefer that over the hardcoded fallback
    if (_cachedPrice !== null) {
      console.warn(`[price] Using stale cached price: $${_cachedPrice} (age: ${Math.round((now - _cachedAt) / 1000)}s)`)
      return _cachedPrice
    }

    return FALLBACK_PRICE_USD
  }
}

/**
 * Force-refresh the price cache. Useful for manual/admin price checks.
 */
export async function refreshSolPrice(): Promise<number> {
  _cachedPrice = null
  return getSolPriceUsd()
}