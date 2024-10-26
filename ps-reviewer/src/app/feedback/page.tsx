'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, AlertTriangle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Cookies from 'js-cookie'

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

type AIDetectionResult = {
  overall_ai_probability: number
  flagged_sections: Array<{
    text: string
    reason: string
    probability: number
  }> | null
}

type CombinedResponse = {
  feedback: FeedbackResponse
  ai_detection: AIDetectionResult
}

export default function PersonalStatementFeedback() {
  const router = useRouter()
  const [personalStatement, setPersonalStatement] = useState('')
  const [combinedResponse, setCombinedResponse] = useState<CombinedResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sessionToken = Cookies.get('session_token')
    if (!sessionToken) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    setCharCount(personalStatement.length)
    setCharCountNoSpaces(personalStatement.replace(/\s+/g, '').length)
    setWordCount(personalStatement.trim().split(/\s+/).filter(Boolean).length)
  }, [personalStatement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = Cookies.get('session_token')
      if (!token) {
        throw new Error('No session token found')
      }

      const response = await fetch('http://localhost:3002/api/statements/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ text: personalStatement }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate feedback')
      }

      const data: CombinedResponse = await response.json()
      setCombinedResponse(data)
    } catch (err) {
      console.error(err)
      setError('An error occurred while generating feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderFeedbackCategory = (category: keyof FeedbackResponse, title: string) => {
    if (!combinedResponse) return null
    const { rating, feedback: categoryFeedback } = combinedResponse.feedback[category]

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            {title}
            <span className="text-2xl font-bold">{rating}/10</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={rating * 10} className="h-2 mb-2" />
          <p className="text-sm">{categoryFeedback}</p>
        </CardContent>
      </Card>
    )
  }

  const getAIDetectionColor = (probability: number) => {
    if (probability < 30) return 'text-green-500'
    if (probability < 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const renderAIDetectionResult = () => {
    if (!combinedResponse) return null
    const { overall_ai_probability, flagged_sections } = combinedResponse.ai_detection

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            AI Content Detection
            <div className={`relative w-20 h-20 ${getAIDetectionColor(overall_ai_probability)}`}>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(25, 25, 25, 0.2)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${overall_ai_probability}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {overall_ai_probability.toFixed(0)}%
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overall_ai_probability > 50 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High AI Content Probability</AlertTitle>
              <AlertDescription>
                This personal statement has a high probability of containing AI-generated content. Please review and revise to ensure originality.
              </AlertDescription>
            </Alert>
          )}
          {flagged_sections && flagged_sections.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center text-sm font-medium">
                View Flagged Sections
                <ChevronDown className="h-4 w-4 ml-1" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {flagged_sections.map((section, index) => (
                  <div
                    key={index}
                    className="mb-2 p-2 bg-gray-100 rounded text-sm"
                    onMouseEnter={() => setHighlightedSection(section.text)}
                    onMouseLeave={() => setHighlightedSection(null)}
                  >
                    <p className="font-medium">"{section.text}"</p>
                    <p className="text-gray-600">Reason: {section.reason}</p>
                    <p className="text-gray-600">Probability: {section.probability.toFixed(2)}%</p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    )
  }

  const highlightText = (text: string, highlightedSection: string | null) => {
    if (!highlightedSection) return text

    const parts = text.split(new RegExp(`(${highlightedSection})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlightedSection?.toLowerCase() ?
        <span key={i} className="bg-yellow-200">{part}</span> : part
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Statement Feedback</h1>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit Your Personal Statement</CardTitle>
            <CardDescription>
              Enter your personal statement below to receive detailed feedback and AI detection analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={textRef}
              className="min-h-[300px] p-4 border rounded-md mb-4 whitespace-pre-wrap"
              contentEditable
              onInput={(e) => setPersonalStatement(e.currentTarget.textContent || '')}
              dangerouslySetInnerHTML={{
                __html: highlightText(personalStatement, highlightedSection) as string
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Characters: {charCount} (without spaces: {charCountNoSpaces})</span>
              <span>Words: {wordCount}</span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || personalStatement.length === 0}
              className="w-full"
            >
              {isLoading ? 'Generating Feedback...' : 'Get Feedback'}
            </Button>
          </CardContent>
        </Card>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {combinedResponse && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Feedback Results</h2>
            {renderAIDetectionResult()}
            {renderFeedbackCategory('clarity', 'Clarity')}
            {renderFeedbackCategory('structure', 'Structure')}
            {renderFeedbackCategory('grammar_spelling', 'Grammar & Spelling')}
            {renderFeedbackCategory('relevance', 'Relevance')}
            {renderFeedbackCategory('engagement', 'Engagement')}
            {renderFeedbackCategory('overall_impression', 'Overall Impression')}
          </div>
        )}
      </div>
    </div>
  )
}