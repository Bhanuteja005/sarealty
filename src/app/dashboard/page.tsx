import { Button } from "@/components/ui/button";
import Link from "next/link";

const PropertiesPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-medium text-center">
                    Our Properties
                </h1>
                <p className="text-lg text-muted-foreground text-center max-w-2xl">
                    Explore our curated collection of exceptional homes, each offering distinctive character and timeless elegance
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline">
                        Back
                    </Button>
                    <Button>
                        Gallery View
                    </Button>
                    <Button>
                        List View
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default PropertiesPage
