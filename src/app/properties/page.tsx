import { searchProperties, formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface PropertiesPageProps {
    searchParams: Promise<{
        q?: string;
        location?: string;
        minPrice?: string;
        maxPrice?: string;
        beds?: string;
        baths?: string;
        page?: string;
    }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const sp = await searchParams;
    const currentPage = sp?.page ? Math.max(1, parseInt(sp.page)) : 1;

    function buildHrefWithPage(paramsObj: any, pageNum: number) {
        const params = new URLSearchParams();
        if (paramsObj?.q) params.set('q', paramsObj.q);
        if (paramsObj?.location) params.set('location', paramsObj.location);
        if (paramsObj?.minPrice) params.set('minPrice', paramsObj.minPrice);
        if (paramsObj?.maxPrice) params.set('maxPrice', paramsObj.maxPrice);
        if (paramsObj?.beds) params.set('beds', paramsObj.beds);
        if (paramsObj?.baths) params.set('baths', paramsObj.baths);
        params.set('page', String(pageNum));
        return `/properties?${params.toString()}`;
    }

    const result = await searchProperties({
        q: sp?.q,
        location: sp?.location,
        minPrice: sp?.minPrice ? parseInt(sp.minPrice) : undefined,
        maxPrice: sp?.maxPrice ? parseInt(sp.maxPrice) : undefined,
        beds: sp?.beds ? parseInt(sp.beds) : undefined,
        baths: sp?.baths ? parseInt(sp.baths) : undefined,
        page: currentPage,
        perPage: 20,
    });

    console.log('Search result:', {
        total: result.total,
        totalPages: result.totalPages,
        itemsCount: result.items.length,
        page: result.page,
        perPage: result.perPage
    });

    const properties = result.items;
    const total = result.total;
    const totalPages = result.totalPages;

    return (
        <div className="w-full">
            <Navbar />

            <div className="pt-24 pb-16 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-semibold mb-2">
                            {sp?.location || sp?.q
                                ? `Properties in ${sp?.location || sp?.q}`
                                : 'All Properties'}
                        </h1>
                        <p className="text-muted-foreground">
                            {total} {total === 1 ? 'result' : 'results'} found
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 p-4 bg-card border border-border rounded-lg">
                        <form method="get" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <input
                                    name="q"
                                    defaultValue={sp?.q}
                                    placeholder="Search address, city, description..."
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <input
                                    name="location"
                                    defaultValue={sp?.location}
                                    placeholder="City or ZIP code"
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <select
                                    name="beds"
                                    defaultValue={sp?.beds}
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Any beds</option>
                                    <option value="1">1+ beds</option>
                                    <option value="2">2+ beds</option>
                                    <option value="3">3+ beds</option>
                                    <option value="4">4+ beds</option>
                                    <option value="5">5+ beds</option>
                                </select>
                                <select
                                    name="baths"
                                    defaultValue={sp?.baths}
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Any baths</option>
                                    <option value="1">1+ baths</option>
                                    <option value="2">2+ baths</option>
                                    <option value="3">3+ baths</option>
                                    <option value="4">4+ baths</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    name="minPrice"
                                    type="number"
                                    defaultValue={sp?.minPrice}
                                    placeholder="Min price"
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <input
                                    name="maxPrice"
                                    type="number"
                                    defaultValue={sp?.maxPrice}
                                    placeholder="Max price"
                                    className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Apply Filters
                                    </Button>
                                    <Link href="/properties">
                                        <Button type="button" variant="outline">
                                            Clear
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Property Grid */}
                    {properties.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground mb-4">No properties found matching your criteria</p>
                            <Link href="/properties">
                                <Button variant="outline">Clear Filters</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        <Link href={`/properties/${property.id}`} className="block h-full w-full">
                                            {property.images[0] ? (
                                                <img
                                                    src={property.images[0]}
                                                    alt={property.address}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <span className="text-muted-foreground">No Image</span>
                                                </div>
                                            )}
                                        </Link>
                                        
                                        {property.openHouse && (
                                            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full pointer-events-none">
                                                Open House
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 z-10">
                                            <FavoriteButton />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <Link href={`/properties/${property.id}`} className="block">
                                            <div className="text-2xl font-semibold mb-2">{formatPrice(property.price)}</div>

                                            <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Bed className="w-4 h-4" />
                                                    <span>{property.beds} beds</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bath className="w-4 h-4" />
                                                    <span>{property.baths} baths</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Ruler className="w-4 h-4" />
                                                    <span>{formatNumber(property.sqft)} sqft</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-1 text-sm mb-2">
                                                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground">
                                                    {property.address}, {property.city}, {property.state} {property.zipCode}
                                                </span>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {property.propertyType} • Listed {property.listingDate}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center space-x-3">
                            {currentPage > 1 ? (
                                <Link href={buildHrefWithPage(sp, currentPage - 1)}>
                                    <Button variant="outline">Previous</Button>
                                </Link>
                            ) : (
                                <Button variant="outline" disabled>Previous</Button>
                            )}

                            <div className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages} • {total} results
                            </div>

                            {currentPage < totalPages ? (
                                <Link href={buildHrefWithPage(sp, currentPage + 1)}>
                                    <Button>Next</Button>
                                </Link>
                            ) : (
                                <Button disabled>Next</Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
