"use client";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AnimationContainer from "./global/animation-container";
import Icons from "./global/icons";
import Wrapper from "./global/wrapper";

const Navbar = () => {

    const [visible, setVisible] = useState<boolean>(false);

    const { scrollY } = useScroll({
        offset: ["start start", "end start"],
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <header className="fixed w-full top-0 inset-x-0 z-50">
            {/* Desktop */}
            <motion.div
                animate={{
                    width: visible ? "40%" : "100%",
                    y: visible ? 20 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 40,
                }}
                style={{
                    minWidth: "800px",
                }}
                className={cn(
                    "hidden lg:flex bg-transparent self-start items-center justify-between py-4 rounded-full relative z-[50] mx-auto w-full backdrop-blur",
                    visible && "bg-background/60 py-2 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 w-full"
                )}
            >
                <Wrapper className="flex items-center justify-between lg:px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center gap-0">
                                <Image src="/images/logo.png" alt="SA Realty" width={50} height={28} className="object-contain" />
                                <div className="hidden sm:block w-px h-6 bg-border" />
                                <Image src="/images/re.webp" alt="SA Realty secondary" width={88} height={20} className="hidden sm:block w-20 h-5 object-contain" />
                            </div>
                        </Link>
                    </motion.div>

                    <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-sm text-muted-foreground font-medium">
                        <AnimatePresence>
                            {NAV_LINKS.map((link, index) => (
                                <AnimationContainer
                                    key={index}
                                    animation="fadeDown"
                                    delay={0.1 * index}
                                >
                                    <div className="relative">
                                        <Link href={link.link} className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">
                                            {link.name}
                                        </Link>
                                    </div>
                                </AnimationContainer>
                            ))}
                        </AnimatePresence>
                    </div>

                    <AnimationContainer animation="fadeLeft" delay={0.1}>
                        <div className="flex items-center gap-x-4">
                            <Link href="/contact">
                                <Button size="sm">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </AnimationContainer>
                </Wrapper>
            </motion.div>

            {/* Mobile - show links directly (no hamburger) */}
            <motion.div
                animate={{
                    y: visible ? 20 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 50,
                }}
                className={cn(
                    "flex relative flex-row lg:hidden w-full items-center mx-auto py-3 z-50",
                    visible && "bg-white w-11/12 border rounded-full shadow-md"
                )}
            >
                <Wrapper className="flex items-center justify-between lg:px-4 w-full">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Image src="/images/logo.png" alt="SA Realty" width={36} height={20} className="object-contain" />
                        </Link>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        {NAV_LINKS.map((navItem, idx) => (
                            <Link key={idx} href={navItem.link} className="hover:text-foreground px-2 py-1 rounded-md">
                                {navItem.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center">
                        <Link href="/contact">
                            <Button size="sm">Contact Us</Button>
                        </Link>
                    </div>
                </Wrapper>
            </motion.div>
        </header>
    );
};

export default Navbar;
