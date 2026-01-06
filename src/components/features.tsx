import { FEATURES } from '@/constants';
import Image from 'next/image';
import AnimationContainer from './global/animation-container';
import Wrapper from "./global/wrapper";
import SectionBadge from './ui/section-badge';

const Features = () => {
    return (
        <Wrapper className="py-20 lg:py-32">
            <div className="flex flex-col items-center text-center gap-4 mb-16">
                <AnimationContainer animation="fadeUp" delay={0.2}>
                    <SectionBadge title="Our Services" />
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.3}>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">
                        Exceptional real estate services
                    </h2>
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.4}>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover how SA Realty delivers personalized service and expert guidance for all your real estate needs.
                    </p>
                </AnimationContainer>
            </div>

            <div className="flex flex-col gap-6 px-1 md:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_.65fr] gap-6">
                    <AnimationContainer animation="fadeRight" delay={0.5}>
                        <div className="relative rounded-3xl bg-card overflow-hidden min-h-[400px] shadow-sm border border-border hover:shadow-lg hover:scale-[1.01] transition-transform">
                            <div className="relative p-8 flex flex-col justify-between">
                                <AnimationContainer animation="fadeUp" delay={0.6}>
                                    <div className="space-y-4">
                                        <h3 className="text-xl md:text-2xl font-medium">
                                            {FEATURES[0].title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                                            {FEATURES[0].description}
                                        </p>
                                    </div>
                                </AnimationContainer>
                                <AnimationContainer animation="fadeUp" delay={0.7}>
                                    <div className="relative h-60">
                                        <Image
                                            src={FEATURES[0].image}
                                            alt={FEATURES[0].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </AnimationContainer>
                            </div>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeLeft" delay={0.6}>
                        <div className="relative rounded-3xl bg-card overflow-hidden min-h-[400px] shadow-sm border border-border hover:shadow-lg hover:scale-[1.01] transition-transform">
                            <div className="relative p-8 flex flex-col justify-between">
                                <AnimationContainer animation="fadeUp" delay={0.7}>
                                    <div className="space-y-4">
                                        <h3 className="text-xl md:text-2xl font-medium">
                                            {FEATURES[1].title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                                            {FEATURES[1].description}
                                        </p>
                                    </div>
                                </AnimationContainer>
                                <AnimationContainer animation="fadeUp" delay={0.8}>
                                    <div className="relative h-48">
                                        <Image
                                            src={FEATURES[1].image}
                                            alt={FEATURES[1].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </AnimationContainer>
                            </div>
                        </div>
                    </AnimationContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[.65fr_1fr] gap-6">
                    <AnimationContainer animation="fadeRight" delay={0.7}>
                        <div className="relative rounded-3xl bg-card overflow-hidden min-h-[350px] shadow-sm border border-border hover:shadow-lg hover:scale-[1.01] transition-transform">
                            <div className="relative p-8 flex flex-col justify-between">
                                <AnimationContainer animation="fadeUp" delay={0.8}>
                                    <div className="space-y-4">
                                        <h3 className="text-xl md:text-2xl font-medium">
                                            {FEATURES[2].title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                                            {FEATURES[2].description}
                                        </p>
                                    </div>
                                </AnimationContainer>
                                <AnimationContainer animation="fadeUp" delay={0.9}>
                                    <div className="relative h-48">
                                        <Image
                                            src={FEATURES[2].image}
                                            alt={FEATURES[2].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </AnimationContainer>
                            </div>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeLeft" delay={0.8}>
                        <div className="relative rounded-3xl bg-card overflow-hidden min-h-[350px] shadow-sm border border-border hover:shadow-lg hover:scale-[1.01] transition-transform">
                            <div className="relative p-8 flex flex-col justify-between">
                                <AnimationContainer animation="fadeUp" delay={0.9}>
                                    <div className="space-y-4">
                                        <h3 className="text-xl md:text-2xl font-medium">
                                            {FEATURES[3].title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                                            {FEATURES[3].description}
                                        </p>
                                    </div>
                                </AnimationContainer>
                                <AnimationContainer animation="fadeUp" delay={1}>
                                    <div className="relative h-48">
                                        <Image
                                            src={FEATURES[3].image}
                                            alt={FEATURES[3].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </AnimationContainer>
                            </div>
                        </div>
                    </AnimationContainer>
                </div>
            </div>
        </Wrapper>
    );
};

export default Features;
