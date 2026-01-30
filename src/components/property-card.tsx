"use client";

import Link from "next/link";
import { Bed, Bath, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { FavoriteButton } from "@/components/favorite-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";


interface PropertyCardProps {
    property: Property;
    index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentSlide(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-2xl hover:border-border transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Carousel */}
            <div className="relative aspect-video overflow-hidden group/carousel">
                <Link href={`/properties/${property.id}`} className="block w-full h-full">
                    <div className="overflow-hidden h-full" ref={emblaRef}>
                        <div className="flex h-full touch-pan-y">
                            {property.images && property.images.length > 0 ? (
                                property.images.map((src, i) => (
                                    <div className="flex-[0_0_100%] min-w-0 relative h-full" key={i}>
                                        <img
                                            src={src}
                                            alt={`${property.address} - Image ${i + 1}`}
                                            className="w-full h-full object-cover select-none"
                                            loading="lazy"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                    <span className="text-muted-foreground">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
                
                {/* Carousel Controls - Only visible on hover if multiple images */}
                {property.images && property.images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className={cn(
                                "absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all duration-200 z-20 focus:outline-none backdrop-blur-sm",
                                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                            )}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all duration-200 z-20 focus:outline-none backdrop-blur-sm",
                                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                            )}
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        {/* Dots Indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
                            {property.images.slice(0, 5).map((_, i) => (
                                <div 
                                    key={i}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-sm transition-colors",
                                        i === currentSlide % property.images.length ? "bg-white" : "bg-white/50"
                                    )}
                                />
                            ))}
                            
                        </div>
                    </>
                )}

                

                <div className="absolute top-3 right-3 z-30">
                    <FavoriteButton />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            </div>

            {/* Content */}
            <div className="p-5">
                <Link href={`/properties/${property.id}`} className="block space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-tight truncate text-foreground group-hover:text-primary transition-colors">
                            {property.address}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                            {property.city ? `${property.city}, ` : ''}{property.state} {property.zipCode}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                            {formatPrice(property.price)}
                        </span>
                        
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Bed className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Beds</span>
                            </div>
                            <span className="font-semibold">{property.beds}</span>
                        </div>
                        
                        <div className="flex flex-col gap-0.5 items-center pl-4 border-l border-border/50">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Bath className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Baths</span>
                            </div>
                            <span className="font-semibold">{property.baths}</span>
                        </div>
                        
                        <div className="flex flex-col gap-0.5 items-end pl-4 border-l border-border/50">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Ruler className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">SqFt</span>
                            </div>
                            <span className="font-semibold">{formatNumber(property.sqft)}</span>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}
