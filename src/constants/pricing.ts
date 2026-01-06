export type PlanFeature = {
    text: string;
    included: boolean;
};

export type Plan = {
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    features: PlanFeature[];
    popular?: boolean;
};

export const PRICING_PLANS: Plan[] = [
    {
        name: "Consultation",
        description: "Initial market assessment and guidance",
        price: {
            monthly: 0,
            yearly: 0,
        },
        features: [
            { text: "Market Analysis", included: true },
            { text: "Property Search Assistance", included: true },
            { text: "Basic Guidance", included: true },
            { text: "Email Support", included: true },
            { text: "Dedicated Agent", included: false },
            { text: "Full Transaction Support", included: false },
        ],
    },
    {
        name: "Full Service",
        description: "Complete brokerage representation",
        price: {
            monthly: 0,
            yearly: 0,
        },
        popular: true,
        features: [
            { text: "Dedicated Agent", included: true },
            { text: "Market Analysis", included: true },
            { text: "Property Search & Tours", included: true },
            { text: "Negotiation Support", included: true },
            { text: "Contract Review", included: true },
            { text: "Closing Coordination", included: true },
        ],
    },
    {
        name: "Premium Service",
        description: "Luxury real estate specialization",
        price: {
            monthly: 0,
            yearly: 0,
        },
        features: [
            { text: "Senior Agent Representation", included: true },
            { text: "Exclusive Property Access", included: true },
            { text: "Investment Analysis", included: true },
            { text: "24/7 Support", included: true },
            { text: "Custom Marketing", included: true },
            { text: "Relocation Services", included: true },
        ],
    },
];
