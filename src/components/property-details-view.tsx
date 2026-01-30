"use client";

import { motion } from "framer-motion";
import { Bed, Bath, Ruler, MapPin, Calendar, Phone, Share, ArrowLeft, CheckCircle2, Car, Home, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import AgentImage from "@/components/agent-image";
import { PropertyGallery } from "@/components/property-gallery";
import PropertyMap from "@/components/property-map";
import { formatPrice, formatNumber, type Property } from "@/lib/mls-api";

interface PropertyDetailsViewProps {
    property: Property;
}

export default function PropertyDetailsView({ property }: PropertyDetailsViewProps) {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="w-full bg-background min-h-screen">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Properties
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share className="w-4 h-4" /> Share
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Phone className="w-4 h-4" /> Contact Agent
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-6 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    
                    {/* Gallery Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                    >
                        <PropertyGallery 
                            images={property.images} 
                            openHouse={property.openHouse}
                            address={property.address}
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-10">
                            
                            {/* Header Info */}
                            <motion.div 
                                variants={fadeIn}
                                initial="initial"
                                animate="animate"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {property.status === 'Active' && (
                                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none py-1 px-3">
                                                    Active
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="py-1 px-3 border-primary/20 text-primary bg-primary/5">
                                                {property.propertyType}
                                            </Badge>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 mt-2 tracking-tight">
                                            {property.address}
                                        </h1>
                                        <div className="flex items-center gap-2 text-lg text-muted-foreground">
                                            <MapPin className="w-5 h-5 flex-shrink-0" />
                                            <span>
                                                {property.city}, {property.state} {property.zipCode}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end">
                                        <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                                            {formatPrice(property.price)}
                                        </div>
                                        {property.pricePerSqft && (
                                            <div className="text-lg text-muted-foreground mt-1">
                                                ${property.pricePerSqft} / sqft
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <span className="text-3xl font-bold mb-1">{property.beds}</span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                            <Bed className="w-5 h-5" /> Beds
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <span className="text-3xl font-bold mb-1">{property.baths}</span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                            <Bath className="w-5 h-5" /> Baths
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <span className="text-3xl font-bold mb-1">{formatNumber(property.sqft)}</span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                            <Ruler className="w-5 h-5" /> SqFt
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.section 
                                variants={fadeIn}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <h2 className="text-2xl font-bold mb-4 font-serif">About this home</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                                    {property.description}
                                </p>
                            </motion.section>

                            {/* Facts & Features */}
                            <motion.section 
                                variants={fadeIn}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <h2 className="text-2xl font-bold mb-6 font-serif">Facts & Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {[
                                        { label: "Type", value: property.propertyType, icon: Home },
                                        { label: "Year Built", value: property.yearBuilt, icon: Calendar },
                                        { label: "Lot Size", value: property.acres ? `${property.acres} Acres` : null, icon: CheckCircle2 },
                                        { label: "Parking", value: property.parking ? `${property.parking} Spaces` : null, icon: Car },
                                        { label: "HOA", value: property.hoa ? `$${property.hoa}/mo` : null, icon: DollarSign },
                                        { label: "Price/Sqft", value: property.pricePerSqft ? `$${property.pricePerSqft}` : null, icon: DollarSign },
                                    ].map((item, i) => item.value && (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-border/50">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="font-semibold text-foreground">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {property.features.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="font-semibold mb-4 text-lg">Interior Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {property.features.map((feature, index) => (
                                                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-secondary/50 font-normal">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.section>

                            {/* Map */}
                            <motion.section 
                                variants={fadeIn}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <h2 className="text-2xl font-bold mb-6 font-serif">Location</h2>
                                <div className="rounded-xl overflow-hidden border border-border shadow-md h-[400px]">
                                    <PropertyMap 
                                        address={property.address}
                                        city={property.city}
                                        state={property.state}
                                        zipCode={property.zipCode}
                                    />
                                </div>
                            </motion.section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                {/* Agent Contact Card */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="bg-card border border-border rounded-2xl p-6 shadow-xl"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                                            <AgentImage 
                                                src="/images/dp.jpg" 
                                                alt={property.agentName} 
                                                fallbackInitial={property.agentName.charAt(0)}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{property.agentName}</div>
                                            <div className="text-sm text-primary font-medium">Listing Agent</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">SA Realty</div>
                                        </div>
                                    </div>

                                    <form className="space-y-4">
                                        <input 
                                            placeholder="Name" 
                                            className="w-full h-10 px-3 bg-secondary/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        <input 
                                            placeholder="Email" 
                                            className="w-full h-10 px-3 bg-secondary/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        <input 
                                            placeholder="Phone" 
                                            className="w-full h-10 px-3 bg-secondary/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        <textarea 
                                            placeholder="I am interested in this property..." 
                                            rows={3}
                                            defaultValue={`I am interested in ${property.address}.`}
                                            className="w-full px-3 py-2 bg-secondary/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        />
                                        <Button className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20">
                                            Request Information
                                        </Button>
                                    </form>

                                    <div className="mt-4 pt-4 border-t border-border/50 text-center">
                                        <a href={`tel:${property.agentPhone}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                            {property.agentPhone}
                                        </a>
                                    </div>
                                </motion.div>

                                {/* Open House Card */}
                                {property.openHouse && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <Calendar className="w-24 h-24" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-1 relative z-10">Open House</h3>
                                        <p className="text-primary-foreground/80 text-sm mb-4 relative z-10">Don't miss out on this opportunity!</p>
                                        
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 relative z-10 border border-white/20">
                                            <div className="font-semibold">{property.openHouse.date}</div>
                                            <div className="text-sm opacity-90">
                                                {property.openHouse.startTime} - {property.openHouse.endTime}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
