"use client";

interface PropertyMapProps {
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export default function PropertyMap({ address, city, state, zipCode }: PropertyMapProps) {
    // Create an encoded address for the map
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    // Use OpenStreetMap embed (free, no API key required)
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-97.5,32.5,-96.5,33.5&layer=mapnik&marker=32.75,-97.0`;
    
    // Use Google Maps embed (more accurate, uses address)
    const googleMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-semibold">Location</h2>
                <p className="text-sm text-muted-foreground mt-1">{fullAddress}</p>
            </div>
            <div className="relative w-full h-[300px]">
                <iframe
                    src={googleMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${fullAddress}`}
                    className="w-full h-full"
                />
            </div>
            <div className="p-4 bg-muted/50">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View larger map
                </a>
            </div>
        </div>
    );
}
