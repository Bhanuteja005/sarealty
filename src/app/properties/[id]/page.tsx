import { getPropertyById, formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, Calendar, Phone, Mail, Home, Car, DollarSign, Share, ArrowLeft, Check, Grid, Info, TreeDeciduous, School, FileText, ChevronRight } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyMap from "@/components/property-map";
import { notFound } from "next/navigation";
import AgentImage from "@/components/agent-image";
import { PropertyGallery } from "@/components/property-gallery";
import { cn } from "@/lib/cn";

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

    const heroImage = property.images[0] || "/images/hero1.avif";

    return (
        <div className="w-full bg-background min-h-screen flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            {/* Parallax Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                
                <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 md:px-8 max-w-7xl mx-auto text-white">
                    <Link href="/properties" className="inline-flex w-fit items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Listings</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                    property.forSale?.toLowerCase().includes('sale') ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                                )}>
                                    {property.forSale || property.status}
                                </span>
                                {property.mlsNumber && (
                                    <span className="text-white/70 text-sm font-mono bg-black/30 px-2 py-1 rounded">
                                        MLS# {property.mlsNumber}
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 font-display text-shadow-sm">
                                {formatPrice(property.price)}
                            </h1>
                            
                            <div className="flex items-center gap-2 text-white/90 text-lg md:text-xl font-light">
                                <MapPin className="w-5 h-5 flex-shrink-0 text-white/80" />
                                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-8">
                           <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] border border-white/20">
                                <span className="text-2xl font-bold">{property.beds}</span>
                                <span className="text-xs uppercase tracking-wider text-white/80">Beds</span>
                           </div>
                           <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] border border-white/20">
                                <span className="text-2xl font-bold">{property.baths}</span>
                                <span className="text-xs uppercase tracking-wider text-white/80">Baths</span>
                           </div>
                           <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/20">
                                <span className="text-2xl font-bold">{formatNumber(property.sqft)}</span>
                                <span className="text-xs uppercase tracking-wider text-white/80">SqFt</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full bg-slate-50/50">
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* LEFT COLUMN (Details) */}
                        <div className="lg:col-span-8 space-y-10">
                            
                            {/* Gallery Preview */}
                            <section>
                                 <h2 className="sr-only">Photos</h2>
                                 <PropertyGallery 
                                    images={property.images} 
                                    openHouse={property.openHouse}
                                    address={property.address}
                                />
                            </section>

                            {/* Key Features Grid */}
                            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Grid className="w-5 h-5 text-primary" />
                                    Property Overview
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                                     <DetailItem label="Property Type" value={property.propertyType} />
                                     <DetailItem label="Subtype" value={property.propertySubType} />
                                     <DetailItem label="Year Built" value={property.yearBuilt} />
                                     <DetailItem label="Stories" value={property.stories} />
                                     <DetailItem label="Lot Size" value={property.acres ? `${property.acres} Acres` : undefined} />
                                     <DetailItem label="Living Areas" value={property.livingAreas} />
                                     <DetailItem label="Dining Areas" value={property.diningAreas} />
                                     <DetailItem label="Fireplaces" value={property.fireplaces} />
                                     <DetailItem label="Garage Spaces" value={property.garageSpaces} />
                                     <DetailItem label="Carport Spaces" value={property.carportSpaces} />
                                     <DetailItem label="Covered Spaces" value={property.coveredSpaces} />
                                     <DetailItem label="Garage Size" value={property.garageSize} />
                                     <DetailItem label="HOA Type" value={property.hoaType} />
                                     <DetailItem label="HOA" value={property.hoa ? `$${property.hoa}/yr` : undefined} />
                                     <DetailItem label="Price / SqFt" value={property.pricePerSqft ? `$${property.pricePerSqft}` : undefined} />
                                     <DetailItem label="Days on Market" value={getDaysOnMarketLabel(property.listingDate)} />
                                </div>
                            </section>

                            {/* Description */}
                            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    About this home
                                </h3>
                                <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {property.description || "No description provided."}
                                </div>

                                {property.features && property.features.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {property.features.map(f => (
                                                <span key={f} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Interior & Details Accordion/Grid */}
                            <section className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900">Details & Amenities</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* General Info */}
                                    <DetailCard title="General Information" icon={FileText}>
                                        <DetailRow label="Subdivision" value={property.subdivision} />
                                        <DetailRow label="County" value={property.county} />
                                        <DetailRow label="Parcel Number" value={property.parcelNumber} />
                                        <DetailRow label="Tax Lot" value={property.taxLot} />
                                        <DetailRow label="Tax Block" value={property.taxBlock} />
                                        <DetailRow label="Tax Legal Desc" value={property.taxLegalDescription} fullWidth />
                                        <DetailRow label="Multi Parcel ID" value={property.multiParcelIdYn} />
                                        <DetailRow label="MUD District" value={property.municipalUtilityDistrictYn} />
                                        <DetailRow label="Accessibility Features" value={property.accessibilityFeaturesYn} />
                                    </DetailCard>

                                    {/* Lease / Financial */}
                                    <DetailCard title="Financial & Lease" icon={DollarSign}>
                                        <DetailRow label="Original List Price" value={property.originalListPrice ? formatPrice(property.originalListPrice) : undefined} />
                                        <DetailRow label="For Sale" value={property.forSale} />
                                        <DetailRow label="Available Date" value={property.availableDate} />
                                        <DetailRow label="Deposit Amount" value={property.depositAmount ? formatPrice(property.depositAmount) : undefined} />
                                        <DetailRow label="Application Fee" value={property.applicationFee ? formatPrice(property.applicationFee) : undefined} />
                                        <DetailRow label="Pet Deposit" value={property.petDeposit ? formatPrice(property.petDeposit) : undefined} />
                                        <DetailRow label="Monthly Pet Fee" value={property.monthlyPetFee ? formatPrice(property.monthlyPetFee) : undefined} />
                                        <DetailRow label="# Pets Allowed" value={property.petsAllowed?.toString()} />
                                        <DetailRow label="Non-Refundable Pet Fee" value={property.nonRefundablePetFeeYn} />
                                        <DetailRow label="# Vehicles" value={property.numVehicles?.toString()} />
                                        <DetailRow label="# Days Guests Allowed" value={property.daysGuestsAllowed?.toString()} />
                                        <DetailRow label="Furnished" value={property.furnishedYn} />
                                        <DetailRow label="Appliances Included" value={property.appliancesYn} />
                                        <DetailRow label="Monies Required" value={property.moniesRequired} fullWidth />
                                        <DetailRow label="Tenant Pays" value={property.tenantPays?.join(', ')} fullWidth />
                                    </DetailCard>

                                    {/* Green / Energy */}
                                    {(property.greenType || property.greenStatus) && (
                                        <DetailCard title="Green Energy" icon={TreeDeciduous}>
                                            <DetailRow label="Green Features" value={property.greenType} />
                                            <DetailRow label="Certification" value={property.greenStatus} />
                                        </DetailCard>
                                    )}

                                    {/* Interior / Utilities */}
                                    <DetailCard title="Interior & Utilities" icon={Home}>
                                         <DetailRow label="Heating" value={property.heating} />
                                         <DetailRow label="Cooling" value={property.cooling} />
                                         <DetailRow label="Flooring" value={property.flooring} />
                                         <DetailRow label="Fireplace Features" value={property.fireplaceFeatures} />
                                         <DetailRow label="Architectural Style" value={property.architecturalStyle} />
                                         <DetailRow label="Housing Type" value={property.housingType} />
                                         <DetailRow label="Security Features" value={property.securityFeatures?.join(', ')} fullWidth />
                                         <DetailRow label="Other Equipment" value={property.otherEquipment?.join(', ')} fullWidth />
                                         <DetailRow label="Accessibility Features" value={property.accessibilityFeatures?.join(', ')} fullWidth />
                                    </DetailCard>

                                    {/* Exterior Features */}
                                    <DetailCard title="Exterior & Construction" icon={Car}>
                                        <DetailRow label="Construction" value={property.constructionMaterials?.join(', ')} fullWidth />
                                        <DetailRow label="Exterior" value={property.exteriorFeatures?.join(', ')} fullWidth />
                                        <DetailRow label="Fencing" value={property.fencing?.join(', ')} />
                                        <DetailRow label="Pool Features" value={property.poolFeatures?.join(', ')} />
                                        <DetailRow label="Parking Features" value={property.parkingFeatures?.join(', ')} fullWidth />
                                        <DetailRow label="Waterfront" value={property.waterfrontYn} />
                                        <DetailRow label="Lake Pump" value={property.lakePumpYn} />
                                    </DetailCard>
                                </div>
                            </section>

                            {/* Rooms */}
                            {property.rooms && property.rooms.length > 0 && (
                                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Grid className="w-5 h-5 text-primary" />
                                        Room Dimensions
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {property.rooms.map((room, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                                                <span className="font-semibold text-slate-700">{room.type}</span>
                                                <span className="text-slate-500 text-sm mt-1">{room.dimensions}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            
                            {/* Schools */}
                            {property.schools && (
                                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <School className="w-5 h-5 text-primary" />
                                        Schools & Education
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(property.schools).map(([key, value]) => {
                                            if (!value) return null;
                                            return (
                                                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                                    <span className="capitalize text-muted-foreground mr-4">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span className="font-medium text-slate-900">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                        </div>

                        {/* RIGHT COLUMN (Sticky Sidebar) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24 space-y-6">
                                {/* Agent / Contact Card */}
                                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transform transition hover:-translate-y-1 duration-300">
                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                                                {property.agentName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Listing Agent</div>
                                                <div className="text-lg font-bold text-slate-900">{property.agentName}</div>
                                                <div className="text-sm text-slate-500">{property.agentCompany}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {property.agentPhone && (
                                                <a href={`tel:${property.agentPhone}`} className="flex items-center justify-center w-full gap-2 bg-white border border-slate-200 hover:border-primary text-slate-700 hover:text-primary py-3 rounded-xl font-medium transition shadow-sm">
                                                    <Phone className="w-4 h-4" />
                                                    {property.agentPhone}
                                                </a>
                                            )}
                                        </div>

                                        <Link href="/contact" className="w-full">
                                            <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20 rounded-xl" size="lg">
                                                Request a Private Tour
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            Interested in this property? Contact us today to schedule a viewing.
                                        </p>
                                    </div>
                                </div>

                                {/* Map Widget */}
                                <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 h-64 relative group">
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none">
                                        <div className="text-white font-medium flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> View Map Location
                                        </div>
                                    </div>
                                    <PropertyMap 
                                        address={property.address}
                                        city={property.city}
                                        state={property.state}
                                        zipCode={property.zipCode}
                                    />
                                </div>

                                {/* Directions Preview */}
                                {(property.directions || property.publicDrivingDirections) && (
                                     <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                                        <h3 className="font-semibold mb-3">Location & Directions</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-4">
                                            {property.directions || property.publicDrivingDirections}
                                        </p>
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

// Helper Components

function DetailItem({ label, value }: { label: string, value?: string | number }) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
            <span className="font-semibold text-slate-800 break-words">{value}</span>
        </div>
    );
}

function DetailCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    // Check if children yields anything content-wise works typically by falsy checks on values
    // But react children are opaque. We assume parent checks availability.
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <Icon className="w-5 h-5 text-slate-400" />
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function DetailRow({ label, value, fullWidth = false }: { label: string, value?: string, fullWidth?: boolean }) {
    if (!value) return null;
    return (
        <div className={cn("flex flex-col py-2 border-b border-slate-50 last:border-0", !fullWidth && "sm:flex-row sm:justify-between sm:items-center")}>
            <span className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</span>
            <span className={cn("font-medium text-slate-900", fullWidth && "text-sm mt-1")}>{value}</span>
        </div>
    );
}

function getDaysOnMarketLabel(listingDate: string) {
    const raw = (listingDate || "").trim();
    if (!raw) return "New";
    if (/^new$/i.test(raw)) return "New";

    const start = new Date(raw);
    if (Number.isNaN(start.getTime())) return "New";

    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (!Number.isFinite(diff) || diff <= 0) return "New";
    return `${diff} Days`;
}
