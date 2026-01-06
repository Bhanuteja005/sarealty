export interface PerkItem {
    title: string;
    description: string;
    icon: string;
}

export const PERKS: PerkItem[] = [
    {
        title: "Dedicated Agent",
        description: "Work with experienced professionals committed to your success.",
        icon: "/icons/perk-one.svg"
    },
    {
        title: "Market Insights",
        description: "Access exclusive market data and trending analysis.",
        icon: "/icons/perk-two.svg"
    },
    {
        title: "Expert Negotiation",
        description: "Benefit from skilled negotiation for the best possible outcomes.",
        icon: "/icons/perk-three.svg"
    },
    {
        title: "Personalized Service",
        description: "Receive tailored guidance throughout your real estate journey.",
        icon: "/icons/perk-four.svg"
    }
]; 