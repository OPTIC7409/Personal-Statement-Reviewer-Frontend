'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SignupPage() {
    const [contactMethod, setContactMethod] = useState('email')
    const [contactValue, setContactValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Replace this with your actual API call
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: contactMethod, value: contactValue }),
            })

            if (response.ok) {
                toast({
                    title: "Success!",
                    description: "Thank you for joining our waitlist!",
                })
                setContactValue('')
            } else {
                throw new Error('Submission failed')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            })
        }

        setIsSubmitting(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Join Our Waitlist</CardTitle>
                    <CardDescription>Be the first to know when we launch!</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="email" />
                                <Label htmlFor="email">Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="phone" id="phone" />
                                <Label htmlFor="phone">Phone</Label>
                            </div>
                        </RadioGroup>
                        <div className="space-y-2">
                            <Label htmlFor="contactValue">
                                {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                            </Label>
                            <Input
                                type={contactMethod === 'email' ? 'email' : 'tel'}
                                id="contactValue"
                                value={contactValue}
                                onChange={(e) => setContactValue(e.target.value)}
                                required
                                placeholder={contactMethod === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </div>
    )
}