"use client";

import { useState } from "react";
import { cn } from "@/lib";

interface AgentImageProps {
    src?: string;
    alt: string;
    fallbackInitial: string;
    className?: string;
}

export default function AgentImage({ src, alt, fallbackInitial, className }: AgentImageProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={cn("flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl h-full w-full", className)}>
                {fallbackInitial}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            onError={() => setError(true)}
        />
    );
}
