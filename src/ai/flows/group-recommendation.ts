// src/ai/flows/group-recommendation.ts
'use server';
/**
 * @fileOverview AI agent that provides personalized recommendations for campus groups and activities.
 *
 * - recommendGroups - A function that recommends campus groups and activities based on user interests.
 * - GroupRecommendationInput - The input type for the recommendGroups function.
 * - GroupRecommendationOutput - The return type for the recommendGroups function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GroupRecommendationInputSchema = z.object({
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
export type GroupRecommendationInput = z.infer<typeof GroupRecommendationInputSchema>;

const GroupRecommendationOutputSchema = z.object({
  recommendedGroups: z
    .string()
    .describe('A comma-separated list of recommended campus groups.'),
  recommendedActivities: z
    .string()
    .describe('A comma-separated list of recommended campus activities.'),
});
export type GroupRecommendationOutput = z.infer<typeof GroupRecommendationOutputSchema>;

export async function recommendGroups(input: GroupRecommendationInput): Promise<GroupRecommendationOutput> {
  return recommendGroupsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'groupRecommendationPrompt',
  input: {schema: GroupRecommendationInputSchema},
  output: {schema: GroupRecommendationOutputSchema},
  prompt: `You are a campus life expert who provides personalized recommendations for campus groups and activities based on student interests.

  Student Interests: {{{interests}}}
  Available Campus Groups: {{{campusGroups}}}
  Available Campus Activities: {{{campusActivities}}}

  Based on the student's interests, recommend relevant campus groups and activities. Provide the recommendations as comma-separated lists.

  Recommended Groups: 
  Recommended Activities: `,
});

const recommendGroupsFlow = ai.defineFlow(
  {
    name: 'recommendGroupsFlow',
    inputSchema: GroupRecommendationInputSchema,
    outputSchema: GroupRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
