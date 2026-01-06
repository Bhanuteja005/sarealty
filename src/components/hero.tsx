import Image from "next/image";
import Link from "next/link";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import { Button } from "./ui/button";
import { Search } from 'lucide-react';
import SectionBadge from "./ui/section-badge";

const Hero = () => {

    return (
        <Wrapper className="pt-20 lg:pt-32 relative min-h-[65vh] w-full h-auto flex-1">
            <div className="flex flex-col lg:flex-row w-full h-auto lg:gap-16">
                <div className="flex flex-col items-start gap-10 py-8 w-full">
                    <div className="flex flex-col items-start gap-4">
                        <AnimationContainer animation="fadeUp" delay={0.2}>
                            <SectionBadge title="Real Estate Agent" />
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.4}>
                            <h1 className="text-5xl lg:text-6xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-neutral-500">
                                A New Era in Real Estate
                            </h1>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.6}>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                                Discover exceptional properties with personalized service that redefines luxury living
                            </p>
                        </AnimationContainer>
                    </div>

                    <AnimationContainer animation="fadeUp" delay={0.8}>
                        <div className="w-full">
                            <Link href="/contact">
                                <Button size="md" className="w-full md:w-auto">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={1}>
                        <div className="flex flex-col items-start gap-4 py-4">
                            <p className="text-sm md:text-base text-muted-foreground">
                                Search properties
                            </p>
                            <div className="w-full relative max-w-[calc(100vw-2rem)] lg:max-w-[1000px] h-16 mx-auto group overflow-hidden p-2">
                                <form action="/search" method="get" className="w-full h-full flex items-center gap-3 min-w-0">
                                    <input
                                        name="q"
                                        aria-label="Search properties"
                                        placeholder="Search properties, city, or keyword"
                                        className="flex-[2] min-w-0 bg-white border border-gray-300 rounded-lg px-4 h-10 md:h-12 text-sm"
                                    />

                                    <input
                                        name="location"
                                        aria-label="Location"
                                        placeholder="Location (city or ZIP)"
                                        className="flex-1 min-w-0 bg-white border border-gray-300 rounded-lg px-4 h-10 md:h-12 text-sm"
                                    />

                                    <button
                                        type="submit"
                                        className="w-36 h-full inline-flex items-center justify-center bg-orange-500 text-white rounded-lg px-4 text-sm font-medium hover:opacity-95"
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        <span>Search</span>
                                    </button>
                                </form>

                                <div className="pointer-events-none absolute inset-y-0 -right-1 w-1/3 bg-gradient-to-l from-background to-transparent z-40"></div>
                            </div>
                        </div>
                    </AnimationContainer>
                </div>

                <AnimationContainer animation="fadeRight" delay={0.4}>
                    <div className="flex flex-col items-start justify-start w-full h-min relative overflow-visible">
                        <div className="w-full lg:w-[1000px] lg:max-h-[560px] relative">
                            <div className="pointer-events-none hidden lg:block absolute inset-y-0 right-1/4 w-1/3 h-3/4 bg-gradient-to-l from-background to-transparent z-50"></div>
                            <div className="lg:absolute lg:inset-0">
                                <Image
                                    src="/images/dashboards.png"
                                    alt="hero"
                                    sizes="1000px"
                                    width={1024}
                                    height={1024}
                                    className="object-contain min-w-full max-h-[560px] rounded-xl lg:rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
            </div>
            <AnimationContainer animation="scaleUp" delay={1.2} className="absolute w-1/2 h-auto -top-[4%] left-1/4 -z-10">
                <Image
                    src="/images/hero-gradient.svg"
                    alt="hero"
                    width={1024}
                    height={1024}
                    className="object-cover w-full h-auto"
                />
            </AnimationContainer>
        </Wrapper>
    )
};

export default Hero
