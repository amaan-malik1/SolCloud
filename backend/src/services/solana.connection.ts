import { Connection } from "@solana/web3.js";
import { config } from "../config";

function getRpcEndpoints(): string[] {
  const endpoints: string[] = [];

  if (process.env.HELIUS_RPC_URL) {
    endpoints.push(process.env.HELIUS_RPC_URL);
  }

  if (config.solana.network === "mainnet-beta") {
    endpoints.push(
      "https://api.mainnet-beta.solana.com",
      "https://rpc.ankr.com/solana"
    );
  } else {
    endpoints.push("https://api.devnet.solana.com");
  }

  return endpoints;
}

const RPC_ENDPOINTS = getRpcEndpoints();

let _connection: Connection | null = null;
let _currentRpcIndex = 0;

function buildConnection(): Connection {
  const endpoint = RPC_ENDPOINTS[_currentRpcIndex];
  const label = endpoint.includes("helius") ? "Helius" : endpoint.includes("ankr") ? "Ankr" : "public RPC";
  console.log(`🔗 Solana connected to ${config.solana.network} via ${label}`);
  return new Connection(endpoint, { commitment: "confirmed" });
}

export function getConnection(): Connection {
  if (_connection) return _connection;
  _connection = buildConnection();
  return _connection;
}

export function rotateConnection(): Connection {
  _currentRpcIndex = (_currentRpcIndex + 1) % RPC_ENDPOINTS.length;
  console.warn(`[solana] Rotating to next RPC endpoint (index ${_currentRpcIndex})`);
  _connection = buildConnection();
  return _connection;
}

export async function checkSolanaConnection(): Promise<boolean> {
  try {
    const slot = await getConnection().getSlot();
    console.log(`✅ Solana slot: ${slot}`);
    return true;
  } catch (err) {
    console.error("❌ Solana connection failed:", err);
    return false;
  }
}