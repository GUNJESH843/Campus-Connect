'use server';
/**
 * @fileOverview An AI campus guide that can answer questions about locations.
 *
 * - askCampusGuide - A function that answers questions about campus locations.
 * - CampusGuideInput - The input type for the askCampusGuide function.
 * - CampusGuideOutput - The return type for the askCampusGuide function.
 */

import { ai } from '@/ai/genkit';
import { campusLocations, type CampusLocation } from '@/lib/data';
import { z } from 'genkit';

const CampusLocationSchema = z.object({
  name: z.string(),
  type: z.enum([
    'Library',
    'Dining',
    'Recreation',
    'Academic',
    'Student Services',
  ]),
  hours: z.string(),
  details: z.string(),
  coordinates: z.object({
    lat: z.number().describe('The latitude for the map pin.'),
    lng: z.number().describe('The longitude for the map pin.'),
  }),
});

const CampusGuideInputSchema = z.object({
  query: z.string().describe('The user question about a campus location.'),
});
export type CampusGuideInput = z.infer<typeof CampusGuideInputSchema>;

const CampusGuideOutputSchema = z.object({
  response: z.string().describe("The AI guide's answer to the user query."),
  location: CampusLocationSchema.optional().describe(
    'The location identified, if any, with its name and coordinates for map pinning.'
  ),
});
export type CampusGuideOutput = z.infer<typeof CampusGuideOutputSchema>;

const getLocationInfo = ai.defineTool(
  {
    name: 'getLocationInfo',
    description:
      'Get information about a specific location on campus, like its hours, purpose, and map coordinates.',
    inputSchema: z.object({
      locationName: z
        .string()
        .describe(
          'The name of the location to get information for. e.g. "Main Library", "Student Union"'
        ),
    }),
    outputSchema: CampusLocationSchema,
  },
  async (input): Promise<CampusLocation | undefined> => {
    const location = campusLocations.find(
      (loc) => loc.name.toLowerCase() === input.locationName.toLowerCase()
    );
    // The LLM will interpret a return of undefined as the tool failing to find the location.
    return location;
  }
);

export async function askCampusGuide(
  input: CampusGuideInput
): Promise<CampusGuideOutput> {
  return campusGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campusGuidePrompt',
  input: { schema: CampusGuideInputSchema },
  output: { schema: CampusGuideOutputSchema },
  tools: [getLocationInfo],
  prompt: `You are a friendly and helpful campus tour guide AI.
  A student is asking a question about the campus.
  Use the available tools to find the location and answer their question.
  If you don't know the answer or can't find the location, say that you don't have that information.
  If you use the getLocationInfo tool and find a location, you MUST populate the 'location' field in the output with all the information for that location from the tool.

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
