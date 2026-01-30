"use client";

import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { FavoriteButton } from "@/components/favorite-button";


interface PropertyCardProps {
    property: Property;
    index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-2xl hover:border-border transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <Link href={`/properties/${property.id}`} className="block w-full h-full">
                    {property.images[0] ? (
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            src={property.images[0]}
                            alt={property.address}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                </Link>
                
                

                <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
                        {property.pricePerSqft && (
                            <span className="text-xs text-muted-foreground">
                                ${property.pricePerSqft}/sqft
                            </span>
                        )}
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
