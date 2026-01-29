import Image from "next/image";
import Link from "next/link";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import { Button } from "./ui/button";
import SectionBadge from "./ui/section-badge";
import HeroSearch from "./hero-search";

const Hero = () => {

    return (
        <Wrapper className="pt-12 lg:pt-12 relative min-h-[65vh] w-full h-auto flex-1 pb-52 lg:pb-54">
            <div className="flex flex-col lg:flex-row w-full h-auto items-center justify-between">
                <div className="flex flex-col items-start gap-10 py-8 w-full lg:w-[40%] z-20">
                    <div className="flex flex-col items-start gap-10 w-full">
                        <AnimationContainer animation="fadeUp" delay={0.2}>
                            <SectionBadge title="Real Estate Agent" />
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.4}>
                            <h1 className="text-5xl lg:text-7xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-neutral-500">
                                A New Era in Real Estate
                            </h1>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.6}>
                            <p className="text-sm md:text-base lg:text-xl text-muted-foreground">
                                Discover exceptional properties with personalized service that redefines luxury living
                            </p>
                        </AnimationContainer>
                    </div>

                    <AnimationContainer animation="fadeUp" delay={0.8} className="w-full">
                        <div className="flex flex-col gap-8 w-full">
                            <div>
                                <Link href="/contact">
                                    <Button size="lg" className="w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-col items-start gap-4">
                                <HeroSearch />
                            </div>
                        </div>
                    </AnimationContainer>
                </div>

                <AnimationContainer animation="fadeRight" delay={0.4} className="w-full lg:w-[65%] lg:-mr-[40%] relative z-10 transition-all duration-500">
                    <div className="flex flex-col items-start justify-start w-full h-min relative overflow-visible">
                        <div className="w-full relative aspect-square lg:aspect-auto lg:h-[600px]">
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/hero.jpeg"
                                    alt="hero"
                                    fill
                                    className="w-full h-full object-cover lg:object-left rounded-xl lg:rounded-2xl shadow-2xl"
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
