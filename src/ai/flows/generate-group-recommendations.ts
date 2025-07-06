// src/ai/flows/generate-group-recommendations.ts
'use server';
/**
 * @fileOverview AI agent that provides personalized recommendations for campus groups and activities.
 *
 * - generateGroupRecommendations - A function that recommends campus groups and activities based on user interests.
 * - GenerateGroupRecommendationsInput - The input type for the generateGroupRecommendations function.
 * - GenerateGroupRecommendationsOutput - The return type for the generateGroupRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGroupRecommendationsInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of the user\u2019s interests.'),
  campusGroups: z
    .string()
    .describe('A comma-separated list of available campus groups.'),
  campusActivities: z
    .string()
    .describe('A comma-separated list of available campus activities.'),
});
export type GenerateGroupRecommendationsInput = z.infer<typeof GenerateGroupRecommendationsInputSchema>;

const GenerateGroupRecommendationsOutputSchema = z.object({
  recommendedGroups: z
    .string()
    .describe('A comma-separated list of recommended campus groups.'),
  recommendedActivities: z
    .string()
    .describe('A comma-separated list of recommended campus activities.'),
});
export type GenerateGroupRecommendationsOutput = z.infer<typeof GenerateGroupRecommendationsOutputSchema>;

export async function generateGroupRecommendations(input: GenerateGroupRecommendationsInput): Promise<GenerateGroupRecommendationsOutput> {
  return generateGroupRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGroupRecommendationsPrompt',
  input: {schema: GenerateGroupRecommendationsInputSchema},
  output: {schema: GenerateGroupRecommendationsOutputSchema},
  prompt: `You are a campus life expert who provides personalized recommendations for campus groups and activities based on student interests.

  Student Interests: {{{interests}}}
  Available Campus Groups: {{{campusGroups}}}
  Available Campus Activities: {{{campusActivities}}}

  Based on the student\'s interests, recommend relevant campus groups and activities. Provide the recommendations as comma-separated lists.

  Recommended Groups: 
  Recommended Activities: `,
});

const generateGroupRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateGroupRecommendationsFlow',
    inputSchema: GenerateGroupRecommendationsInputSchema,
    outputSchema: GenerateGroupRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
