'use server';
/**
 * @fileOverview An AI campus guide that can answer questions about locations.
 *
 * - askCampusGuide - A function that answers questions about campus locations.
 * - CampusGuideInput - The input type for the askCampusGuide function.
 * - CampusGuideOutput - The return type for the askCampusGuide function.
 */

import { ai } from '@/ai/genkit';
import { campusLocations } from '@/lib/data';
import { z } from 'genkit';

const CampusGuideInputSchema = z.object({
  query: z.string().describe('The user question about a campus location.'),
});
export type CampusGuideInput = z.infer<typeof CampusGuideInputSchema>;

const CampusGuideOutputSchema = z.object({
  response: z.string().describe('The AI guide\'s answer to the user query.'),
});
export type CampusGuideOutput = z.infer<typeof CampusGuideOutputSchema>;

const getLocationInfo = ai.defineTool(
  {
    name: 'getLocationInfo',
    description:
      'Get information about a specific location on campus, like its hours or purpose.',
    inputSchema: z.object({
      locationName: z
        .string()
        .describe(
          'The name of the location to get information for. e.g. "Main Library", "Student Union"'
        ),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const location = campusLocations.find(
      (loc) => loc.name.toLowerCase() === input.locationName.toLowerCase()
    );
    if (location) {
      return JSON.stringify(location);
    }
    return `Information for "${input.locationName}" could not be found. Available locations are: ${campusLocations.map((l) => l.name).join(', ')}`;
  }
);

export async function askCampusGuide(input: CampusGuideInput): Promise<CampusGuideOutput> {
  return campusGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campusGuidePrompt',
  input: { schema: CampusGuideInputSchema },
  output: { schema: CampusGuideOutputSchema },
  tools: [getLocationInfo],
  prompt: `You are a friendly and helpful campus tour guide AI.
  A student is asking a question about the campus.
  Use the available tools to answer their question.
  If you don't know the answer, say that you don't have that information.

  Question: {{{query}}}`,
});

const campusGuideFlow = ai.defineFlow(
  {
    name: 'campusGuideFlow',
    inputSchema: CampusGuideInputSchema,
    outputSchema: CampusGuideOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
