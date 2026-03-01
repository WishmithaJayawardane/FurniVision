'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Mail, HelpCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SupportPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent",
            description: "We've received your request and will get back to you shortly.",
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support</h1>
                <p className="text-muted-foreground">Get help with FurniVision or report an issue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center text-center p-6 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
                    <MessageSquare className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mt-2">Chat with our support team in real-time.</p>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg">Documentation</h3>
                    <p className="text-sm text-muted-foreground mt-2">Browse our detailed guides and tutorials.</p>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <HelpCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg">Community</h3>
                    <p className="text-sm text-muted-foreground mt-2">Join our Discord community and ask questions.</p>
                </Card>
            </div>

            <Card className="flex-1 mt-4">
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>
                        Send us a message directly and we'll reply to your email.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="John Doe" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="How can we help?" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Please describe your issue or question in detail..."
                                className="min-h-[150px]"
                                required
                            />
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-end">
                        <Button type="submit">
                            <Mail className="mr-2 h-4 w-4" /> Send Message
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
