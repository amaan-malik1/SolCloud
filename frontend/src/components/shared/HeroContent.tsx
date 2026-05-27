"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroContent() {
    return (
        <div className="relative">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2 backdrop-blur-xl"
            >
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#14F195]" />

                <span className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300">
                    Superteam India • Solana Grant
                </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-4px] md:text-8xl"
            >
                Cloud Storage
                <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-emerald-400 bg-clip-text text-transparent">
                    Reimagined.
                </span>
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 max-w-xl text-lg leading-relaxed text-white/60"
            >
                Provision production-grade Cloudflare R2 storage instantly using
                Solana payments. No cards. No banking friction. Just deploy.
            </motion.p>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4"
            >
                <Link
                    to="/register"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 py-4 font-medium transition-all duration-300 hover:scale-[1.03]"
                >
                    <span className="relative z-10">Start Building</span>

                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <Link
                    to="/login"
                    className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-medium backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/10"
                >
                    View Dashboard
                </Link>
            </motion.div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-10 border-t border-white/10 pt-10">
                {[
                    ["450M+", "Unbanked Indian users"],
                    ["<400ms", "Solana finality"],
                    ["$0", "Cloudflare R2 egress"],
                ].map(([value, label]) => (
                    <div key={value}>
                        <div className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent">
                            {value}
                        </div>

                        <div className="mt-1 text-sm text-white/40">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}