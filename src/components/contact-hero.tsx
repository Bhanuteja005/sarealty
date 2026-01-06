import React from 'react'
import Wrapper from './global/wrapper'
import AnimationContainer from './global/animation-container'
import Icons from './global/icons'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

import SectionBadge from "./ui/section-badge";
const CONTACT_CARDS = [
    { icon: Phone, title: 'Call Us', value: '+1 (123) 456-7890' },
    { icon: Mail, title: 'Email', value: 'contact@sarealty.com' },
    { icon: MapPin, title: 'Office', value: '123 Pine Avenue, Suite 500, NY 10001' },
];

const ContactHero = () => {
    return (
        <div className="relative w-full bg-white text-foreground">
            <div className="absolute -top-16 inset-x-0 -z-10 mx-auto w-3/4 h-44 lg:h-72 rounded-full blur-3xl opacity-80">
                <Image
                    src="/images/hero-gradient.svg"
                    alt="accent"
                    fill
                    className="object-cover opacity-60"
                />
            </div>

            <Wrapper className="py-20">
                <div className="flex flex-col items-center justify-center w-full z-10">
                    <AnimationContainer animation="fadeUp" delay={0.05}>
                        <AnimationContainer animation="fadeUp" delay={0.2}>
                    <SectionBadge title="Contact Us" />
                </AnimationContainer>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.15}>
                        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mt-6">
                            Let's Start a Conversation
                        </h2>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.25}>
                        <p className="text-base md:text-lg text-center text-muted-foreground max-w-3xl mx-auto mt-4">
                            Have questions or want to learn more? We're here to help. Reach out to our team and let's discuss how we can support your needs.
                        </p>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.35} className="w-full">
                        <div className="flex flex-col md:flex-row justify-center gap-6 w-full mt-10">
                            {CONTACT_CARDS.map((card, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-border shadow-sm w-full max-w-xs mx-auto"
                                >
                                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <card.icon className="size-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mt-4 text-foreground">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{card.value}</p>
                                </div>
                            ))}
                        </div>
                    </AnimationContainer>
                </div>
            </Wrapper>
        </div>
    )
}

export default ContactHero
