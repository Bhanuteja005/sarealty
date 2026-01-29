"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface FavoriteButtonProps {
    className?: string;
    iconClassName?: string;
}

export function FavoriteButton({ className, iconClassName }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
            }}
            className={cn(
                "bg-white/90 p-2 rounded-full hover:bg-white transition shadow-sm",
                className
            )}
            aria-label="Add to favorites"
        >
            <Heart 
                className={cn(
                    "w-4 h-4 transition-colors", 
                    isFavorite ? "fill-primary text-primary" : "text-gray-600",
                    iconClassName
                )} 
            />
        </button>
    );
}
