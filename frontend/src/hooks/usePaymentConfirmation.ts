import { useState, useRef, useCallback } from "react";
import { storageApi } from "../api/storage.api";

type ConfirmationStatus = "idle" | "waiting" | "confirmed" | "timeout";

export function usePaymentConfirmation() {
  const [status, setStatus] = useState<ConfirmationStatus>("idle");
  const [creditedUsd, setCreditedUsd] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const previousBalanceRef = useRef<number>(0); // ← store in ref not closure

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    async (previousBalance: number) => {
      setStatus("waiting");
      startTimeRef.current = Date.now();
      previousBalanceRef.current = previousBalance; // save in ref

      console.log("[polling] Starting — previous balance:", previousBalance);

      pollingRef.current = setInterval(async () => {
        // 2 min timeout
        if (Date.now() - startTimeRef.current > 120_000) {
          stopPolling();
          setStatus("timeout");
          return;
        }

        try {
          const data = await storageApi.getBalance();
          const newBalance = data.amountUsd;
          const prev = previousBalanceRef.current;

          console.log("[polling] Balance check:", {
            prev,
            newBalance,
            diff: newBalance - prev,
          });

          // Confirmed if balance increased by at least $0.01
          if (newBalance > prev + 0.01) {
            stopPolling();
            setCreditedUsd(parseFloat((newBalance - prev).toFixed(4)));
            setStatus("confirmed");
          }
        } catch (err) {
          console.error("[polling] Error:", err);
        }
      }, 2500); // poll every 2.5s - indexer runs every 2s
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setStatus("idle");
    setCreditedUsd(null);
    previousBalanceRef.current = 0;
  }, [stopPolling]);

  return { status, creditedUsd, startPolling, reset };
}
