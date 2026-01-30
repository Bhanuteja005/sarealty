"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Share, Heart, Map as MapIcon, ImageIcon, LayoutDashboard, Box } from "lucide-react"
import { cn } from "@/lib"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PropertyGalleryProps {
    images: string[]
    openHouse?: {
        date: string
        startTime: string
        endTime: string
    }
    address: string
}

export function PropertyGallery({ images, openHouse, address }: PropertyGalleryProps) {
    const [current, setCurrent] = React.useState(0)

    const next = () => setCurrent((prev) => (prev + 1) % images.length)
    const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length)

    // Handle initial hydration mismatch
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    if (!mounted) return (
        <div className="relative w-full h-[60vh] md:h-[650px] bg-muted animate-pulse rounded-xl" />
    )

    return (
        <div className="relative w-full h-[55vh] md:h-[550px] bg-zinc-950 group overflow-hidden rounded-xl border border-border shadow-2xl">
            {/* Main Image */}
            <div className="absolute inset-0 transition-all duration-500">
                <img 
                    src={images[current]} 
                    alt={`Property view ${current + 1}`} 
                    className="w-full h-full object-cover opacity-100 transition-opacity"
                    key={current} // Key forces re-render for simple fade/switch
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
            </div>

            {/* Top Controls */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                <div className="flex flex-col gap-2">
                    {openHouse && (
                        <div className="flex items-center gap-2">
                             <Badge className="bg-orange-600 hover:bg-orange-600 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border-0 rounded-sm shadow-lg flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                Open: {openHouse.date} {openHouse.startTime}-{openHouse.endTime}
                             </Badge>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-lg shadow-sm gap-2 h-9 transition-all hover:scale-105">
                        <Heart className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-lg shadow-sm gap-2 h-9 transition-all hover:scale-105">
                        <Share className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">Share</span>
                    </Button>
                </div>
            </div>

            {/* Side Navigation */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 text-white hover:text-white border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={prev}
            >
                <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 text-white hover:text-white border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={next}
            >
                <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Bottom Controls / Tabs */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide mask-fade">
                    {/* Simulated Tabs like screenshot */}
                    <div className="flex items-center gap-3">
                        <button className="flex flex-col items-center gap-2 group/btn relative">
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden ring-2 ring-white shadow-lg transition-transform hover:-translate-y-1">
                                <img src={images[0]} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10 group-hover/btn:bg-transparent transition-colors" />
                            </div>
                            <span className="text-white text-xs font-semibold shadow-black/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Photos</span>
                        </button>
                        
                    </div>
                </div>

                <div className="flex items-center mb-2">
                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                         <ImageIcon className="w-4 h-4" />
                         <span>{current + 1} / {images.length}</span>
                    </div>
                </div>
            </div>
            
            {/* Nav dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                {images.slice(0, 5).map((_, i) => (
                    <div 
                        key={i}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                            i === (current % 5) ? "bg-white scale-125" : "bg-white/40"
                        )}
                    />
                ))}
                {images.length > 5 && <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
            </div>
        </div>
    )
}
