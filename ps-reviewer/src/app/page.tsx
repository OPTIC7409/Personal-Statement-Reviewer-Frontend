'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle, Star, ArrowRight } from 'lucide-react'
// import AnimatedBackground from '@/components/AnimatedBackground'

const FadeInWhenVisible: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.3 }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.9 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
       {/* <AnimatedBackground /> */}
      </div>
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Elevate Your Personal Statement</h1>
                <p className="text-xl mb-6 text-white">Get expert feedback, plagiarism checks, and AI detection to make your application stand out.</p>
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Start Your Review
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg"
                  alt="Personal Statement Review Process"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20 bg-white bg-opacity-90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Service?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Expert Feedback", description: "Receive detailed, constructive feedback from experienced reviewers." },
                { title: "Plagiarism Check", description: "Ensure your statement is original and stands out from the crowd." },
                { title: "AI Detection", description: "Verify that your statement sounds authentically human-written." }
              ].map((benefit, index) => (
                <FadeInWhenVisible key={index}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{benefit.description}</p>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 bg-opacity-90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Submit Your Statement", description: "Upload your personal statement to our secure platform." },
                { step: 2, title: "Automated Analysis", description: "Our AI performs initial checks for plagiarism and authenticity." },
                { step: 3, title: "Expert Review", description: "Experienced reviewers provide detailed feedback and suggestions." }
              ].map((step, index) => (
                <FadeInWhenVisible key={index}>
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white bg-opacity-90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Alex Johnson", role: "Graduate Student", quote: "The feedback I received was invaluable. It helped me refine my statement and ultimately secure my dream program." },
                { name: "Samantha Lee", role: "Medical School Applicant", quote: "I was worried about unintentional plagiarism. This service gave me peace of mind and helped me craft a truly unique statement." },
                { name: "Michael Chen", role: "Law School Applicant", quote: "The AI detection feature is brilliant. It ensured my statement sounded authentic and personal." }
              ].map((testimonial, index) => (
                <FadeInWhenVisible key={index}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>&quot;{testimonial.quote}&quot;</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-50 bg-opacity-90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
            <div className="flex justify-center">
              <FadeInWhenVisible>
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">Professional Review</CardTitle>
                    <CardDescription>Everything you need for a standout personal statement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">$49.99</div>
                    <ul className="space-y-2">
                      {["Expert feedback", "Plagiarism check", "AI detection", "48-hour turnaround"].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Started</Button>
                  </CardFooter>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white bg-opacity-90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
              {[
                { question: "How long does the review process take?", answer: "Our standard turnaround time is 48 hours. If you need it sooner, please contact us for rush options." },
                { question: "Is my personal statement kept confidential?", answer: "Absolutely. We have strict confidentiality policies in place to protect your information." },
                { question: "Can I request revisions to the feedback?", answer: "Yes, you can request one round of revision or clarification on the feedback provided." },
                { question: "How accurate is the AI detection?", answer: "Our AI detection system is highly accurate, but we also have human reviewers to ensure the best results." }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer.replace(/"/g, '&quot;')}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Statement Reviewer</h3>
                <p>Elevating applications through expert feedback and advanced analysis.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {["About", "Services", "Pricing", "Contact"].map((link, index) => (
                    <li key={index}>
                      <Link href={`/${link.toLowerCase()}`} className="hover:underline">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p>Email: support@psreviewer.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p>&copy; 2024 Personal Statement Reviewer. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}