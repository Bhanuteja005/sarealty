'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ExpandablePanelProps {
    children: React.ReactNode;
    label?: string;
    initialHeight?: number;
}

export function ExpandablePanel({ children, label = "Show more", initialHeight = 500 }: ExpandablePanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
             <div 
                className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    !isExpanded && "relative"
                )}
                style={{ maxHeight: isExpanded ? 'none' : `${initialHeight}px` }}
             >
                {children}
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
                )}
             </div>

            <Button 
                variant="ghost" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-primary font-bold hover:bg-transparent hover:text-primary/80 p-0 h-auto flex items-center gap-1"
            >
                {isExpanded ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                ) : (
                    <>{label} <ChevronDown className="w-4 h-4" /></>
                )}
            </Button>
        </div>
    );
}
