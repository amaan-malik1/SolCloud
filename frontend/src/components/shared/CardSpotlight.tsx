// "use client";

// import React, { useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

// export const CardSpotlight = ({
//     children,
//     radius = 350,
//     color = "#262626",
//     className,
//     ...props
// }: {
//     radius?: number;
//     color?: string;
//     children: React.ReactNode;
// } & React.HTMLProps<HTMLDivElement>) => {
//     const mouseX = useRef(0);
//     const mouseY = useRef(0);
//     const [isHovering, setIsHovering] = useState(false);

//     function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
//         const { left, top } = currentTarget.getBoundingClientRect();
//         mouseX.current = clientX - left;
//         mouseY.current = clientY - top;
//         setIsHovering(true);
//     }

//     function handleMouseLeave() {
//         setIsHovering(false);
//     }

//     return (
//         <div
//             className={cn(
//                 "group relative border border-white/[0.08] bg-black/40 overflow-hidden rounded-xl",
//                 className
//             )}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//             {...props}
//         >
//             {isHovering && (