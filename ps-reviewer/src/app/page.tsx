'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for API call
    toast({
      title: "Success!",
      description: "Thank you for joining our waitlist!",
    })
    setEmail('')
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">

      </div>
      <main className="relative z-10">
        <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Supercharge Your Personal Statement
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Leverage AI and expert feedback to craft a compelling personal statement that stands out from the crowd.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-64 bg-white/10"
              />
              <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            <Image
              src="/placeholder.svg"
              alt="Personal Statement Review Interface"
              width={1200}
              height={600}
              className="rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </section>

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <ArrowRight className="h-8 w-8" />, title: "AI-Powered Analysis", description: "Get instant feedback on structure, clarity, and impact." },
              { icon: <ArrowRight className="h-8 w-8" />, title: "Plagiarism Check", description: "Ensure your statement is original and stands out." },
              { icon: <ArrowRight className="h-8 w-8" />, title: "Expert Review", description: "Receive feedback from experienced professionals." },
              { icon: <ArrowRight className="h-8 w-8" />, title: "Grammar & Style", description: "Polish your writing with advanced language suggestions." },
              { icon: <ArrowRight className="h-8 w-8" />, title: "Personalized Tips", description: "Get tailored advice based on your goals and background." },
              { icon: <ArrowRight className="h-8 w-8" />, title: "Iterative Improvement", description: "Refine your statement with multiple rounds of feedback." },
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-2">{feature.title}</h3>
                </div>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: 1, title: "Submit Your Draft", description: "Upload your personal statement to our secure platform." },
              { step: 2, title: "AI Analysis", description: "Our AI performs initial checks and provides instant feedback." },
              { step: 3, title: "Expert Review", description: "Experienced reviewers offer detailed suggestions and improvements." },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center max-w-xs">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="bg-white/5 p-8 rounded-lg border border-white/10">
            <h2 className="text-3xl font-bold mb-6">About Personal Statement Reviewer</h2>
            <p className="mb-4">
              We're a team of educators, industry professionals, and AI experts dedicated to helping students and professionals craft compelling personal statements. Our innovative platform combines cutting-edge AI technology with human expertise to provide unparalleled feedback and guidance.
            </p>
            <p>
              Join our waitlist today to be among the first to experience the future of personal statement optimization!
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-white/10 pt-8 flex justify-between items-center">
          <p>&copy; 2024 Personal Statement Reviewer. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}