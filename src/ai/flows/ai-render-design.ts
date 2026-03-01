'use server';
/**
 * @fileOverview An AI agent for generating a photorealistic render of a room design.
 *
 * - aiRenderDesign - A function that handles the generation of a realistic room render.
 * - AiRenderDesignInput - The input type for the aiRenderDesign function.
 * - AiRenderDesignOutput - The return type for the aiRenderDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  x: z.number().describe('The x-coordinate of the furniture\'s top-left corner in inches, from a top-down 2D perspective.'),
  y: z.number().describe('The y-coordinate of the furniture\'s top-left corner in inches, from a top-down 2D perspective.'),
  rotation: z.number().describe('The rotation of the furniture in degrees.'),
  color: z.string().describe('The hex color code of the furniture.'),
  material: z.string().describe('The primary material of the furniture (e.g., "Wood", "Leather", "Fabric").'),
  style: z.string().describe('The style of the furniture (e.g., "Modern", "Rustic").'),
  imageUrl: z.string(),
  imageHint: z.string(),
});

export type AiRenderDesignInput = z.infer<typeof AiRenderDesignInputSchema>;
const AiRenderDesignInputSchema = z.object({
  room: RoomSchema,
  furniture: z.array(FurnitureSchema),
});

export type AiRenderDesignOutput = z.infer<typeof AiRenderDesignOutputSchema>;
const AiRenderDesignOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the generated image in PNG format."),
});

export async function aiRenderDesign(input: AiRenderDesignInput): Promise<AiRenderDesignOutput> {
  return aiRenderDesignFlow(input);
}

const aiRenderDesignFlow = ai.defineFlow(
  {
    name: 'aiRenderDesignFlow',
    inputSchema: AiRenderDesignInputSchema,
    outputSchema: AiRenderDesignOutputSchema,
  },
  async (input) => {
    // This feature is disabled due to billing/quota issues.
    // The implementation is commented out to prevent server instability.
    /*
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `You are a photorealistic interior design rendering engine. Generate a high-quality, realistic image of a room based on the following specifications. The image should be from a perspective view, as if someone is standing in the room, looking into it. Do not include any people in the image.

Room specifications:
- Dimensions: A rectangular room that is ${input.room.width} feet wide by ${input.room.depth} feet deep.
- Walls and Floor: The walls and floor should have a color similar to ${input.room.color}. Assume standard ceiling height.

Furniture placement:
The following furniture items are placed in the room. Their 'x' and 'y' coordinates are based on a 2D top-down view of the room floor, with (0,0) being the top-left corner. The room's total size in this 2D view is (${input.room.width * 12} inches, ${input.room.depth * 12} inches). Interpret these 2D coordinates to create a plausible and aesthetically pleasing 3D arrangement. Avoid placing furniture where it clips through other furniture or walls.

Furniture list:
${input.furniture.map(f => `- A "${f.style} ${f.name}" (type: ${f.type}).
  - Color: ${f.color}.
  - Material: ${f.material}.
  - Dimensions: ${f.width} inches wide, ${f.depth} inches deep.
  - Placement: The top-left corner is at (${f.x} inches from the left wall, ${f.y} inches from the top wall in a top-down view). It is rotated by ${f.rotation} degrees.`).join('\n')}

Produce a beautiful, well-lit, and inviting image of the designed room. The final image should not contain any text, labels, or dimensions. It should look like a real photograph. Generate a 16:9 aspect ratio image.`,
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return { imageUrl: media.url };
    */
   throw new Error("AI Rendering is currently disabled.");
  }
);
