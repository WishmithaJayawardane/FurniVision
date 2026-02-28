'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString));
};

import type { Design } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const designsQuery = useMemoFirebase(() =>
    user ? collection(firestore, 'designers', user.uid, 'designs') : null
    , [firestore, user]);

  const { data: designs, isLoading } = useCollection<Design>(designsQuery);

  const handleDelete = (designId: string) => {
    if (!user) return;
    const designDocRef = doc(firestore, 'designers', user.uid, 'designs', designId);
    deleteDoc(designDocRef);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Designs</h1>
          <p className="text-muted-foreground">
            Manage your projects or start a new one.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/design/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Design
          </Link>
        </Button>
      </div>

      {designs && designs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="flex flex-col">
              <CardHeader>
                <Link href={`/dashboard/design/${design.id}`} className="block relative aspect-[3/2] w-full rounded-t-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                  <Image
                    src={design.imageUrl}
                    alt={design.name}
                    fill
                    className="object-cover"
                    data-ai-hint={design.imageHint}
                  />
                </Link>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="mb-2">{design.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{design.furniture.length} items</Badge>
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Updated {formatDate(design.lastModified)}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/design/${design.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your design.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(design.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-transparent hover:bg-accent/50 transition-colors">
            <Button variant="ghost" className="h-full w-full" asChild>
              <Link href="/dashboard/design/new" className="flex flex-col items-center justify-center gap-2">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">New Design</span>
              </Link>
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No Designs Yet</h2>
          <p className="text-muted-foreground mt-2 mb-4">
            Click the button below to create your first design.
          </p>
          <Button asChild>
            <Link href="/dashboard/design/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Design
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
