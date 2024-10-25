'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Edit, Send, Zap } from 'lucide-react'
import { redirect } from 'next/dist/server/api-utils'

export default function AboutPage() {
    const controls = useAnimation()
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
    }, [controls, inView])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const features = [
        { title: "AI-Powered Feedback", description: "Get instant, in-depth analysis of your personal statement.", icon: <Zap className="h-6 w-6" /> },
        { title: "Revision Tracking", description: "Monitor your progress with each draft.", icon: <Edit className="h-6 w-6" /> },
        { title: "Clarity Analysis", description: "Ensure your message is clear and impactful.", icon: <CheckCircle className="h-6 w-6" /> }
    ]

    const steps = [
        { title: "Submit Statement", description: "Upload your draft for review.", icon: <Send className="h-6 w-6" /> },
        { title: "AI Analysis", description: "Our AI examines your statement for key elements.", icon: <Zap className="h-6 w-6" /> },
        { title: "Receive Feedback", description: "Get detailed insights and suggestions.", icon: <CheckCircle className="h-6 w-6" /> }
    ]

    const testimonials = [
        { name: "Alex J.", text: "This app transformed my personal statement. The AI feedback was spot-on!" },
        { name: "Sarah M.", text: "I saw a significant improvement in my writing after just a few revisions." },
        { name: "Chris L.", text: "The clarity analysis helped me convey my ideas much more effectively." }
    ]

    return (
        <div className="container mx-auto px-4 py-16 space-y-24">
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Craft Your Perfect Personal Statement</h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                    Our AI-powered reviewer helps you craft the perfect personal statement, one draft at a time.
                </p>
            </motion.section>

            <motion.section ref={ref} initial="hidden" animate={controls} variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="transition-transform duration-300 hover:scale-105">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {feature.icon}
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.section>

            <motion.section ref={ref} initial="hidden" animate={controls} variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-primary text-primary-foreground p-4 mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                            {index < steps.length - 1 && (
                                <ArrowRight className="hidden md:block rotate-90 md:rotate-0 my-4 text-muted-foreground" />
                            )}
                        </div>
                    ))}
                </div>
            </motion.section>

            <motion.section ref={ref} initial="hidden" animate={controls} variants={fadeIn}>
                <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
                <Carousel className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                    <CardContent className="p-6">
                                        <p className="mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                                        <p className="font-semibold">{testimonial.name}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </motion.section>

            <motion.section
                className="text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <h2 className="text-3xl font-bold mb-6">Ready to Perfect Your Personal Statement?</h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="lg" className="animate-pulse hover:animate-none" onClick={() => window.location.href = '/pricing'}>
                                Get Started Now
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Begin your journey to a stellar personal statement!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.section>
        </div >
    )
}