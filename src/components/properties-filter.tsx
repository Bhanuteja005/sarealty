"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export function PropertiesFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // State for local changes before applying
    const [q, setQ] = useState(searchParams.get("q") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [beds, setBeds] = useState(searchParams.get("beds") || "any");
    const [baths, setBaths] = useState(searchParams.get("baths") || "any");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [isExactMatch, setIsExactMatch] = useState(false); // To mimic the screenshot functionality

    // Update URL helper
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const params = new URLSearchParams(searchParams.toString());
        
        if (q) params.set("q", q);
        else params.delete("q");
        
        if (location) params.set("location", location);
        else params.delete("location");
        
        if (beds && beds !== "any") params.set("beds", beds);
        else params.delete("beds");
        
        if (baths && baths !== "any") params.set("baths", baths);
        else params.delete("baths");
        
        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");
        
        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");
        
        // Reset page on new filter
        params.delete("page");
        
        router.push(`/properties?${params.toString()}`);
    };

    const handleApplyBedsBaths = () => {
        handleSearch();
    };

    const bedOptions = ["any", "1", "2", "3", "4", "5"];
    const bathOptions = ["any", "1", "2", "3", "4"];

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Address, Neighborhood, or Zip"
                        className="w-full pl-10 h-10 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Location Input (keep distinct or merge with search depending on preference, currently keeping distinct as per previous code) */}
                <div className="w-full lg:w-48">
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City"
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Beds & Baths Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full lg:w-auto justify-between gap-2 h-10 border-border bg-background">
                            <span>
                                {beds !== "any" || baths !== "any" 
                                    ? `${beds !== "any" ? beds + "+ Bd" : ""} ${beds !== "any" && baths !== "any" ? ", " : ""} ${baths !== "any" ? baths + "+ Ba" : ""}`
                                    : "Beds & Baths"}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-5" align="start">
                        <div className="space-y-6">
                            {/* Bedrooms */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Number of Bedrooms</Label>
                                <div className="flex rounded-md shadow-sm">
                                    {bedOptions.map((opt, i) => (
                                        <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setBeds(opt)}
                                            className={cn(
                                                "flex-1 px-3 py-2 text-sm border font-medium transition-colors focus:z-10",
                                                i === 0 ? "rounded-l-md" : "",
                                                i === bedOptions.length - 1 ? "rounded-r-md" : "",
                                                i !== 0 ? "-ml-px" : "",
                                                beds === opt 
                                                    ? "bg-primary/10 text-primary border-primary z-20" 
                                                    : "bg-background text-foreground border-border hover:bg-muted"
                                            )}
                                        >
                                            {opt === "any" ? "Any" : `${opt}+`}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="exact-match" checked={isExactMatch} onCheckedChange={(c) => setIsExactMatch(!!c)} />
                                    <label
                                        htmlFor="exact-match"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Use exact match
                                    </label>
                                </div>
                            </div>

                            {/* Bathrooms */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Number of Bathrooms</Label>
                                <div className="flex rounded-md shadow-sm">
                                    {bathOptions.map((opt, i) => (
                                        <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setBaths(opt)}
                                            className={cn(
                                                "flex-1 px-3 py-2 text-sm border font-medium transition-colors focus:z-10",
                                                i === 0 ? "rounded-l-md" : "",
                                                i === bathOptions.length - 1 ? "rounded-r-md" : "",
                                                i !== 0 ? "-ml-px" : "",
                                                baths === opt 
                                                    ? "bg-primary/10 text-primary border-primary z-20" 
                                                    : "bg-background text-foreground border-border hover:bg-muted"
                                            )}
                                        >
                                            {opt === "any" ? "Any" : `${opt}+`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Apply Button */}
                            <Button type="button" onClick={handleApplyBedsBaths} className="w-full bg-primary hover:bg-primary/90 text-white">
                                Apply
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Price Range Popover */}
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full lg:w-auto justify-between gap-2 h-10 border-border bg-background">
                            <span>
                                {minPrice || maxPrice 
                                    ? `$${minPrice || '0'} - $${maxPrice || 'Any'}`
                                    : "Price"}
                            </span>
                             <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-4" align="start">
                        <div className="space-y-4">
                            <Label className="font-semibold">Price Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Min Price</Label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="No Min"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Max Price</Label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="No Max"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <Button type="button" onClick={() => handleSearch()} className="w-full">Apply</Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button type="submit" className="w-full lg:w-auto h-10 font-medium px-8">
                    Search
                </Button>
                
                 {/* Clear Filters */}
                 {(beds !== "any" || baths !== "any" || minPrice || maxPrice || q || location) && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                            setQ("");
                            setLocation("");
                            setBeds("any");
                            setBaths("any");
                            setMinPrice("");
                            setMaxPrice("");
                            router.push("/properties");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Reset
                    </Button>
                )}
            </form>
        </div>
    );
}
