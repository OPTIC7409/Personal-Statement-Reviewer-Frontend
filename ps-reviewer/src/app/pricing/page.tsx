'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, Clock, Rocket, X } from 'lucide-react'

const pricingPlans = [
    {
        name: 'Basic',
        price: 9.99,
        features: [
            '3 drafts per month',
            'AI-powered basic analysis',
            'Results in 30 seconds',
            'Grammar and structure check'
        ],
        stripePriceId: 'price_basic123',
        badge: null
    },
    {
        name: 'Pro',
        price: 19.99,
        features: [
            '10 drafts per month',
            'Advanced AI analysis',
            'Results in 15 seconds',
            'Style and content suggestions',
            'Plagiarism detection'
        ],
        stripePriceId: 'price_pro456',
        badge: 'Most Popular'
    },
    {
        name: 'Premium',
        price: 39.99,
        features: [
            'Unlimited drafts',
            'In-depth AI feedback',
            'Instant results (5 seconds)',
            'Multiple statement comparisons',
            'Tailored improvement strategies',
            'AI-generated writing tips'
        ],
        stripePriceId: 'price_premium789',
        badge: 'Best Value'
    }
]

const feedbackComparison = [
    { feature: 'Grammar Check', basic: true, advanced: true, premium: true },
    { feature: 'Spelling Check', basic: true, advanced: true, premium: true },
    { feature: 'Structure Analysis', basic: true, advanced: true, premium: true },
    { feature: 'Style Suggestions', basic: false, advanced: true, premium: true },
    { feature: 'Content Relevance', basic: false, advanced: true, premium: true },
    { feature: 'Vocabulary Enhancement', basic: false, advanced: true, premium: true },
    { feature: 'Tone Consistency', basic: false, advanced: true, premium: true },
    { feature: 'Plagiarism Detection', basic: false, advanced: true, premium: true },
    { feature: 'Multiple Statement Comparisons', basic: false, advanced: false, premium: true },
    { feature: 'Tailored Improvement Strategies', basic: false, advanced: false, premium: true },
    { feature: 'AI-Generated Writing Tips', basic: false, advanced: false, premium: true },
    { feature: 'Unlimited Drafts', basic: false, advanced: false, premium: true },
]

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleSubscription = async (stripePriceId: string) => {
        setIsLoading(stripePriceId)

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stripePriceId }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const { sessionId } = await response.json()

            if (sessionId) {
                window.location.href = sessionId
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
            <p className="text-center text-gray-600 mb-12">Refine your personal statement with AI-powered feedback in seconds</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {pricingPlans.map((plan) => (
                    <Card key={plan.name} className="flex flex-col relative">
                        {plan.badge && (
                            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                                {plan.badge}
                            </Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription className="text-3xl font-bold">${plan.price.toFixed(2)}/month</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                className="w-full"
                                onClick={() => handleSubscription(plan.stripePriceId)}
                                disabled={isLoading === plan.stripePriceId}
                            >
                                {isLoading === plan.stripePriceId ? 'Processing...' : `Start Refining with ${plan.name}`}
                            </Button>
                            <p className="text-sm text-center text-gray-500">Instant feedback, multiple revisions</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Feature</th>
                                <th className="px-4 py-2 text-center">Basic ($9.99)</th>
                                <th className="px-4 py-2 text-center">Pro ($19.99)</th>
                                <th className="px-4 py-2 text-center">Premium ($39.99)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackComparison.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="px-4 py-2">{item.feature}</td>
                                    <td className="px-4 py-2 text-center">
                                        {item.basic ? <CheckCircle2 className="h-5 w-5 text-green-500 inline" /> : <X className="h-5 w-5 text-red-500 inline" />}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {item.advanced ? <CheckCircle2 className="h-5 w-5 text-green-500 inline" /> : <X className="h-5 w-5 text-red-500 inline" />}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {item.premium ? <CheckCircle2 className="h-5 w-5 text-green-500 inline" /> : <X className="h-5 w-5 text-red-500 inline" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-center mt-8 space-x-4">
                    <Button size="lg" onClick={() => handleSubscription(pricingPlans[1].stripePriceId)}>
                        Upgrade to Pro
                    </Button>
                    <Button size="lg" onClick={() => handleSubscription(pricingPlans[2].stripePriceId)}>
                        Get Premium
                    </Button>
                </div>
            </div>

            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Why Our AI-Powered Review Process Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="flex flex-col items-center">
                        <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
                        <p className="text-gray-600">Get comprehensive analysis in seconds for each draft</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Clock className="h-12 w-12 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Iterative Improvement</h3>
                        <p className="text-gray-600">Refine your statement with multiple drafts and quick revisions</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Rocket className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
                        <p className="text-gray-600">Our AI adapts to your writing style for personalized advice</p>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Perfect Your Personal Statement?</h2>
                <p className="text-gray-600 mb-6">Join thousands of applicants who've improved their chances with our AI-powered revision process</p>
                <Button size="lg" onClick={() => handleSubscription(pricingPlans[2].stripePriceId)}>
                    Start Your Journey to the Perfect Statement
                </Button>
            </div>
        </div>
    )
}