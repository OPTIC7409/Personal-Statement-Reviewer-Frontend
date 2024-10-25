'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type FeedbackCategory = {
  rating: number
  feedback: string
}

type FeedbackResponse = {
  clarity: FeedbackCategory
  structure: FeedbackCategory
  grammar_spelling: FeedbackCategory
  relevance: FeedbackCategory
  engagement: FeedbackCategory
  overall_impression: FeedbackCategory
}

export default function PersonalStatementFeedback() {
  const [personalStatement, setPersonalStatement] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3002/api/statements/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: personalStatement }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate feedback')
      }

      const data = await response.json()
      setFeedback(data)
    } catch (err) {
      console.error(err)
      setError('An error occurred while generating feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderFeedbackCategory = (category: keyof FeedbackResponse, title: string) => {
    if (!feedback) return null
    const { rating, feedback: categoryFeedback } = feedback[category]

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>
            <Progress value={rating * 10} className="mt-2" />
            <span className="text-sm font-medium">{rating}/10</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{categoryFeedback}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Statement Feedback</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="personal-statement" className="block text-sm font-medium text-gray-700">Your Personal Statement</label>
          <Textarea
            id="personal-statement"
            value={personalStatement}
            onChange={(e) => setPersonalStatement(e.target.value)}
            placeholder="Paste your personal statement here..."
            className="mt-1"
            rows={10}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Feedback...' : 'Get Feedback'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {feedback && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Feedback Results</h2>
          {renderFeedbackCategory('clarity', 'Clarity')}
          {renderFeedbackCategory('structure', 'Structure')}
          {renderFeedbackCategory('grammar_spelling', 'Grammar & Spelling')}
          {renderFeedbackCategory('relevance', 'Relevance')}
          {renderFeedbackCategory('engagement', 'Engagement')}
          {renderFeedbackCategory('overall_impression', 'Overall Impression')}
        </div>
      )}
    </div>
  )
}