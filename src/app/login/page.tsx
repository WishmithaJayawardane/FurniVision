
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid = hasCapital && hasNumber && hasSpecial && password.length >= 8;

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please enter both email and password.',
      });
      return;
    }
    setIsSigningIn(true);
    try {
      if (action === 'login') {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified && !userCred.user.isAnonymous) {
          await sendEmailVerification(userCred.user);
          await signOut(auth);
          toast({
            title: 'Verification Email Resent',
            description: 'We just sent another verification email. Please check your inbox (and spam folder) before logging in again.',
            variant: 'default'
          });
          return;
        }
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        await signOut(auth); // force sign out after signup so they have to verify
        toast({
          title: 'Account Created',
          description: 'A verification link has been sent to your email. Please verify to log in.',
        });
        return;
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Account Already Exists',
          description: 'This email is already registered. Try logging in, and we will resend the verification email automatically!',
        });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
    } finally {
      setIsSigningIn(false);
    }
  }


  if (isUserLoading || isSigningIn || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="w-32 h-32 md:w-40 md:h-40 text-primary drop-shadow-sm" />
          </Link>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={() => { setEmail(''); setPassword(''); }}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your designs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Input id="password-login" type={showLoginPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showLoginPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={() => handleAuthAction('login')} disabled={isSigningIn}>
                  {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent >
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Get started with FurniVision today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Input id="password-signup" type={showSignupPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showSignupPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                  {password.length > 0 && (
                    <div className="space-y-2 mt-2 text-sm">
                      <div className={cn("flex items-center gap-2", password.length >= 8 ? "text-green-500" : "text-muted-foreground")}>
                        {password.length >= 8 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={cn("flex items-center gap-2", hasCapital ? "text-green-500" : "text-muted-foreground")}>
                        {hasCapital ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>One capital letter</span>
                      </div>
                      <div className={cn("flex items-center gap-2", hasNumber ? "text-green-500" : "text-muted-foreground")}>
                        {hasNumber ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>One number</span>
                      </div>
                      <div className={cn("flex items-center gap-2", hasSpecial ? "text-green-500" : "text-muted-foreground")}>
                        {hasSpecial ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>One special character</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleAuthAction('signup')} disabled={isSigningIn || (password.length > 0 && !isPasswordValid)}>
                  {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs >
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isSigningIn}>
            {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in Anonymously
          </Button>
        </div>
      </div >
    </div >
  );
}
