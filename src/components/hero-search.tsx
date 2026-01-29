"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, Home } from "lucide-react";

// Sample suggestions - these would typically come from an API
const defaultSuggestions = [
    { type: "location", text: "Dallas, TX", query: "Dallas" },
    { type: "location", text: "Fort Worth, TX", query: "Fort Worth" },
    { type: "location", text: "Saginaw, TX", query: "Saginaw" },
    { type: "location", text: "Arlington, TX", query: "Arlington" },
    { type: "location", text: "Plano, TX", query: "Plano" },
    { type: "location", text: "Frisco, TX", query: "Frisco" },
    { type: "property", text: "Homes with 2+ bedrooms", query: "2 beds" },
    { type: "property", text: "Homes with 3+ bedrooms", query: "3 beds" },
    { type: "property", text: "Homes with 4+ bedrooms", query: "4 beds" },
    { type: "property", text: "Single Family homes", query: "Single Family" },
    { type: "property", text: "Residential properties", query: "Residential" },
];

interface Suggestion {
    type: string;
    text: string;
    query: string;
}

export default function HeroSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Filter suggestions based on input
    useEffect(() => {
        if (query.trim().length > 0) {
            const q = query.toLowerCase();
            const filtered = defaultSuggestions.filter(s => 
                s.text.toLowerCase().includes(q) || 
                s.query.toLowerCase().includes(q)
            );
            
            // Add dynamic suggestions based on query
            const dynamicSuggestions: Suggestion[] = [];
            
            // Check if query looks like a city/location
            if (query.length >= 2) {
                dynamicSuggestions.push({
                    type: "search",
                    text: `${query} homes`,
                    query: query
                });
                dynamicSuggestions.push({
                    type: "search", 
                    text: `${query} homes with 2+ bedrooms`,
                    query: `${query} 2 beds`
                });
            }
            
            setSuggestions([...dynamicSuggestions, ...filtered].slice(0, 6));
            setIsOpen(true);
        } else {
            setSuggestions(defaultSuggestions.slice(0, 6));
        }
        setSelectedIndex(-1);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = useCallback((searchQuery?: string) => {
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            router.push(`/properties?q=${encodeURIComponent(finalQuery.trim())}`);
            setIsOpen(false);
        }
    }, [query, router]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSearch(suggestions[selectedIndex].query);
            } else {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setQuery(suggestion.text);
        handleSearch(suggestion.query);
    };

    return (
        <div ref={containerRef} className="w-full relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter an address, neighborhood, city, or ZIP code"
                    className="w-full bg-white text-gray-900 border-0 rounded-lg px-5 py-4 pr-24 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
                    autoComplete="off"
                />
                
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                
                <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.type}-${suggestion.text}-${index}`}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                                selectedIndex === index ? "bg-gray-50" : ""
                            }`}
                        >
                            <span className="text-gray-400">
                                {suggestion.type === "location" ? (
                                    <MapPin className="w-5 h-5" />
                                ) : suggestion.type === "property" ? (
                                    <Home className="w-5 h-5" />
                                ) : (
                                    <Search className="w-5 h-5" />
                                )}
                            </span>
                            <span className="text-gray-700">
                                {/* Highlight matching text */}
                                {query && suggestion.text.toLowerCase().includes(query.toLowerCase()) ? (
                                    <>
                                        <span className="font-semibold text-gray-900">
                                            {suggestion.text.substring(0, suggestion.text.toLowerCase().indexOf(query.toLowerCase()))}
                                            {query}
                                        </span>
                                        {suggestion.text.substring(suggestion.text.toLowerCase().indexOf(query.toLowerCase()) + query.length)}
                                    </>
                                ) : (
                                    suggestion.text
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
