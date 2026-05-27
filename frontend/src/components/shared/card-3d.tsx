"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { cn } from "../../lib/utils";

const MouseEnterContext = createContext<any>(undefined);

export const CardContainer = ({
    children,
    className,
    containerClassName,
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseEntered, setIsMouseEntered] =
        useState(false);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!containerRef.current) return;

        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();

        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;

        containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseEnter = () => {
        setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;

        setIsMouseEntered(false);

        containerRef.current.style.transform =
            "rotateY(0deg) rotateX(0deg)";
    };

    return (
        <MouseEnterContext.Provider
            value={[isMouseEntered, setIsMouseEntered]}
        >
            <div
                className={cn(
                    "flex items-center justify-center",
                    containerClassName
                )}
                style={{
                    perspective: "1000px",
                }}
            >
                <div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                        "relative flex items-center justify-center transition-all duration-200 ease-linear",
                        className
                    )}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}
                </div>
            </div>
        </MouseEnterContext.Provider>
    );
};

export const CardBody = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "[transform-style:preserve-3d]",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardItem = ({
    as: Tag = "div",
    children,
    className,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
}: any) => {
    const ref = useRef<HTMLDivElement>(null);

    const [isMouseEntered] = useMouseEnter();

    useEffect(() => {
        if (!ref.current) return;

        if (isMouseEntered) {
            ref.current.style.transform = `
        translateZ(${translateZ}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
        } else {
            ref.current.style.transform = `
        translateZ(0px)
        rotateX(0deg)
        rotateY(0deg)
      `;
        }
    }, [isMouseEntered]);

    return (
        <Tag
            ref={ref}
            className={cn(
                "transition duration-200 ease-linear",
                className
            )}
        >
            {children}
        </Tag>
    );
};

export const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);

    if (context === undefined) {
        throw new Error(
            "useMouseEnter must be used inside provider"
        );
    }

    return context;
};