import { getPropertyById, formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, Calendar, Phone, Mail, Home, Car, DollarSign, Share, ArrowLeft } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyMap from "@/components/property-map";
import { notFound } from "next/navigation";
import AgentImage from "@/components/agent-image";
import { PropertyGallery } from "@/components/property-gallery";

interface PropertyDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    return (
        <div className="w-full bg-background">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Back Button */}
                    <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Properties
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Image Gallery */}
                            <div className="mb-8">
                                <PropertyGallery 
                                    images={property.images} 
                                    openHouse={property.openHouse}
                                    address={property.address}
                                />
                            </div>

                            {/* Property Details */}
                            <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-2 font-medium">
                                            {property.status}
                                        </div>
                                        <h1 className="text-4xl font-semibold mb-2">{formatPrice(property.price)}</h1>
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <span className="text-lg">
                                                {property.address}, {property.city}, {property.state} {property.zipCode}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
                                    <div className="text-center">
                                        <div className="text-3xl font-semibold mb-1">{property.beds}</div>
                                        <div className="text-sm text-muted-foreground">beds</div>
                                    </div>
                                    <div className="text-center border-x border-border">
                                        <div className="text-3xl font-semibold mb-1">{property.baths}</div>
                                        <div className="text-sm text-muted-foreground">baths</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-semibold mb-1">{formatNumber(property.sqft)}</div>
                                        <div className="text-sm text-muted-foreground">sqft</div>
                                    </div>
                                </div>

                                {/* Additional Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Type</div>
                                        <div className="font-medium">{property.propertyType}</div>
                                    </div>
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Year Built</div>
                                        <div className="font-medium">{property.yearBuilt}</div>
                                    </div>
                                    {property.acres && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Acres</div>
                                            <div className="font-medium">{property.acres}</div>
                                        </div>
                                    )}
                                    {property.parking && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Parking</div>
                                            <div className="font-medium">{property.parking} spaces</div>
                                        </div>
                                    )}
                                    {property.pricePerSqft && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Price/sqft</div>
                                            <div className="font-medium">${property.pricePerSqft}</div>
                                        </div>
                                    )}
                                    {property.hoa && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">HOA</div>
                                            <div className="font-medium">${property.hoa}/mo</div>
                                        </div>
                                    )}
                                    {property.mlsNumber && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">MLS#</div>
                                            <div className="font-medium">{property.mlsNumber}</div>
                                        </div>
                                    )}
                                    {property.subdivision && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Subdivision</div>
                                            <div className="font-medium">{property.subdivision}</div>
                                        </div>
                                    )}
                                    {property.propertySubType && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Property Subtype</div>
                                            <div className="font-medium">{property.propertySubType}</div>
                                        </div>
                                    )}
                                    {property.halfBaths && (
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Half Baths</div>
                                            <div className="font-medium">{property.halfBaths}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                <h2 className="text-2xl font-semibold mb-4">What's special</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">{property.description}</p>

                                {property.features.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-3">Key Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {property.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                                                >
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Map */}
                            <div className="mb-6">
                                <PropertyMap 
                                    address={property.address}
                                    city={property.city}
                                    state={property.state}
                                    zipCode={property.zipCode}
                                />
                            </div>

                            {/* Schools */}
                            {property.schools && (
                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h2 className="text-2xl font-semibold mb-4">Schools</h2>
                                    <div className="space-y-4">
                                        {property.schools.district && (
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">District</span>
                                                <span className="font-medium">{property.schools.district}</span>
                                            </div>
                                        )}
                                        {property.schools.elementary && (
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">Elementary</span>
                                                <span className="font-medium">{property.schools.elementary}</span>
                                            </div>
                                        )}
                                        {property.schools.middle && (
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">Middle</span>
                                                <span className="font-medium">{property.schools.middle}</span>
                                            </div>
                                        )}
                                        {property.schools.high && (
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">High School</span>
                                                <span className="font-medium">{property.schools.high}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Open House */}
                                {property.openHouse && (
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="text-xl font-semibold mb-4">Open house</h3>
                                        <div className="bg-secondary/50 rounded-lg p-4">
                                            <div className="font-medium mb-1">{property.openHouse.date}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {property.openHouse.startTime} - {property.openHouse.endTime}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Agent Card */}
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-4">Listed by</h3>
                                    <div className="text-center mb-4">
                                        <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-3 overflow-hidden border-2 border-border">
                                            <AgentImage 
                                                src="/images/dp.jpg" 
                                                alt={property.agentName} 
                                                fallbackInitial={property.agentName.charAt(0)}
                                            />
                                        </div>
                                        <div className="font-semibold text-lg">{property.agentName}</div>
                                        <div className="text-sm text-muted-foreground">SA Realty</div>
                                    </div>

                                    <div className="space-y-3">
                                        <a
                                            href={`tel:${property.agentPhone}`}
                                            className="flex items-center justify-center gap-2 w-full bg-transparent border border-primary text-primary hover:bg-primary/5 rounded-lg px-4 py-3 transition font-medium"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Contact Agent
                                        </a>
                                    </div>
                                </div>

                                {/* Request Tour */}
                                <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg">
                                    <h3 className="text-xl font-semibold mb-2">Request a tour</h3>
                                    <p className="text-primary-foreground/90 text-sm mb-4">
                                        Schedule a showing as early as today
                                    </p>
                                    <Link href="/contact" className="w-full">
                                        <Button className="w-full bg-background text-primary hover:bg-background/90" size="lg">
                                            Schedule Tour
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
