const BACKEND = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function startKeepAlive() {
  // Ping every 14 minutes to prevent sleep
  setInterval(
    async () => {
      try {
        await fetch(`${BACKEND}/health`);
      } catch {
        /* noyhing*/
      }
    },
    15 * 60 * 1000,
  );
}
