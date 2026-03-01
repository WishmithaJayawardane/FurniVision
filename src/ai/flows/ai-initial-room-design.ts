'use server';
/**
 * @fileOverview An AI agent for generating an initial 2D room design and color palette.
 *
 * - initialRoomDesign - A function that handles the generation of an initial room design.
 * - InitialRoomDesignInput - The input type for the initialRoomDesign function.
 * - InitialRoomDesignOutput - The return type for the initialRoomDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialRoomDesignInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A text description of the desired room style, mood, and functional needs.'
    ),
});
export type InitialRoomDesignInput = z.infer<typeof InitialRoomDesignInputSchema>;

const InitialRoomDesignOutputSchema = z.object({
  layoutDescription: z
    .string()
    .describe(
      'A detailed text description of the initial 2D room layout with placeholder furniture, including furniture types, approximate positions, and general arrangement suitable for a 2D visualization.'
    ),
  suggestedColorPalette: z
    .array(z.string())
    .describe(
      'An array of suggested color hex codes (e.g., "#RRGGBB") or descriptive color names for the room and placeholder furniture.'
    ),
});
export type InitialRoomDesignOutput = z.infer<typeof InitialRoomDesignOutputSchema>;

export async function initialRoomDesign(
  input: InitialRoomDesignInput
): Promise<InitialRoomDesignOutput> {
  return initialRoomDesignFlow(input);
}

const initialRoomDesignPrompt = ai.definePrompt({
  name: 'initialRoomDesignPrompt',
  input: {schema: InitialRoomDesignInputSchema},
  output: {schema: InitialRoomDesignOutputSchema},
  prompt: `You are an expert interior designer specializing in creating initial room layouts and color palettes.
Based on the customer's description, generate an initial 2D room layout with placeholder furniture and a suitable color palette.
The layout description should be textual, focusing on the arrangement and types of furniture. The color palette should consist of harmonious colors suitable for the described style and mood.

Customer Description: {{{description}}}

Generate the output in the specified JSON format, ensuring the layoutDescription is a single string and suggestedColorPalette is an array of strings.`,
});

const initialRoomDesignFlow = ai.defineFlow(
  {
    name: 'initialRoomDesignFlow',
    inputSchema: InitialRoomDesignInputSchema,
    outputSchema: InitialRoomDesignOutputSchema,
  },
  async input => {
    const {output} = await initialRoomDesignPrompt(input);
    return output!;
  }
);
