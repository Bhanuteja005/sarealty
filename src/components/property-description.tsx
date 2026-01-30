'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PropertyDescriptionProps {
    description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    // Truncate at around 300 characters or 4 lines
    const shouldTruncate = description.length > 400; 

    return (
        <div className="relative">
            <div className={cn(
                "prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-line transition-all duration-300",
                !isExpanded && shouldTruncate && "max-h-[160px] overflow-hidden relative"
            )}>
                 {description}
                 {!isExpanded && shouldTruncate && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent" />
                 )}
            </div>
            
            {shouldTruncate && (
                <Button 
                    variant="link" 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-primary font-semibold p-0 h-auto hover:no-underline"
                >
                    {isExpanded ? (
                        <span className="flex items-center gap-1">Hide <ChevronUp className="w-4 h-4" /></span>
                    ) : (
                        <span className="flex items-center gap-1">Read more <ChevronDown className="w-4 h-4" /></span>
                    )}
                </Button>
            )}
        </div>
    );
}
