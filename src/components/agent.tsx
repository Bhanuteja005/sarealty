import AnimationContainer from './global/animation-container';
import Wrapper from "./global/wrapper";
import SectionBadge from './ui/section-badge';
import { Button } from './ui/button';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const Agent = () => {
    return (
        <Wrapper className="py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <AnimationContainer animation="fadeRight" delay={0.2}>
                    <div className="w-full flex items-center justify-center">
                        <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                            <Image src="/images/dp.png" alt="Sajitha" fill className="object-cover" />
                        </div>
                    </div>
                </AnimationContainer>

                <div className="w-full max-w-xl">
                    <div className="flex flex-col items-center justify-center w-full z-30 text-center">
                        <AnimationContainer animation="fadeUp" delay={0.25}>
                            <SectionBadge title="Meet Your Agent" />
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.35}>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold !leading-tight mt-2">
                                Sajitha
                            </h2>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.45}>
                            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mt-4">
                                With over a decade of experience in real estate, I build relationships on trust and deliver exceptional, personalized results. I combine deep local market knowledge with tailored strategies to help you find your ideal home or maximize your property's value.
                            </p>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.6}>
                            <div className="mt-4">
                                <div className="rounded-full px-4 py-2.5 bg-card flex items-center justify-center gap-4 border border-border">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        <span className="text-sm text-foreground">Personalized service • Local expertise</span>
                                    </div>
                                </div>
                            </div>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.8}>
                            <Button size="lg" className="mt-6 shadow-md">Get in Touch</Button>
                        </AnimationContainer>
                    </div>

                    <AnimationContainer animation="fadeUp" delay={0.95}>
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                            <div className="p-4 rounded-lg bg-card border border-border text-center">
                                <div className="text-xl font-semibold">10+</div>
                                <div className="text-sm text-muted-foreground">Years Experience</div>
                            </div>
                            <div className="p-4 rounded-lg bg-card border border-border text-center">
                                <div className="text-xl font-semibold">500+</div>
                                <div className="text-sm text-muted-foreground">Transactions</div>
                            </div>
                            <div className="p-4 rounded-lg bg-card border border-border text-center">
                                <div className="text-xl font-semibold">98%</div>
                                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                            </div>
                        </div>
                    </AnimationContainer>
                </div>
            </div>
        </Wrapper>
    );
};

export default Agent;