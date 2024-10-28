'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Stripe from 'stripe'
import { useRouter } from 'next/navigation'
interface StripeCheckoutProps {
  priceId: string
  planName: string
}

export default function StripeCheckout({ priceId, planName }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = new Stripe("pk_test_51QEyq6B3f5MlzO9LLMSaVrSwlwsLuaWoqGARsyhhOZH606MRKFqvlive6Jp27hrfG3Y2M1ZvgherzgMPt3NPdzp300FTNT8bhP")
      if (stripe) {
        await router.push(`http://localhost:3000/checkout?session_id=${sessionId}`)
      } else {
        throw new Error('Failed to load Stripe')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Error",
        description: "Unable to process checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Processing...' : `Subscribe to ${planName}`}
    </Button>
  )
}