'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, FileText, Edit, Trash2, Save, Home, File, MoreHorizontal, HelpCircle, Settings, Plus, BarChart } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { ModeToggle } from "@/components/ui/toggle-dm"

type Statement = {
  id: number
  content: string
  created_at: string
  updated_at: string
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

type CombinedResponse = {
  statement: Statement
  feedback: {
    id: number
    statement_id: number
    feedback_text: FeedbackResponse
    created_at: string
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [combinedData, setCombinedData] = useState<CombinedResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3002/api/statements/feedback/1')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      console.log(data)

      if (data === "user does not have any") {
        setCombinedData([])
      } else {
        setCombinedData(data)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatementSelect = (statement: Statement, feedback: FeedbackResponse) => {
    setSelectedStatement(statement)
    setSelectedFeedback(feedback)
    setActiveTab('feedback')
    setEditMode(false)
    setEditedContent(statement.content)
  }

  const handleDeleteStatement = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3002/api/statements/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete statement')
      }

      setCombinedData(combinedData.filter(item => item.statement.id !== id))
      if (selectedStatement?.id === id) {
        setSelectedStatement(null)
        setSelectedFeedback(null)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while deleting the statement. Please try again.')
    }
  }

  const handleEdit = () => {
    if (selectedStatement) {
      setEditedContent(selectedStatement.content)
      setEditMode(true)
    }
  }

  const handleSave = async () => {
    if (!selectedStatement) return

    try {
      const response = await fetch(`http://localhost:3002/api/statements/${selectedStatement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      })

      if (!response.ok) {
        throw new Error('Failed to update statement')
      }

      const updatedStatement = await response.json()
      setSelectedStatement(updatedStatement)
      setCombinedData(combinedData.map(item =>
        item.statement.id === updatedStatement.id
          ? { ...item, statement: updatedStatement }
          : item
      ))
      setEditMode(false)
    } catch (err) {
      console.error(err)
      setError('An error occurred while updating the statement. Please try again.')
    }
  }

  const renderFeedbackCategory = (category: keyof FeedbackResponse, title: string) => {
    if (!selectedFeedback) return null
    const { rating, feedback } = selectedFeedback[category]

    return (
      <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
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

  const renderHomeContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{combinedData.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Clarity Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {(combinedData.reduce((sum, item) => sum + item.feedback.feedback_text.clarity.rating, 0) / combinedData.length).toFixed(1)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latest Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {combinedData.length > 0
              ? new Date(combinedData[combinedData.length - 1].statement.created_at).toLocaleDateString()
              : 'No statements yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  )

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-foreground">PSReviewer</h2>
        </div>
        <nav className="mt-6">
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => router.push('/feedback')}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => setActiveTab('home')}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => setActiveTab('documents')}>
            <File className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left">
            <MoreHorizontal className="mr-2 h-4 w-4" />
            More
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="bg-card shadow-sm h-16 flex items-center justify-end px-4">
          <ModeToggle />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto p-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hello, User</CardTitle>
              <CardDescription>
                Welcome to the Personal Statement Reviewer dashboard. Your role is Reviewer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline">Upgrade plan</Button>
                <Button variant="outline">Change role</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 shadow-md">
              <TabsTrigger value="home" className="px-6 py-2">Home</TabsTrigger>
              <TabsTrigger value="documents" className="px-6 py-2">Documents</TabsTrigger>
              <TabsTrigger value="feedback" className="px-6 py-2">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Dashboard Overview</CardTitle>
                  <CardDescription>Key statistics and information about your personal statements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderHomeContent()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Your Statements</CardTitle>
                  <CardDescription>View and manage your personal statements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {combinedData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted">
                          <TableHead className="font-bold">ID</TableHead>
                          <TableHead className="font-bold">Created At</TableHead>
                          <TableHead className="font-bold">Updated At</TableHead>
                          <TableHead className="font-bold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {combinedData.map(({ statement, feedback }) => (
                          <TableRow key={statement.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <TableCell>{statement.id}</TableCell>
                            <TableCell>{new Date(statement.created_at).toLocaleString()}</TableCell>
                            <TableCell>{new Date(statement.updated_at).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleStatementSelect(statement, feedback.feedback_text)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    handleStatementSelect(statement, feedback.feedback_text)
                                    handleEdit()
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  <span>Edit</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDeleteStatement(statement.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span>Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">You don't have any personal statements yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="feedback">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Feedback</CardTitle>
                  <CardDescription>View and edit your selected statement</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedStatement ? (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Statement #{selectedStatement.id}</h3>
                      {editMode ? (
                        <div className="mb-4">
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-40 p-2 border rounded"
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <Button onClick={() => setEditMode(false)} variant="outline">
                              Cancel
                            </Button>
                            <Button onClick={handleSave}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes

                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6">
                          <p className="p-4 bg-muted rounded-md">{selectedStatement.content}</p>
                          <div className="flex justify-end mt-2">
                            <Button onClick={handleEdit}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Statement
                            </Button>
                          </div>
                        </div>
                      )}
                      {selectedFeedback ? (
                        <>
                          <h4 className="text-lg font-semibold mb-4">Feedback</h4>
                          {renderFeedbackCategory('clarity', 'Clarity')}
                          {renderFeedbackCategory('structure', 'Structure')}
                          {renderFeedbackCategory('grammar_spelling', 'Grammar & Spelling')}
                          {renderFeedbackCategory('relevance', 'Relevance')}
                          {renderFeedbackCategory('engagement', 'Engagement')}
                          {renderFeedbackCategory('overall_impression', 'Overall Impression')}
                        </>
                      ) : (
                        <p className="text-center py-8 text-muted-foreground">No feedback available for this statement.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">Select a statement to view its feedback.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}