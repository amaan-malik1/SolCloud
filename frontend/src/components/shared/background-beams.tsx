"use client";

import { cn } from "../../lib/utils";

export const BackgroundBeams = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden",
                className
            )}
        >
            <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent blur-sm" />

            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent blur-sm" />

            <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent blur-sm" />
        </div>
    );
};