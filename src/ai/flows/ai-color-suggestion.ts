'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting optimal color schemes for a room and its furniture.
 *
 * - aiColorSuggestion - A function that suggests color schemes and provides justifications for furniture color matching.
 * - AiColorSuggestionInput - The input type for the aiColorSuggestion function.
 * - AiColorSuggestionOutput - The return type for the aiColorSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiColorSuggestionInputSchema = z.object({
  roomDescription: z
    .string()
    .describe(
      'A detailed description of the room, including its size, shape, existing color scheme (walls, floor), and any specific mood or style preferences.'
    ),
  furnitureItems: z
    .array(
      z.object({
        type: z.string().describe('The type of furniture item (e.g., Sofa, Dining Table, Armchair).'),
        color: z.string().describe('The current or desired color of the furniture item (e.g., "Navy Blue", "Walnut").'),
        material: z
          .string()
          .describe('The material of the furniture item (e.g., "Velvet", "Oak Wood", "Leather").'),
        style: z.string().describe('The style of the furniture item (e.g., "Modern", "Rustic", "Mid-century").'),
      })
    )
    .describe('An array of furniture items present in the room, each with its type, color, material, and style.'),
});
export type AiColorSuggestionInput = z.infer<typeof AiColorSuggestionInputSchema>;

const AiColorSuggestionOutputSchema = z.object({
  suggestedColorSchemes: z
    .array(
      z.object({
        name: z.string().describe('A name for the suggested color scheme (e.g., "Coastal Breeze", "Urban Chic").'),
        primaryColorsHex: z.array(z.string()).describe('An array of primary HEX color codes for this scheme.'),
        accentColorsHex: z.array(z.string()).describe('An array of accent HEX color codes for this scheme.'),
        justification: z
          .string()
          .describe(
            'A detailed explanation of why this color scheme is suggested, considering the room and furniture characteristics, and how it achieves harmony or desired mood.'
          ),
      })
    )
    .describe('An array of suggested optimal color schemes for the room and furniture.'),
  furnitureColorAnalysis: z
    .array(
      z.object({
        type: z.string().describe('The type of the furniture item being analyzed.'),
        originalColor: z.string().describe('The original color of the furniture item.'),
        suggestedColor: z
          .string()
          .nullable()
          .describe(
            'A suggested new color for the furniture item, if a change would improve the overall harmony. Null if no change is suggested.'
          ),
        reasoning: z
          .string()
          .describe(
            'Explanation of why the original color does or does not match the suggested schemes, or why a new color is suggested.'
          ),
      })
    )
    .describe('An analysis for each furniture item, detailing if its color matches and providing suggestions or justifications.'),
  generalHarmonyAnalysis: z
    .string()
    .describe(
      'A general explanation of the overall color harmony and aesthetic coherence achieved by the suggested schemes and furniture placement.'
    ),
});
export type AiColorSuggestionOutput = z.infer<typeof AiColorSuggestionOutputSchema>;

export async function aiColorSuggestion(input: AiColorSuggestionInput): Promise<AiColorSuggestionOutput> {
  return aiColorSuggestionFlow(input);
}

const aiColorSuggestionPrompt = ai.definePrompt({
  name: 'aiColorSuggestionPrompt',
  input: {schema: AiColorSuggestionInputSchema},
  output: {schema: AiColorSuggestionOutputSchema},
  prompt: `You are an expert interior designer and color theorist. Your task is to analyze a room's description and its furniture, then suggest optimal color schemes.

Room Description:
{{{roomDescription}}}

Furniture Items:
{{#each furnitureItems}}
- Type: {{{this.type}}}
  Color: {{{this.color}}}
  Material: {{{this.material}}}
  Style: {{{this.style}}}
{{/each}}

Based on the provided room description and furniture items, please provide:
1.  **Suggested Color Schemes**: Offer 1-3 distinct color schemes that would create a harmonious and aesthetically pleasing environment. For each scheme, provide a name, an array of primary HEX color codes, an array of accent HEX color codes, and a detailed justification.
2.  **Furniture Color Analysis**: For each furniture item listed, analyze its current color in relation to the suggested schemes. Explain why the current color does or does not match, or suggest a new color if it would significantly improve the overall design. Provide clear reasoning.
3.  **General Harmony Analysis**: Summarize the overall color harmony and aesthetic coherence expected from implementing your suggestions.

Ensure your output strictly adheres to the provided JSON schema for AiColorSuggestionOutput.`,
});

const aiColorSuggestionFlow = ai.defineFlow(
  {
    name: 'aiColorSuggestionFlow',
    inputSchema: AiColorSuggestionInputSchema,
    outputSchema: AiColorSuggestionOutputSchema,
  },
  async input => {
    const {output} = await aiColorSuggestionPrompt(input);
    return output!;
  }
);
