"use client"

import { useState } from "react"
import type { Furniture, Room } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { aiColorSuggestion, type AiColorSuggestionOutput } from "@/ai/flows/ai-color-suggestion"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Palette, Wand2, Loader2, Sparkles } from "lucide-react"

type AiColorSuggesterProps = {
    room: Room
    furniture: Furniture[]
    onApplyScheme: (scheme: AiColorSuggestionOutput['suggestedColorSchemes'][0]) => void;
}

export function AiColorSuggester({ room, furniture, onApplyScheme }: AiColorSuggesterProps) {
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<AiColorSuggestionOutput | null>(null)

    const handleGenerate = async () => {
        setIsLoading(true)
        setResult(null)
        try {
            const furnitureItems = furniture.map(f => ({
                type: f.type,
                color: f.color,
                material: f.material,
                style: f.style
            }))

            const roomDescription = `The room is ${room.width}ft by ${room.depth}ft with a height of ${room.height}ft. The current wall color is ${room.color}. The customer is looking for a harmonious and aesthetically pleasing design.`

            const response = await aiColorSuggestion({ roomDescription, furnitureItems })
            setResult(response)
            toast({
                title: "Suggestions Generated!",
                description: "AI has created new color schemes for you.",
            })
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate color suggestions. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleApplyAndClose = (scheme: AiColorSuggestionOutput['suggestedColorSchemes'][0]) => {
        onApplyScheme(scheme);
        setIsOpen(false);
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline"><Palette className="mr-2" /> Suggest Colors</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>AI Color Scheme Suggester</SheetTitle>
                    <SheetDescription>
                        Let AI suggest optimal color schemes for your room and furniture based on design principles.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 h-[calc(100vh-10rem)]">
                    <ScrollArea className="h-full pr-6">
                        {result ? (
                             <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Suggested Color Schemes</h3>
                                    {result.suggestedColorSchemes.map((scheme, i) => (
                                        <div key={i} className="mb-4 p-4 border rounded-lg">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="pr-4">
                                                    <h4 className="font-semibold text-md mb-2">{scheme.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{scheme.justification}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleApplyAndClose(scheme)}><Sparkles className="mr-2 h-4 w-4" /> Apply</Button>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">Primary:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {scheme.primaryColorsHex.map(color => <div key={color} className="w-8 h-8 rounded-full border" style={{ backgroundColor: color }} title={color} />)}
                                                </div>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">Accents:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {scheme.accentColorsHex.map(color => <div key={color} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} title={color}/>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Separator />
                                <div>
                                     <h3 className="font-semibold text-lg mb-2">Furniture Color Analysis</h3>
                                     {result.furnitureColorAnalysis.map((analysis, i) => (
                                         <div key={i} className="mb-3">
                                             <p className="font-medium">{analysis.type} ({analysis.originalColor})</p>
                                             <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
                                             {analysis.suggestedColor && <p className="text-sm">Suggestion: <span className="font-medium">{analysis.suggestedColor}</span></p>}
                                         </div>
                                     ))}
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">General Harmony Analysis</h3>
                                    <p className="text-sm text-muted-foreground">{result.generalHarmonyAnalysis}</p>
                                </div>
                             </div>
                        ) : (
                            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-10 w-10 mb-4" />
                                        <p>Generating suggestions...</p>
                                    </>
                                ) : (
                                    <>
                                        <Palette className="h-12 w-12 mb-4" />
                                        <p>Click &quot;Generate&quot; to get started.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>
                <SheetFooter>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2" /> Generate</>}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
