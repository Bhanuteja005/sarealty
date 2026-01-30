import { searchProperties, formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { PropertiesFilter } from "@/components/properties-filter";

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

    const properties = result.items;
    const total = result.total;
    const totalPages = result.totalPages;

    return (
        <div className="w-full bg-background min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Find Your Dream Home
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {total} {total === 1 ? 'property' : 'properties'} found
                            {sp?.location ? ` in ${sp.location}` : ''}
                        </p>
                    </div>

                    {/* Filters - Static, below heading */}
                    <div className="mb-10">
                        <PropertiesFilter />
                    </div>

                    {/* Property Grid */}
                    {properties.length === 0 ? (
                        <div className="text-center py-32 bg-muted/30 rounded-3xl border border-dashed border-border">
                            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
                            <Link href="/properties">
                                <Button size="lg" variant="outline">Clear All Filters</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property, index) => (
                                <PropertyCard 
                                    key={property.id} 
                                    property={property} 
                                    index={index} 
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            {currentPage > 1 ? (
                                <Link href={buildHrefWithPage(sp, currentPage - 1)}>
                                    <Button variant="outline" size="lg" className="w-32">Previous</Button>
                                </Link>
                            ) : (
                                <Button variant="outline" size="lg" className="w-32" disabled>Previous</Button>
                            )}

                            <span className="text-sm font-medium text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            {currentPage < totalPages ? (
                                <Link href={buildHrefWithPage(sp, currentPage + 1)}>
                                    <Button variant="outline" size="lg" className="w-32">Next</Button>
                                </Link>
                            ) : (
                                <Button variant="outline" size="lg" className="w-32" disabled>Next</Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

