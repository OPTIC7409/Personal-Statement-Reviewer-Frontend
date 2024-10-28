'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, FileText, Edit, Trash2, Save, Home, File, MoreHorizontal, HelpCircle, Settings, Plus, CreditCard } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { ModeToggle } from "@/components/ui/toggle-dm"
import { Badge } from "@/components/ui/badge"

type UserSubscription = {
  plan: 'Basic' | 'Pro' | 'Premium'
  draftsLeft: number
  draftsPerMonth: number
  nextRenewal: string
}

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

type Feedback = {
  id: number
  statement_id: number
  feedback_text: FeedbackResponse
  created_at: string
}

type CombinedData = {
  statement: Statement
  feedbacks: Feedback[]
}

export default function Dashboard() {
  const router = useRouter()
  const [combinedData, setCombinedData] = useState<CombinedData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<CombinedData | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [userSubscription, setUserSubscription] = useState<UserSubscription>({
    plan: 'Basic',
    draftsLeft: 1,
    draftsPerMonth: 3,
    nextRenewal: '2024-11-26'
  })
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    const checkSession = () => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)session_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      if (!token) {
        router.push('/login')
      } else {
        fetchDashboardData()
        fetchUserSubscription()
        fetchUserName()
      }
    }

    checkSession()
  }, [router])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)session_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      const response = await fetch('http://localhost:3002/api/statements/feedback', {
        headers: {
          'Authorization': `${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      } else {
        const combinedData = data.statements.map((statement: Statement) => {
          const feedbacks = data.feedbacks.filter((f: Feedback) => f.statement_id === statement.id)
          return {
            statement,
            feedbacks: feedbacks.map((feedback: Feedback) => ({
              ...feedback,
              feedback_text: typeof feedback.feedback_text === 'string'
                ? JSON.parse(feedback.feedback_text)
                : feedback.feedback_text
            }))
          }
        })
        setCombinedData(combinedData)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserSubscription = async () => {
    // This would be an API call in a real application
    // For now, we'll use the default state
    // setUserSubscription(await response.json())
  }

  const fetchUserName = () => {
    const accountData = localStorage.getItem('accountData')
    if (accountData) {
      try {
        const { name } = JSON.parse(accountData)
        setUserName(name || 'User')
      } catch (error) {
        console.error('Error parsing accountData:', error)
        setUserName('User')
      }
    } else {
      setUserName('User')
    }
  }

  const handleDataSelect = (data: CombinedData) => {
    setSelectedData(data)
    setActiveTab('feedback')
    setEditMode(false)
    setEditedContent(data.statement.content)
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
      if (selectedData?.statement.id === id) {
        setSelectedData(null)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while deleting the statement. Please try again.')
    }
  }

  const handleEdit = () => {
    if (selectedData) {
      setEditedContent(selectedData.statement.content)
      setEditMode(true)
    }
  }

  const handleSave = async () => {
    if (!selectedData) return

    try {
      const response = await fetch(`http://localhost:3002/api/statements/${selectedData.statement.id}`, {
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
      setSelectedData({
        ...selectedData,
        statement: updatedStatement
      })
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

  const renderSubscriptionBadge = () => {
    const { plan, draftsLeft, draftsPerMonth } = userSubscription
    const color = draftsLeft <= 1 ? 'bg-red-500' : draftsLeft <= draftsPerMonth / 2 ? 'bg-yellow-500' : 'bg-green-500'
    return (
      <Badge className={`${color} text-white`}>
        {plan} - {draftsLeft}/{draftsPerMonth} drafts left
      </Badge>
    )
  }

  const renderFeedbackCategory = (category: keyof FeedbackResponse, title: string, feedbackText: FeedbackResponse) => {
    if (!feedbackText || !feedbackText[category]) return null
    const { rating, feedback } = feedbackText[category]

    return (
      <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>
            <div className="mt-2">
              <Progress value={rating * 10} />
              <span className="text-sm font-medium">{rating}/10</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{feedback}</p>
        </CardContent>
      </Card>
    )
  }

  const renderHomeContent = () => {
    if (combinedData.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to PSReviewer</CardTitle>
            <CardDescription>You currently do not have any personal statements uploaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/feedback')}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First Statement
            </Button>
          </CardContent>
        </Card>
      )
    }

    const averageClarityScore = combinedData.reduce((sum, item) => {
      if (item.feedbacks && item.feedbacks.length > 0 && item.feedbacks[0].feedback_text && item.feedbacks[0].feedback_text.clarity) {
        return sum + item.feedbacks[0].feedback_text.clarity.rating
      }
      return sum
    }, 0) / combinedData.length || 1 // Avoid division by zero

    return (
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
              {averageClarityScore.toFixed(1)}
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
                : 'No statements available'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => setActiveTab('drafts')}>
            <File className="mr-2 h-4 w-4" />
            Drafts
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => setActiveTab('subscription')}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => router.push('/help')}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="bg-card shadow-sm h-16 flex items-center justify-between px-4">
          {renderSubscriptionBadge()}
          <ModeToggle />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto p-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hello, {userName}</CardTitle>
              <CardDescription>
                Welcome to the Personal Statement Reviewer dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => router.push('/pricing')}>Upgrade plan</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 shadow-md">
              <TabsTrigger value="home" className="px-6 py-2">Home</TabsTrigger>
              <TabsTrigger value="drafts" className="px-6 py-2">Drafts</TabsTrigger>
              <TabsTrigger value="feedback" className="px-6 py-2">Feedback</TabsTrigger>
              <TabsTrigger value="subscription" className="px-6 py-2">Subscription</TabsTrigger>
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
            <TabsContent value="drafts">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Your Drafts</CardTitle>
                  <CardDescription>View and manage your personal statement drafts</CardDescription>
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
                        {combinedData.map(({ statement, feedbacks }) => (
                          <TableRow key={statement.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <TableCell>{statement.id}</TableCell>
                            <TableCell>{new Date(statement.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                              {statement.updated_at !== "0001-01-01T00:00:00Z"
                                ? new Date(statement.updated_at).toLocaleString()
                                : "Not updated"}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleDataSelect({ statement, feedbacks })}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    handleDataSelect({ statement, feedbacks })
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
                    <p className="text-center py-8 text-muted-foreground">You currently do not have any personal statement drafts.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Feedback</CardTitle>
                  <CardDescription>View and edit your selected statement feedback</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedData ? (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Statement #{selectedData.statement.id}</h3>
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
                          <div className="p-4 bg-muted rounded-md">{selectedData.statement.content}</div>
                          <div className="flex justify-end mt-2">
                            <Button onClick={handleEdit}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Statement
                            </Button>
                          </div>
                        </div>
                      )}
                      <h4 className="text-lg font-semibold mb-4">Feedback</h4>
                      {selectedData.feedbacks.map((feedback, index) => (
                        <div key={feedback.id} className="mb-6">
                          <h5 className="text-md font-semibold mb-2">Feedback #{index + 1}</h5>
                          {renderFeedbackCategory('clarity', 'Clarity', feedback.feedback_text)}
                          {renderFeedbackCategory('structure', 'Structure', feedback.feedback_text)}
                          {renderFeedbackCategory('grammar_spelling', 'Grammar & Spelling', feedback.feedback_text)}
                          {renderFeedbackCategory('relevance', 'Relevance', feedback.feedback_text)}
                          {renderFeedbackCategory('engagement', 'Engagement', feedback.feedback_text)}
                          {renderFeedbackCategory('overall_impression', 'Overall Impression', feedback.feedback_text)}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Select a statement to view its feedback.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subscription">
              <Card className="shadow-lg">
                <CardHeader className="bg-secondary">
                  <CardTitle className="text-2xl">Your Subscription</CardTitle>
                  <CardDescription>Manage your subscription and usage</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Current Plan: {userSubscription.plan}</h3>
                      <p>Drafts remaining: {userSubscription.draftsLeft} / {userSubscription.draftsPerMonth}</p>
                      <p>Next renewal: {new Date(userSubscription.nextRenewal).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={() => router.push('/pricing')}>Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}