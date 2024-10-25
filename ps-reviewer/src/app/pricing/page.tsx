'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from 'lucide-react'

// Replace with your actual Stripe publishable key

const pricingPlans = [
    {
        name: 'Basic',
        price: 9.99,
        features: ['1 Personal Statement Review', 'Basic Feedback', '24-hour Turnaround'],
        stripePriceId: 'price_basic123'
    },
    {
        name: 'Pro',
        price: 19.99,
        features: ['3 Personal Statement Reviews', 'Detailed Feedback', '12-hour Turnaround', 'Video Call Consultation'],
        stripePriceId: 'price_pro456'
    },
    {
        name: 'Premium',
        price: 39.99,
        features: ['Unlimited Personal Statement Reviews', 'Expert Feedback', '6-hour Turnaround', 'Priority Support', 'Interview Preparation Guide'],
        stripePriceId: 'price_premium789'
    }
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
            <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                    <Card key={plan.name} className="flex flex-col">
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
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleSubscription(plan.stripePriceId)}
                                disabled={isLoading === plan.stripePriceId}
                            >
                                {isLoading === plan.stripePriceId ? 'Processing...' : `Subscribe to ${plan.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}