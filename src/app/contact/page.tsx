import React from 'react'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import ContactHero from '../../components/contact-hero'
import Wrapper from "../../components/global/wrapper"
import Container from "../../components/global/animation-container"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { UploadIcon } from "lucide-react"

const ContactForm = () => {
    return (
        <div className="w-full">
            <Navbar />

            <ContactHero />

            <div className="w-full pb-16 lg:pb-24 bg-background">
                <Wrapper>
                    <Container delay={0.1}>
                        <div className="flex flex-col lg:items-center lg:justify-center">
                            <h2 className="text-2xl lg:text-3xl font-semibold text-left lg:text-center">
                                Contact Us
                            </h2>
                        </div>
                    </Container>

                    <Container delay={0.2}>
                        <form className="max-w-3xl mx-auto w-full mt-10 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name*</Label>
                                    <Input id="firstName" placeholder="John" className="bg-card border-border/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name*</Label>
                                    <Input id="lastName" placeholder="Doe" className="bg-card border-border/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject*</Label>
                                <Input id="subject" placeholder="Type your subject here" className="bg-card border-border/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workEmail"> Email*</Label>
                                <Input id="workEmail" type="email" placeholder="johndoe@gmail.com" className="bg-card border-border/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">How can we help you?*</Label>
                                <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px] bg-card border-border/50 resize-none" />
                            </div>


                            <Button className="w-full">Submit</Button>
                        </form>
                    </Container>
                </Wrapper>
            </div>

            <Footer />
        </div>
    )
}

export default ContactForm