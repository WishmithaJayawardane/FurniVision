'use client';

import { DesignEditor } from "@/components/design-editor";
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from "next/navigation";
import { useState, useEffect } from 'react';
import type { Design } from '@/lib/types';
import { Loader2, Info } from 'lucide-react';
import { findImageById } from '@/lib/placeholder-images';

export default function DesignPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const firestore = useFirestore();
  const { user } = useUser();

  const designDocRef = useMemoFirebase(() =>
    user && id && id !== 'new' ? doc(firestore, 'designers', user.uid, 'designs', id) : null
    , [firestore, user, id]);

  const { data: design, isLoading } = useDoc<Design>(designDocRef);

  if (id === 'new') {
    if (!user) return null; // Or a loading/error state
    const newDesignImage = findImageById('new-design');
    const newDesign: Design = {
      id: `des_${new Date().getTime()}`,
      name: 'Untitled Design',
      designerId: user.uid,
      room: { width: 12, depth: 12, height: 9, color: '#f0f8ff', shape: 'rectangular' },
      furniture: [],
      lastModified: new Date().toISOString(),
      imageUrl: newDesignImage.imageUrl,
      imageHint: newDesignImage.imageHint,
    };
    return <DesignEditor initialDesign={newDesign} />;
  }

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowLoader(true), 250);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    if (!showLoader) return null;
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!design) {
    // Using notFound() can cause a race condition when creating a new document,
    // as the page may load before the data is available in Firestore.
    // Instead, we show a friendly message, and the real-time listener from useDoc
    // will automatically update the page once the data arrives.
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Info className="h-12 w-12 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Design Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            If you just saved this design, please wait a moment for it to load.
          </p>
        </div>
      </div>
    );
  }

  return <DesignEditor initialDesign={design} />;
}
