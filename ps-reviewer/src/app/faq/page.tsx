'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const faqItems = [
        {
            question: "What are the different pricing plans available?",
            answer: "We offer three plans: Basic ($9.99/month), Pro ($19.99/month), and Premium ($39.99/month). Each plan offers different features and levels of service to suit your needs."
        },
        {
            question: "How many drafts can I submit with each plan?",
            answer: "The Basic plan allows 3 drafts per month, the Pro plan offers 10 drafts per month, and the Premium plan provides unlimited drafts."
        },
        {
            question: "How long does it take to receive feedback?",
            answer: "Feedback time varies by plan. Basic users receive results in 30 seconds, Pro users in 15 seconds, and Premium users get instant results (5 seconds)."
        },
        {
            question: "What type of analysis does the AI provide?",
            answer: "Our AI provides comprehensive analysis including grammar and structure check for all plans. Pro and Premium plans also include style and content suggestions, plagiarism detection, and more advanced features."
        },
        {
            question: "Is there a plagiarism detection feature?",
            answer: "Yes, plagiarism detection is included in our Pro and Premium plans to ensure your statement is original."
        },
        {
            question: "Can I compare multiple statements?",
            answer: "Multiple statement comparisons are available exclusively in our Premium plan, allowing you to refine your approach across different applications."
        },
        {
            question: "Do you offer any personalized improvement strategies?",
            answer: "Yes, our Premium plan includes tailored improvement strategies and AI-generated writing tips to help you craft the perfect personal statement."
        },
        {
            question: "Is my personal statement kept confidential?",
            answer: "Absolutely. We have strict confidentiality policies in place to protect your information and ensure your personal statement remains private."
        },
        {
            question: "Can I request revisions to the feedback?",
            answer: "While our AI provides instant feedback, you can always submit revised drafts (within your plan's limits) to get updated analysis and suggestions."
        },
        {
            question: "How does the AI-powered review process work?",
            answer: "Our AI analyzes your statement for various aspects including grammar, structure, style, and content relevance. It provides instant feedback, allowing for quick iterations and improvements."
        },
        {
            question: "Can I get a refund?",
            answer: "We do not offer refunds due to the nature of our service as it costs us money to provide you with feedback. However, you can cancel your subscription at any time."
        }
    ]

    return (
        <div className="container mx-auto px-4 py-16 space-y-12">
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
                <p className="text-xl text-muted-foreground">
                    Find answers to common questions about our Personal Statement Review service.
                </p>
            </motion.section>

            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent>{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.section>
        </div>
    )
}