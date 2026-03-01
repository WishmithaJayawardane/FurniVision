
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Design, Furniture, Room } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getAvailableFurniture, getFurnitureIcon } from '@/lib/data';
import { Save, Trash2, Copy, Undo, Redo, Loader2, Wand2, Box, Sofa, Table2, Armchair, RectangleHorizontal, BedDouble, LampFloor } from 'lucide-react';
import { AiColorSuggester } from './ai-color-suggester';

const FurnitureIcons: Record<string, React.ElementType> = {
  Sofa,
  Table2,
  Armchair,
  RectangleHorizontal,
  BedDouble,
  LampFloor,
  Box
};
import { useToast } from '@/hooks/use-toast';
import { IsometricView } from './isometric-view';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { AiColorSuggestionOutput } from '@/ai/flows/ai-color-suggestion';
import { aiAutoArrangeFurniture, type AiAutoArrangeFurnitureInput } from '@/ai/flows/ai-auto-arrange-furniture';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const PIXELS_PER_FOOT = 20;

const useDesignHistory = (initialState: Design) => {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const setState = useCallback((action: React.SetStateAction<Design>) => {
    const currentState = history[index];
    const newState = typeof action === 'function' ? (action as (prevState: Design) => Design)(currentState) : action;

    if (JSON.stringify(currentState) === JSON.stringify(newState)) {
      return;
    }

    const newHistory = history.slice(0, index + 1);
    setHistory([...newHistory, newState]);
    setIndex(newHistory.length);
  }, [history, index]);

  const undo = () => setIndex(i => Math.max(0, i - 1));
  const redo = () => setIndex(i => Math.min(history.length - 1, i + 1));

  return {
    design: history[index],
    setDesign: setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};

export function DesignEditor({ initialDesign }: { initialDesign: Design }) {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const { design, setDesign, undo, redo, canUndo, canRedo } = useDesignHistory(initialDesign);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isArranging, setIsArranging] = useState(false);
  const [is3dViewOpen, setIs3dViewOpen] = useState(false);

  const availableFurniture = getAvailableFurniture();

  const roomDimensions = useMemo(() => ({
    width: design.room.width * PIXELS_PER_FOOT,
    height: design.room.depth * PIXELS_PER_FOOT,
  }), [design.room.width, design.room.depth]);

  const selectedFurniture = useMemo(() => {
    return design.furniture.find(f => f.id === selectedFurnitureId);
  }, [design.furniture, selectedFurnitureId]);

  const handleSave = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to save." });
      return;
    }
    setIsSaving(true);
    const designToSave = {
      ...design,
      lastModified: new Date().toISOString(),
    };
    const designDocRef = doc(firestore, 'designers', user.uid, 'designs', design.id);

    try {
      await setDoc(designDocRef, designToSave, { merge: true });
      toast({ title: "Design Saved!", description: `${design.name} has been saved.` });

      if (window.location.pathname.endsWith('/new')) {
        router.replace(`/dashboard/design/${design.id}`);
      }
    } catch (error: any) {
      console.error("Save Failed:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsSaving(false);
    }
  };


  const handleFurnitureChange = (id: string, newProps: Partial<Furniture>) => {
    setDesign(prev => ({
      ...prev,
      furniture: prev.furniture.map(f => f.id === id ? { ...f, ...newProps } : f),
    }));
  };

  const handleRoomChange = (newProps: Partial<Room>) => {
    setDesign(prev => ({
      ...prev,
      room: { ...prev.room, ...newProps },
    }));
  };

  const handleDesignNameChange = (name: string) => {
    setDesign(prev => ({ ...prev, name }));
  }

  const addFurniture = (furnitureTemplate: Omit<Furniture, 'id' | 'x' | 'y' | 'rotation'>) => {
    const newFurniture: Furniture = {
      ...furnitureTemplate,
      id: `fur_${new Date().getTime()}`,
      x: (design.room.width * 12) / 2 - furnitureTemplate.width / 2,
      y: (design.room.depth * 12) / 2 - furnitureTemplate.depth / 2,
      rotation: 0
    };
    setDesign(prev => ({ ...prev, furniture: [...prev.furniture, newFurniture] }));
    setSelectedFurnitureId(newFurniture.id);
  };

  const removeFurniture = (id: string) => {
    setDesign(prev => ({ ...prev, furniture: prev.furniture.filter(f => f.id !== id) }));
    setSelectedFurnitureId(null);
  }

  const duplicateFurniture = (id: string) => {
    const original = design.furniture.find(f => f.id === id);
    if (!original) return;

    const newFurniture: Furniture = {
      ...original,
      id: `fur_${new Date().getTime()}`,
      x: original.x + 24, // Offset by 2 feet (24 inches)
      y: original.y + 24,
    };

    setDesign(prev => ({ ...prev, furniture: [...prev.furniture, newFurniture] }));
    setSelectedFurnitureId(newFurniture.id);
    toast({
      title: "Item Duplicated",
      description: `A copy of "${original.name}" has been added.`
    });
  };

  const handleApplyColorScheme = (scheme: AiColorSuggestionOutput['suggestedColorSchemes'][0]) => {
    const { primaryColorsHex, accentColorsHex } = scheme;
    const colorPalette = [...primaryColorsHex, ...accentColorsHex];

    if (colorPalette.length === 0) {
      toast({ variant: "destructive", title: "Empty Palette", description: "The suggested color scheme was empty." });
      return;
    }

    setDesign(prev => {
      const newRoomColor = colorPalette[0];
      const furnitureColors = colorPalette.length > 1 ? colorPalette.slice(1) : [colorPalette[0]];

      const newFurniture = prev.furniture.map((item, index) => ({
        ...item,
        color: furnitureColors[index % furnitureColors.length]
      }));

      return {
        ...prev,
        room: { ...prev.room, color: newRoomColor },
        furniture: newFurniture,
      };
    });

    toast({
      title: "Color Scheme Applied!",
      description: `"${scheme.name}" has been applied to your design.`
    });
  };

  const handleAutoArrange = async () => {
    if (!design.furniture.length) {
      toast({ variant: 'destructive', title: 'No furniture to arrange' });
      return;
    }
    setIsArranging(true);
    try {
      const result = await aiAutoArrangeFurniture({
        room: design.room,
        furniture: design.furniture,
      } as AiAutoArrangeFurnitureInput);

      setDesign(prev => {
        const newFurniture = prev.furniture.map(f => {
          const arranged = result.furniture.find(arrangedF => arrangedF.id === f.id);
          return arranged ? { ...f, x: arranged.x, y: arranged.y, rotation: arranged.rotation } : f;
        });
        return { ...prev, furniture: newFurniture };
      });

      toast({ title: 'Furniture Arranged!', description: 'AI has suggested a new layout.' });

    } catch (error) {
      console.error("Auto-arrange failed:", error);
      toast({ variant: 'destructive', title: 'Arrange Failed', description: 'Could not arrange furniture. Please try again.' });
    } finally {
      setIsArranging(false);
    }
  };

  return (
    <div className="flex h-full min-h-[500px] min-w-[1000px] w-full bg-muted/30 rounded-lg border overflow-hidden">
      {/* Left Panel: Furniture Library */}
      <Card className="w-80 h-full flex flex-col rounded-r-none border-r">
        <CardHeader className="flex-none">
          <CardTitle>Furniture Library</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {availableFurniture.map((item, index) => (
                <div key={index} className="cursor-pointer group" onClick={() => addFurniture(item)}>
                  <Card className="overflow-hidden transition-all group-hover:shadow-md group-hover:border-primary">
                    <div className="relative aspect-video w-full bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        data-ai-hint={item.imageHint}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <div className="flex justify-between items-baseline mt-1">
                        <Badge variant="outline">{item.type}</Badge>
                        {item.price && <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Center Panel: Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="flex-none flex items-center justify-between p-2 border-b bg-background gap-4 overflow-x-auto whitespace-nowrap w-full [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}><Undo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}><Redo className="h-4 w-4" /></Button>
          </div>

          <div className="flex justify-center shrink-0">
            <Input value={design.name} onChange={(e) => handleDesignNameChange(e.target.value)} className="w-[150px] sm:w-[200px] text-center font-semibold truncate px-2" />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleAutoArrange} disabled={isArranging}>
              {isArranging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              <span className="hidden xl:inline">Arrange All</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIs3dViewOpen(true)}>
              <Box className="h-4 w-4" /> <span className="hidden xl:inline ml-2">3D View</span>
            </Button>
            <AiColorSuggester room={design.room} furniture={design.furniture} onApplyScheme={handleApplyColorScheme} />
          </div>
        </div>
        <Dialog open={is3dViewOpen} onOpenChange={setIs3dViewOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Isometric 3D View</DialogTitle>
              <DialogDescription>A simple 3D representation of your room layout.</DialogDescription>
            </DialogHeader>
            <IsometricView design={design} />
          </DialogContent>
        </Dialog>
        <div className="flex-1 p-4 overflow-auto bg-gray-100 flex items-center justify-center">
          <div
            className="relative bg-white shadow-inner"
            style={{ width: roomDimensions.width, height: roomDimensions.height, backgroundColor: design.room.color }}
            onClick={() => setSelectedFurnitureId(null)}
          >
            {design.furniture.map(item => {
              const itemWidth = item.width / 12 * PIXELS_PER_FOOT;
              const itemHeight = item.depth / 12 * PIXELS_PER_FOOT;
              const itemX = item.x / 12 * PIXELS_PER_FOOT;
              const itemY = item.y / 12 * PIXELS_PER_FOOT;
              const Icon = FurnitureIcons[getFurnitureIcon(item.type)] || Box;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'absolute flex flex-col items-center justify-center p-1 box-border border-2 cursor-pointer transition-all group',
                    selectedFurnitureId === item.id ? 'border-primary' : 'border-transparent',
                    item.hasShadow && 'drop-shadow-lg'
                  )}
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    transform: `translate(${itemX}px, ${itemY}px) rotate(${item.rotation}deg)`,
                    transformOrigin: 'center center',
                    backgroundColor: item.color,
                    zIndex: item.type === 'Rug' ? 0 : 1,
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedFurnitureId(item.id); }}
                >
                  <Icon className="w-2/3 h-2/3 text-white/60 pointer-events-none" style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.5))' }} />
                  <p className="text-xs text-center p-1 truncate text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 w-full pointer-events-none">{item.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Properties */}
      <Card className="w-80 h-full flex flex-col rounded-l-none border-l">
        <CardHeader className="flex-none">
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            {selectedFurniture ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{selectedFurniture.name}</h3>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => duplicateFurniture(selectedFurniture.id)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeFurniture(selectedFurniture.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <Accordion type="multiple" defaultValue={['transform', 'appearance']} className="w-full">
                  <AccordionItem value="transform">
                    <AccordionTrigger className="text-sm font-semibold">Transform</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="x">X Pos (in)</Label>
                          <Input id="x" type="number" value={selectedFurniture.x} onChange={e => handleFurnitureChange(selectedFurniture.id, { x: parseInt(e.target.value) })} />
                        </div>
                        <div>
                          <Label htmlFor="y">Y Pos (in)</Label>
                          <Input id="y" type="number" value={selectedFurniture.y} onChange={e => handleFurnitureChange(selectedFurniture.id, { y: parseInt(e.target.value) })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width">Width (in)</Label>
                          <Input id="width" type="number" value={selectedFurniture.width} onChange={e => handleFurnitureChange(selectedFurniture.id, { width: parseInt(e.target.value) })} />
                        </div>
                        <div>
                          <Label htmlFor="depth">Depth (in)</Label>
                          <Input id="depth" type="number" value={selectedFurniture.depth} onChange={e => handleFurnitureChange(selectedFurniture.id, { depth: parseInt(e.target.value) })} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="height">Height (in)</Label>
                        <Input id="height" type="number" value={selectedFurniture.height} onChange={e => handleFurnitureChange(selectedFurniture.id, { height: parseInt(e.target.value) })} />
                      </div>
                      <div>
                        <Label htmlFor="rotation">Rotation ({selectedFurniture.rotation}°)</Label>
                        <Slider
                          id="rotation"
                          min={0}
                          max={360}
                          step={1}
                          value={[selectedFurniture.rotation]}
                          onValueChange={([val]) => handleFurnitureChange(selectedFurniture.id, { rotation: val })}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="appearance">
                    <AccordionTrigger className="text-sm font-semibold">Appearance</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="color">Color Tint</Label>
                        <div className="flex items-center gap-2">
                          <Input id="color" value={selectedFurniture.color} onChange={e => handleFurnitureChange(selectedFurniture.id, { color: e.target.value })} className="flex-1" />
                          <Input type="color" value={selectedFurniture.color} onChange={e => handleFurnitureChange(selectedFurniture.id, { color: e.target.value })} className="p-0 h-10 w-10" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="shading">Apply Shadow</Label>
                        <Switch
                          id="shading"
                          checked={!!selectedFurniture.hasShadow}
                          onCheckedChange={checked => handleFurnitureChange(selectedFurniture.id, { hasShadow: checked })}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold">Room Settings</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room-width">Width (ft)</Label>
                    <Input id="room-width" type="number" value={design.room.width} onChange={e => handleRoomChange({ width: parseInt(e.target.value) })} />
                  </div>
                  <div>
                    <Label htmlFor="room-depth">Length (ft)</Label>
                    <Input id="room-depth" type="number" value={design.room.depth} onChange={e => handleRoomChange({ depth: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="room-height">Height (ft)</Label>
                  <Input id="room-height" type="number" value={design.room.height} onChange={e => handleRoomChange({ height: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="room-color">Floor Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="room-color" value={design.room.color} onChange={e => handleRoomChange({ color: e.target.value })} className="flex-1" />
                    <Input type="color" value={design.room.color} onChange={e => handleRoomChange({ color: e.target.value })} className="p-0 h-10 w-10" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleAutoArrange} disabled={isArranging || !design.furniture.length} className="w-full">
                    {isArranging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isArranging ? 'Arranging...' : 'Auto-Arrange All Furniture'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground pt-4">Select a furniture item to edit its properties.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

