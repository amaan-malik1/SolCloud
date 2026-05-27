"use client";

import {
    CardBody,
    CardContainer,
    CardItem,
} from "../shared/card-3d";

export function HeroVisual() {
    return (
        <CardContainer className="inter-var">
            <CardBody
                className="
          relative
          h-[520px]
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          shadow-[0_0_80px_rgba(168,85,247,0.15)]
        "
            >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-emerald-500/10" />

                {/* Storage Card */}
                <CardItem
                    translateZ={60}
                    className="absolute left-8 top-8"
                >
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
                        <div className="text-xs text-white/40">
                            Storage Usage
                        </div>

                        <div className="mt-1 text-3xl font-bold">
                            8.4 TB
                        </div>
                    </div>
                </CardItem>

                {/* SOL Balance */}
                <CardItem
                    translateZ={100}
                    className="absolute right-8 top-24"
                >
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-4 text-black shadow-2xl">
                        <div className="text-xs font-semibold">
                            SOL Balance
                        </div>

                        <div className="text-2xl font-black">
                            12.84
                        </div>
                    </div>
                </CardItem>

                {/* Orb */}
                <CardItem
                    translateZ={120}
                    className="absolute left-1/2 top-1/2"
                >
                    <div
                        className="
              h-40
              w-40
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-gradient-to-br
              from-purple-500
              to-emerald-400
              opacity-70
              blur-2xl
            "
                    />
                </CardItem>

                {/* Deployment Panel */}
                <CardItem
                    translateZ={80}
                    className="absolute bottom-10 left-1/2 w-[85%] -translate-x-1/2"
                >
                    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/40">
                                    Active Deployment
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                    solstore-prod
                                </h3>
                            </div>

                            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_#14F195]" />
                        </div>

                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-purple-500 to-emerald-400" />
                        </div>
                    </div>
                </CardItem>
            </CardBody>
        </CardContainer>
    );
}