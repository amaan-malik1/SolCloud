import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [count, setCount] = useState<number | null>(null);

    const stars = useMemo(
        () =>
            Array.from({ length: 120 }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                size: Math.random() * 2 + 1,
                delay: Math.random() * 4,
            })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError("Email required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/waitlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setDone(true);
            setCount(data.position);
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-dark-bg text-white">

            {/* STARS */}

            <div className="absolute inset-0">
                {stars.map((star) => (
                    <motion.span
                        key={star.id}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: star.delay,
                        }}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                        }}
                    />
                ))}
            </div>

            {/* PURPLE GLOW */}

            <motion.div
                animate={{
                    y: [-15, 15, -15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#34d399]/20 blur-[180px]"
            />

            {/* GREEN GLOW */}

            <motion.div
                animate={{
                    y: [15, -15, 15],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-[45%] top-[55%] h-[500px] w-[500px] rounded-full bg-[#34d399]/10 blur-[150px]"
            />

            {/* CENTER BLUR */}

            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* CONTENT */}

            <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Logo size="md" />
                </motion.div>

                {/* Badge */}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-10 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/80 backdrop-blur-xl"
                >
                    Launching on Solana Mainnet Soon
                </motion.div>

                {/* Headline */}

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-10 max-w-5xl text-center text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-[92px]"
                >
                    Cloud Storage
                    <br />

                    <span className="text-white/90">
                        for the Solana Era.
                    </span>
                </motion.h1>

                {/* Description */}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 max-w-2xl text-lg leading-relaxed text-white/50"
                >
                    Get instant Cloudflare R2 storage using SOL.
                    No international cards. No banking restrictions.
                    Just upload and build.
                </motion.p>

                {/* FORM */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="mt-12 w-full max-w-xl"
                >
                    {!done ? (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl md:flex-row">

                                <input
                                    type="email"
                                    placeholder="Your Email Address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    className="h-14 flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/35"
                                />

                                <motion.button
                                    whileHover={{
                                        scale: 1.03,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    disabled={loading}
                                    className="h-14 rounded-xl bg-white px-8 font-medium text-black transition"
                                >
                                    {loading ? "Joining..." : "Join Waitlist"}
                                </motion.button>
                            </div>

                            {error && (
                                <p className="mt-3 text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            <p className="mt-4 text-sm text-white/40">
                                No spam. Only launch updates.
                            </p>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
                        >
                            <div className="mb-4 text-5xl">🎉</div>

                            <h3 className="text-2xl font-semibold">
                                You're on the list
                            </h3>

                            <p className="mt-3 text-white/60">
                                {count
                                    ? `You're #${count} on the waitlist`
                                    : "We'll notify you when we launch."}
                            </p>

                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    "Just joined the waitlist for @SolStore_pro 🚀"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-black"
                            >
                                Share on X
                            </a>
                        </motion.div>
                    )}
                </motion.div>

                {/* WAITLIST COUNT */}

                {!done && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-sm text-white/35"
                    >
                        Join early and secure your spot.
                    </motion.div>
                )}
            </div>

            {/* PLANET HORIZON */}

            <motion.div
                animate={{
                    opacity: [0.75, 1, 0.75],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                }}
                className="pointer-events-none absolute bottom-[-380px] left-1/2 h-[700px] w-[200vw] -translate-x-1/2 rounded-[100%]"
                style={{
                    boxShadow: `
            0 0 35px rgba(255,255,255,0.4),
            0 0 90px rgba(52,211,153,0.35),
            0 0 140px rgba(20,241,149,0.15)
          `,
                    borderTop: "2px solid rgba(255,255,255,.55)",
                }}
            />

            {/* VIGNETTE */}

            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,.75) 100%)",
                }}
            />
        </main>
    );
}