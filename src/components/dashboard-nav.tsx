'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Settings, HelpCircle, LayoutGrid, Loader2, Home, Edit2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Design } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function DashboardNav() {
  const pathname = usePathname();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [designToRename, setDesignToRename] = useState<Design | null>(null);
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const openRenameDialog = (design: Design) => {
    setDesignToRename(design);
    setNewName(design.name);
  };

  const handleRename = async () => {
    if (!user || !designToRename || !newName.trim()) return;

    setIsRenaming(true);
    try {
      const docRef = doc(firestore, 'designers', user.uid, 'designs', designToRename.id);
      await updateDoc(docRef, { name: newName.trim(), lastModified: new Date().toISOString() });
      toast({ title: "Design Renamed", description: `Successfully renamed to "${newName.trim()}".` });
      setDesignToRename(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Rename Failed", description: error.message });
    } finally {
      setIsRenaming(false);
    }
  };

  const designsQuery = useMemoFirebase(() =>
    user ? collection(firestore, 'designers', user.uid, 'designs') : null
    , [firestore, user]);

  const { data: designs, isLoading } = useCollection<Design>(designsQuery);

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-12 h-12 text-primary" />
          <span className="text-xl font-semibold">FurniVision</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href="/dashboard/design/new">
            <Plus className="mr-2" />
            New Design
          </Link>
        </Button>
        <SidebarMenu className="mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Home />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="mt-6 mb-2 text-sm font-semibold text-muted-foreground px-2">My Designs</p>
        <SidebarMenu>
          {isLoading && <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" />}
          {designs?.map((design) => (
            <SidebarMenuItem key={design.id}>
              <div className="flex items-center w-full group">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/dashboard/design/${design.id}`}
                  className="flex-1"
                >
                  <Link href={`/dashboard/design/${design.id}`}>
                    <LayoutGrid />
                    <span className="truncate">{design.name}</span>
                  </Link>
                </SidebarMenuButton>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openRenameDialog(design);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                  <span className="sr-only">Rename Design</span>
                </Button>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/support'}>
              <Link href="/dashboard/support">
                <HelpCircle />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings')}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={!!designToRename} onOpenChange={(open) => !open && setDesignToRename(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Design</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDesignToRename(null)} disabled={isRenaming}>Cancel</Button>
            <Button onClick={handleRename} disabled={isRenaming || !newName.trim() || newName === designToRename?.name}>
              {isRenaming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
