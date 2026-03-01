'use server';
/**
 * @fileOverview An AI agent for automatically arranging furniture in a room.
 *
 * - aiAutoArrangeFurniture - A function that suggests an optimal layout for furniture.
 * - AiAutoArrangeFurnitureInput - The input type for the function.
 * - AiAutoArrangeFurnitureOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Re-using schemas similar to the render flow for consistency
const RoomSchema = z.object({
  width: z.number().describe('The width of the room in feet.'),
  depth: z.number().describe('The length of the room in feet.'),
  height: z.number().describe('The height of the room in feet.'),
  color: z.string().describe('The hex color code for the walls and floor of the room.'),
});

const FurnitureSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  width: z.number().describe('The width of the furniture in inches.'),
  depth: z.number().describe('The depth of the furniture in inches.'),
  height: z.number().describe('The height of the furniture in inches.'),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  color: z.string(),
  material: z.string(),
  style: z.string(),
  imageUrl: z.string(),
  imageHint: z.string(),
  hasShadow: z.boolean().optional(),
});

const AiAutoArrangeFurnitureInputSchema = z.object({
  room: RoomSchema,
  furniture: z.array(FurnitureSchema),
});
export type AiAutoArrangeFurnitureInput = z.infer<typeof AiAutoArrangeFurnitureInputSchema>;

const AiAutoArrangeFurnitureOutputSchema = z.object({
    furniture: z.array(
        z.object({
            id: z.string().describe("The unique ID of the furniture item."),
            x: z.number().describe("The new x-coordinate of the furniture's top-left corner in inches."),
            y: z.number().describe("The new y-coordinate of the furniture's top-left corner in inches."),
            rotation: z.number().describe("The new rotation of the furniture in degrees."),
        })
    )
});
export type AiAutoArrangeFurnitureOutput = z.infer<typeof AiAutoArrangeFurnitureOutputSchema>;


export async function aiAutoArrangeFurniture(input: AiAutoArrangeFurnitureInput): Promise<AiAutoArrangeFurnitureOutput> {
  return aiAutoArrangeFurnitureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAutoArrangeFurniturePrompt',
  input: {schema: AiAutoArrangeFurnitureInputSchema},
  output: {schema: AiAutoArrangeFurnitureOutputSchema},
  prompt: `You are an expert interior designer. Your task is to arrange the given furniture within the specified room dimensions to create a functional and aesthetically pleasing layout.

Room Dimensions:
- Width: {{{room.width}}} feet
- Length: {{{room.depth}}} feet
(1 foot = 12 inches)

Furniture to arrange:
{{#each furniture}}
- Name: {{{this.name}}} (ID: {{{this.id}}})
  - Type: {{{this.type}}}
  - Dimensions: {{{this.width}}} inches wide x {{{this.depth}}} inches deep
{{/each}}

Please provide new 'x', 'y', and 'rotation' values for each furniture item.
- 'x' and 'y' are the coordinates of the top-left corner of the item in inches, with (0,0) being the top-left corner of the room.
- Do not place items outside the room boundaries. The room is {{{room.width}}} feet wide by {{{room.depth}}} feet long. Item coordinates must respect these boundaries when converted to inches.
- Ensure furniture does not overlap. Leave reasonable space for movement and interaction (e.g., space to pull out a dining chair).
- Consider common design principles. For example, sofas often face a focal point, beds have their head against a wall, and rugs are centered in a seating area.

Your output must be a JSON object containing a "furniture" array, where each element has the 'id', 'x', 'y', and 'rotation'.`,
});

const aiAutoArrangeFurnitureFlow = ai.defineFlow(
  {
    name: 'aiAutoArrangeFurnitureFlow',
    inputSchema: AiAutoArrangeFurnitureInputSchema,
    outputSchema: AiAutoArrangeFurnitureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
