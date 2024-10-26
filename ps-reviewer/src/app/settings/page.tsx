'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Cookies from 'js-cookie'

type UserAccount = {
    id: number
    email: string
    name: string
}

type UserProfile = {
    id: number
    user_id: number
    bio: string
    profile_picture_url: string
    preferences: string
    created_at: string
    updated_at: string
}

type Preferences = {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
    emailFrequency: 'daily' | 'weekly' | 'monthly'
    autoSave: boolean
}

const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
]

export default function SettingsPage() {
    const router = useRouter()
    const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
    const [preferences, setPreferences] = useState<Preferences>({
        theme: 'light',
        notifications: true,
        language: 'en',
        emailFrequency: 'weekly',
        autoSave: true
    })
    const [newPictureUrl, setNewPictureUrl] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        loadAccountData()
        fetchUserProfile()
    }, [])

    const loadAccountData = () => {
        const cachedAccountData = localStorage.getItem('accountData')
        if (cachedAccountData) {
            try {
                setUserAccount(JSON.parse(cachedAccountData))
            } catch (err) {
                console.error('Error parsing cached account data:', err)
                setError('Failed to load account data. Please refresh the page.')
                fetchAccountData() // Attempt to fetch fresh data if parsing fails
            }
        } else {
            fetchAccountData()
        }
    }

    const fetchAccountData = async () => {
        try {
            const token = Cookies.get('session_token')
            if (!token) {
                throw new Error('No session token found')
            }
            const response = await fetch('http://localhost:3002/api/auth/account', {
                headers: {
                    'Authorization': `${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch account data')
            }

            const data = await response.json()
            setUserAccount(data)
            localStorage.setItem('accountData', JSON.stringify(data))
        } catch (err) {
            console.error('Error fetching account data:', err)
            setError('Failed to fetch account data. Please try logging in again.')
        }
    }

    const fetchUserProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = Cookies.get('session_token')
            if (!token) {
                throw new Error('No session token found')
            }
            const response = await fetch(`http://localhost:3002/api/users/me/3`, {
                headers: {
                    'Authorization': `${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user profile')
            }

            const data: UserProfile = await response.json()
            setUserProfile(data)
            setEditedProfile(data)
            updatePreferences(data.preferences)
        } catch (err) {
            console.error('Error fetching user profile:', err)
            setError('An error occurred while fetching your profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const updatePreferences = (preferencesString: string) => {
        if (!preferencesString) {
            console.error('Preferences string is undefined or empty. Using default values.')
            return
        }

        try {
            const parsedPreferences = JSON.parse(preferencesString)
            setPreferences({
                theme: parsedPreferences.theme || 'light',
                notifications: parsedPreferences.notifications !== undefined ? parsedPreferences.notifications : true,
                language: parsedPreferences.language || 'en',
                emailFrequency: parsedPreferences.emailFrequency || 'weekly',
                autoSave: parsedPreferences.autoSave !== undefined ? parsedPreferences.autoSave : true
            })
        } catch (err) {
            console.error('Error parsing preferences:', err)
            setError('Failed to parse preferences. Using default values.')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditedProfile(prev => ({ ...prev, [name]: value }))
    }

    const handlePreferenceChange = (key: keyof Preferences, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }))
    }

    const handlePictureChange = () => {
        if (newPictureUrl) {
            setEditedProfile(prev => ({ ...prev, profile_picture_url: newPictureUrl }))
            setNewPictureUrl('')
            setIsDialogOpen(false)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = Cookies.get('session_token')
            if (!token) {
                throw new Error('No session token found')
            }
            const updatedProfile = {
                ...editedProfile,
                preferences: JSON.stringify(preferences)
            }

            const response = await fetch(`http://localhost:3002/api/users/me/3`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(updatedProfile),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update profile')
            }

            const updatedData: UserProfile = await response.json()
            setUserProfile(updatedData)
            setEditedProfile(updatedData)
            updatePreferences(updatedData.preferences)
            setIsEditing(false)
        } catch (err) {
            console.error('Error updating profile:', err)
            setError('Failed to update profile. Please check your input and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="max-w-md mx-auto mt-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>User Settings</CardTitle>
                    <CardDescription>Manage your account and profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={editedProfile.profile_picture_url || userProfile?.profile_picture_url} alt="Profile Picture" />
                                <AvatarFallback>
                                    {userAccount?.name ? userAccount.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : '??'}
                                </AvatarFallback>
                            </Avatar>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Change Picture</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Change Profile Picture</DialogTitle>
                                        <DialogDescription>
                                            Enter the URL of your new profile picture.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="picture-url" className="text-right">
                                                Picture URL
                                            </Label>
                                            <Input
                                                id="picture-url"
                                                className="col-span-3"
                                                value={newPictureUrl}
                                                onChange={(e) => setNewPictureUrl(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handlePictureChange}>Apply</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={userAccount?.name || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={userAccount?.email || ''}
                                disabled={true}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={editedProfile.bio || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label>Preferences</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="theme"
                                    checked={preferences.theme === 'dark'}
                                    onCheckedChange={(checked) => handlePreferenceChange('theme', checked ? 'dark' : 'light')}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="theme">Dark Theme</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="notifications"
                                    checked={preferences.notifications}
                                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="notifications">Enable Notifications</Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select
                                    disabled={!isEditing}
                                    value={preferences.language}
                                    onValueChange={(value) => handlePreferenceChange('language', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emailFrequency">Email Frequency</Label>
                                <Select
                                    disabled={!isEditing}
                                    value={preferences.emailFrequency}
                                    onValueChange={(value) => handlePreferenceChange('emailFrequency', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select email frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="autoSave"
                                    checked={preferences.autoSave}
                                    onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                                    disabled={!isEditing}
                                />

                                <Label htmlFor="autoSave">Enable Auto-Save</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}