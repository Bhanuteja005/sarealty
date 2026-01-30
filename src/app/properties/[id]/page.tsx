import { getPropertyById, formatPrice, formatNumber, type Property } from "@/lib/mls-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropertyDescription } from "@/components/property-description";
import { ExpandablePanel } from "@/components/expandable-panel";
import { Bed, Bath, Ruler, MapPin, Calendar, Phone, Mail, Home, Car, DollarSign, Share, ArrowLeft, Check, Grid, Info, TreeDeciduous, School, FileText, ChevronRight, Armchair, Shield, Thermometer, Zap, GraduationCap, BookOpen } from "lucide-react";
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
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Gallery Preview */}
                            <section>
                                 <h2 className="sr-only">Photos</h2>
                                 <PropertyGallery 
                                    images={property.images} 
                                    openHouse={property.openHouse}
                                    address={property.address}
                                />
                            </section>

                            {/* Description - "What's special" */}
                            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-2xl font-bold mb-6 text-slate-900">
                                    What&apos;s special
                                </h3>
                                
                                {property.features && property.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {property.features.slice(0, 4).map(f => (
                                            <span key={f} className="inline-flex items-center px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <PropertyDescription description={property.description || "No description provided."} />
                            </section>

                            {/* Location / Map (Moved from Sidebar) */}
                            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-100">
                                    <h3 className="text-2xl font-bold text-slate-900">Location</h3>
                                    <p className="text-slate-500 mt-1">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
                                </div>
                                <div className="h-[400px] w-full relative group">
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
                                {(property.directions || property.publicDrivingDirections) && (
                                     <div className="p-6 bg-slate-50 border-t border-slate-100">
                                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-slate-700">Directions</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {property.directions || property.publicDrivingDirections}
                                        </p>
                                     </div>
                                )}
                            </section>

                            {/* Mobile Only: Agent/Contact Card (After Location) */}
                            <div className="lg:hidden">
                                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
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
                            </div>

                            {/* Facts & features */}
                            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Facts & features</h3>
                                
                                <ExpandablePanel initialHeight={600} label="Show more">
                                    <div className="space-y-10">
                                    
                                    {/* Interior */}
                                    <div>
                                        <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-slate-50">
                                            Interior
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <DetailBox title="Bedrooms & bathrooms">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Bedrooms: {property.beds}</li>
                                                    <li>Bathrooms: {property.baths}</li>
                                                    {property.stories && <li>Stories: {property.stories}</li>}
                                                </ul>
                                            </DetailBox>

                                            <DetailBox title="Heating & Cooling">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Heating: {property.heating || "Contact Agent"}</li>
                                                    <li>Cooling: {property.cooling || "Contact Agent"}</li>
                                                    {property.fireplaceFeatures && <li>Fireplace: {property.fireplaceFeatures}</li>}
                                                    {property.fireplaces && <li>Desc: {property.fireplaces}</li>}
                                                </ul>
                                            </DetailBox>

                                            <DetailBox title="Interior Features">
                                                 <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    {property.flooring && <li>Flooring: {property.flooring}</li>}
                                                    {property.furnishedYn === 'Yes' && <li>Furnished</li>}
                                                    {property.appliancesYn === 'Yes' && <li>Appliances Included</li>}
                                                    {property.features && property.features.slice(4).map(f => (
                                                        <li key={f}>{f}</li>
                                                    ))}
                                                 </ul>
                                            </DetailBox>

                                            <DetailBox title="Rooms">
                                                 <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    {property.livingAreas && <li>Living Areas: {property.livingAreas}</li>}
                                                    {property.diningAreas && <li>Dining Areas: {property.diningAreas}</li>}
                                                 </ul>
                                            </DetailBox>
                                        </div>

                                        {property.rooms && property.rooms.length > 0 && (
                                            <div className="mt-8">
                                                <h5 className="font-semibold text-slate-900 mb-3">Room Dimensions</h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {property.rooms.map((room, i) => (
                                                        <div key={i} className="text-sm">
                                                            <span className="font-medium text-slate-900">{room.type}:</span> <span className="text-slate-600">{room.dimensions}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Exterior */}
                                    <div>
                                        <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-slate-50">
                                            Exterior
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <DetailBox title="Property">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Type: {property.propertyType}</li>
                                                    <li>Subtype: {property.propertySubType}</li>
                                                    <li>Year Built: {property.yearBuilt}</li>
                                                    {property.architecturalStyle && <li>Style: {property.architecturalStyle}</li>}
                                                    {property.waterfrontYn === 'Yes' && <li>Waterfront Property</li>}
                                                </ul>
                                            </DetailBox>

                                            <DetailBox title="Lot & Construction">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    {property.acres && <li>Lot Size: {property.acres} Acres</li>}
                                                    {property.constructionMaterials && <li>Construction: {property.constructionMaterials.join(', ')}</li>}
                                                    {property.foundationDetails && <li>Foundation: {property.foundationDetails}</li>}
                                                    {property.roof && <li>Roof: {property.roof}</li>}
                                                </ul>
                                            </DetailBox>

                                            <DetailBox title="Parking">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    {property.garageSpaces && <li>Garage Spaces: {property.garageSpaces}</li>}
                                                    {property.carportSpaces && <li>Carport Spaces: {property.carportSpaces}</li>}
                                                    {property.coveredSpaces && <li>Covered Spaces: {property.coveredSpaces}</li>}
                                                    {property.garageSize && <li>Garage Size: {property.garageSize}</li>}
                                                    {property.parkingFeatures && property.parkingFeatures.map(f => (
                                                        <li key={f}>{f}</li>
                                                    ))}
                                                </ul>
                                            </DetailBox>
                                            
                                            <DetailBox title="Exterior Features">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    {property.exteriorFeatures && property.exteriorFeatures.map(f => (
                                                        <li key={f}>{f}</li>
                                                    ))}
                                                    {property.poolFeatures && property.poolFeatures.map(f => (
                                                        <li key={f}>{f}</li>
                                                    ))}
                                                    {property.fencing && property.fencing.map(f => (
                                                        <li key={f}>{f}</li>
                                                    ))}
                                                </ul>
                                            </DetailBox>
                                        </div>
                                    </div>

                                    {/* Financial & Lease */}
                                    <div>
                                        <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-slate-50">
                                            Financial & Lease
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <DetailBox title="Financial">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Days on Market: {getDaysOnMarketLabel(property.listingDate)}</li>
                                                    <li>For Sale: {property.forSale}</li>
                                                    {property.originalListPrice && <li>Original Price: {formatPrice(property.originalListPrice)}</li>}
                                                    {property.pricePerSqft && <li>Price/SqFt: ${property.pricePerSqft}</li>}
                                                    {property.hoa && <li>HOA: ${property.hoa}/yr</li>}
                                                    {property.hoaType && <li>HOA Type: {property.hoaType}</li>}
                                                </ul>
                                            </DetailBox>

                                            <DetailBox title="Lease Details">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                     <li>Available: {property.availableDate || "Contact Agent"}</li>
                                                     {property.depositAmount && <li>Deposit: {formatPrice(property.depositAmount)}</li>}
                                                     {property.applicationFee && <li>App Fee: {formatPrice(property.applicationFee)}</li>}
                                                     {property.tenantPays && <li>Tenant Pays: {property.tenantPays.join(', ')}</li>}
                                                     {property.moniesRequired && <li>Monies Required: {property.moniesRequired}</li>}
                                                </ul>
                                            </DetailBox>
                                            
                                            <DetailBox title="Pet Policy">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                     {property.petsAllowed !== undefined && <li>Pets Allowed: {property.petsAllowed}</li>}
                                                     {property.petDeposit && <li>Pet Deposit: {formatPrice(property.petDeposit)}</li>}
                                                     {property.monthlyPetFee && <li>Monthly Pet Fee: {formatPrice(property.monthlyPetFee)}</li>}
                                                     {property.nonRefundablePetFeeYn === 'Yes' && <li>Non-Refundable Pet Fee</li>}
                                                </ul>
                                            </DetailBox>
                                        </div>
                                    </div>
                                    
                                    {/* General Information */}
                                    <div>
                                        <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-slate-50">
                                            General Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <DetailBox title="Location">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Subdivision: {property.subdivision}</li>
                                                    <li>County: {property.county}</li>
                                                    <li>City: {property.city}</li>
                                                    <li>Zip: {property.zipCode}</li>
                                                </ul>
                                            </DetailBox>
                                            
                                            <DetailBox title="Tax & Legal">
                                                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                    <li>Parcel Number: {property.parcelNumber}</li>
                                                    <li>Tax Lot: {property.taxLot}</li>
                                                    <li>Tax Block: {property.taxBlock}</li>
                                                    {property.municipalUtilityDistrictYn === 'Yes' && <li>MUD District</li>}
                                                </ul>
                                            </DetailBox>
                                            
                                            {property.accessibilityFeaturesYn === 'Yes' && (
                                                <DetailBox title="Accessibility">
                                                    <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                                                        <li>Accessible Features Available</li>
                                                        {property.accessibilityFeatures && property.accessibilityFeatures.map(f => (
                                                            <li key={f}>{f}</li>
                                                        ))}
                                                    </ul>
                                                </DetailBox>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                </ExpandablePanel>
                            </section>

                            {/* Schools */}
                            {property.schools && (
                                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                                        Schools
                                    </h3>
                                    
                                    <h4 className="text-lg font-bold text-slate-900 mb-6">Schools provided by the listing agent</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Left Side: School List */}
                                        <div className="md:col-span-2 space-y-6">
                                            {Object.entries(property.schools).map(([key, value]) => {
                                                if (!value || key === 'district') return null;
                                                
                                                const levelLabel = key.replace(/([A-Z])/g, ' $1').trim();
                                                let Icon = School;
                                                if (key.includes('High')) Icon = GraduationCap;
                                                if (key.includes('Elementary')) Icon = BookOpen;
                                                
                                                return (
                                                    <div key={key} className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-primary shadow-lg shadow-primary/30 shrink-0 ring-4 ring-primary/10">
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-lg text-slate-900 hover:text-primary transition-colors cursor-pointer">
                                                                {value}
                                                            </h5>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500 mt-1 font-medium">
                                                                <span className="text-primary">{levelLabel}</span>
                                                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span>Grades: contact agent</span>
                                                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span>Distance: contact agent</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Right Side: Disclaimer & District */}
                                        <div className="md:col-span-1">
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full flex flex-col justify-between">
                                                <div>
                                                    <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <Info className="w-4 h-4 text-primary" />
                                                        School Information
                                                    </h5>
                                                    
                                                    {property.schools.district && (
                                                        <div className="mb-6">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                                                School District
                                                            </span>
                                                            <span className="font-semibold text-slate-900 text-lg">
                                                                {property.schools.district}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
                                                    School data provided by the listing agent/MLS. We recommend contacting the local school district to confirm school assignments for this home.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                        </div>

                        {/* RIGHT COLUMN (Sticky Sidebar) */}
                        <div className="lg:col-span-4 space-y-8 hidden lg:block">
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

function DetailBox({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="mb-2">
            <h5 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide">{title}</h5>
            {children}
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
