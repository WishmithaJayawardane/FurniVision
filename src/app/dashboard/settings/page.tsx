'use client';

import { useUser, useAuth } from '@/firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User as UserIcon, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
    const { user } = useUser();
    const auth = useAuth();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="flex-1 flex flex-col">
                <TabsList className="w-full sm:w-auto self-start grid grid-cols-3">
                    <TabsTrigger value="profile">
                        <UserIcon className="mr-2 h-4 w-4 hidden sm:inline" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                        <CreditCard className="mr-2 h-4 w-4 hidden sm:inline" /> Billing
                    </TabsTrigger>
                    <TabsTrigger value="general">
                        <SettingsIcon className="mr-2 h-4 w-4 hidden sm:inline" /> General
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6 flex-1 overflow-y-auto pr-2 pb-4">
                    <TabsContent value="profile" className="m-0 h-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Update your personal information and how others see you.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={user.photoURL || undefined} />
                                            <AvatarFallback className="text-2xl">{getInitials(user.displayName || user.email)}</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" type="button">Change Avatar</Button>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user.email || 'Anonymous'}
                                            disabled
                                        />
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            Your email address is managed through your authentication provider.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="m-0 h-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing & Subscription</CardTitle>
                                <CardDescription>
                                    Manage your subscription plan and billing information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border p-4 bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">Pro Plan</h3>
                                        <p className="text-sm text-muted-foreground">You are currently on the Pro plan.</p>
                                    </div>
                                    <Button variant="secondary">Manage Subscription</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="general" className="m-0 h-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>
                                    General application settings and notification preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about new features.</p>
                                    </div>
                                    <Button variant="outline">Enabled</Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Toggle application theme manually.</p>
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
