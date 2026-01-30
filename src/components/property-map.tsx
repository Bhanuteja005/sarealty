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
        <div className="w-full h-full bg-slate-100">
            <iframe
                src={googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${fullAddress}`}
                className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
        </div>
    );
}
