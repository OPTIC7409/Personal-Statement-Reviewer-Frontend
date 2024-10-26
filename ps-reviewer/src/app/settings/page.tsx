'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type UserProfile = {
    id: number
    user_id: number
    bio: string
    profile_picture_url: string
    preferences: string
    created_at: string
    updated_at: string
}

export default function SettingsPage() {
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Assuming the user ID is 1 for this example. In a real app, you'd get this from authentication.
            const userId = 1
            const response = await fetch(`/api/users/me/${userId}`)

            if (!response.ok) {
                throw new Error('Failed to fetch user profile')
            }

            const data: UserProfile = await response.json()
            setUserProfile(data)
            setEditedProfile(data)
        } catch (err) {
            console.error(err)
            setError('An error occurred while fetching your profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditedProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/users/me/${userProfile?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProfile),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const updatedProfile: UserProfile = await response.json()
            setUserProfile(updatedProfile)
            setIsEditing(false)
        } catch (err) {
            console.error(err)
            setError('An error occurred while updating your profile. Please try again.')
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
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>User Settings</CardTitle>
                    <CardDescription>Manage your profile and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={userProfile?.profile_picture_url || '/placeholder.svg'}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                            <Button variant="outline">Change Picture</Button>
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
                        <div className="space-y-2">
                            <Label htmlFor="preferences">Preferences</Label>
                            <Input
                                id="preferences"
                                name="preferences"
                                value={editedProfile.preferences || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
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