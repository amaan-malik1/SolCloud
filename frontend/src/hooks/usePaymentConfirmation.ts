import { useState, useRef, useCallback } from "react";
import { storageApi } from "../api/storage.api";

type ConfirmationStatus = "idle" | "waiting" | "confirmed" | "timeout";

export function usePaymentConfirmation() {
  const [status, setStatus] = useState<ConfirmationStatus>("idle");
  const [creditedUsd, setCreditedUsd] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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

      pollingRef.current = setInterval(async () => {
        if (Date.now() - startTimeRef.current > 120_000) {
          stopPolling();
          setStatus("timeout");
          return;
        }
        try {
          const data = await storageApi.getBalance();
          if (data.amountUsd > previousBalance) {
            stopPolling();
            setCreditedUsd(data.amountUsd - previousBalance);
            setStatus("confirmed");
          }
        } catch {
          /* silent retry */
        }
      }, 3000);
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setStatus("idle");
    setCreditedUsd(null);
  }, [stopPolling]);

  return { status, creditedUsd, startPolling, reset };
}
