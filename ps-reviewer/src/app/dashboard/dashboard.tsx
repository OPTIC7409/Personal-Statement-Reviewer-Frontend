'use client'

import { useState, useEffect } from 'react'
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, FileText, Edit, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Statement = {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

type Feedback = {
  id: number
  statementId: number
  feedbackText: string
  createdAt: string
}

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

export default function Page() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const statementsResponse = await fetch('http://localhost:3002/api/statements')
      const feedbackResponse = await fetch('http://localhost:3002/api/feedback')

      if (!statementsResponse.ok || !feedbackResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const statementsData = await statementsResponse.json()
      const feedbackData = await feedbackResponse.json()

      setStatements(statementsData)
      setFeedback(feedbackData)
    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatementSelect = (statement: Statement) => {
    setSelectedStatement(statement)
    const statementFeedback = feedback.find(f => f.statementId === statement.id)
    if (statementFeedback) {
      setSelectedFeedback(JSON.parse(statementFeedback.feedbackText))
    } else {
      setSelectedFeedback(null)
    }
  }

  const handleDeleteStatement = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3002/api/statements/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete statement')
      }

      setStatements(statements.filter(s => s.id !== id))
      if (selectedStatement?.id === id) {
        setSelectedStatement(null)
        setSelectedFeedback(null)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while deleting the statement. Please try again.')
    }
  }

  const renderFeedbackCategory = (category: keyof FeedbackResponse, title: string) => {
    if (!selectedFeedback) return null
    const { rating, feedback } = selectedFeedback[category]

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
          <p>{feedback}</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Personal Statements</h1>
      <Tabs defaultValue="statements" className="w-full">
        <TabsList>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Your Statements</CardTitle>
              <CardDescription>View and manage your personal statements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statements.map((statement) => (
                    <TableRow key={statement.id}>
                      <TableCell>{statement.id}</TableCell>
                      <TableCell>{new Date(statement.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(statement.updatedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          className={buttonVariants({ variant: "outline" })}
                          onClick={() => handleStatementSelect(statement)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          className={buttonVariants({ variant: "outline" })}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          className={buttonVariants({ variant: "outline" })}
                          onClick={() => handleDeleteStatement(statement.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>View feedback for your selected statement</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStatement ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">Statement #{selectedStatement.id}</h3>
                  <p className="mb-4">{selectedStatement.content}</p>
                  {selectedFeedback ? (
                    <>
                      <h4 className="text-lg font-semibold mb-2">Feedback</h4>
                      {renderFeedbackCategory('clarity', 'Clarity')}
                      {renderFeedbackCategory('structure', 'Structure')}
                      {renderFeedbackCategory('grammar_spelling', 'Grammar & Spelling')}
                      {renderFeedbackCategory('relevance', 'Relevance')}
                      {renderFeedbackCategory('engagement', 'Engagement')}
                      {renderFeedbackCategory('overall_impression', 'Overall Impression')}
                    </>
                  ) : (
                    <p>No feedback available for this statement.</p>
                  )}
                </>
              ) : (
                <p>Select a statement to view its feedback.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}