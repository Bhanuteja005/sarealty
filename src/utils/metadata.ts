import { Metadata } from "next";

export const generateMetadata = ({
    title = `SA Realty | Home`,
    description = `Experience exceptional real estate services with personalized guidance from SA Realty. Your trusted partner for buying, selling, and investing in premium properties.`,
    image = "/thumbnail.png",
    icons = [
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            url: "/images/logo.png"
        },
        {
            rel: "icon",
            sizes: "32x32",
            url: "/images/logo.png"
        },
        {
            rel: "icon",
            sizes: "16x16",
            url: "/images/logo.png"
        }
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    ...(noIndex && { robots: { index: false, follow: false } }),
});
