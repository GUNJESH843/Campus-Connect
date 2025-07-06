'use server';
/**
 * @fileOverview An AI agent for matching students with study buddies.
 *
 * - findStudyBuddy - A function that handles the study buddy matching process.
 * - FindStudyBuddyInput - The input type for the findStudyBuddy function.
 * - FindStudyBuddyOutput - The return type for the findStudyBuddy function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { StudentProfile } from '@/lib/data';

const FindStudyBuddyInputSchema = z.object({
  currentUser: z.object({
    name: z.string(),
    major: z.string(),
    courses: z.array(z.string()),
    studyStyle: z.string(),
  }),
  potentialBuddies: z.array(
    z.object({
      name: z.string(),
      major: z.string(),
      courses: z.array(z.string()),
      studyStyle: z.string(),
    })
  ),
});
export type FindStudyBuddyInput = z.infer<typeof FindStudyBuddyInputSchema>;

const FindStudyBuddyOutputSchema = z.object({
  matches: z.array(
    z.object({
      name: z.string().describe('The name of the matched study buddy.'),
      similarityScore: z
        .number()
        .describe('A score from 0 to 100 indicating compatibility.'),
      reason: z
        .string()
        .describe('A brief explanation for why this is a good match.'),
      matchedCourses: z.array(z.string()),
    })
  ),
});
export type FindStudyBuddyOutput = z.infer<typeof FindStudyBuddyOutputSchema>;

export async function findStudyBuddy(
  input: FindStudyBuddyInput
): Promise<FindStudyBuddyOutput> {
  return findStudyBuddyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findStudyBuddyPrompt',
  input: { schema: FindStudyBuddyInputSchema },
  output: { schema: FindStudyBuddyOutputSchema },
  prompt: `You are an AI that helps college students find compatible study buddies.
  Your goal is to find the best matches for a student based on their major, courses, and study style.

  The current user is:
  Name: {{{currentUser.name}}}
  Major: {{{currentUser.major}}}
  Courses: {{#each currentUser.courses}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Study Style: {{{currentUser.studyStyle}}}

  Here is a list of potential study buddies:
  {{#each potentialBuddies}}
  - Name: {{name}}
    Major: {{major}}
    Courses: {{#each courses}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    Study Style: {{studyStyle}}
  {{/each}}

  Analyze the list and find up to 3 of the most compatible study buddies for the current user.
  A good match is someone who:
  1. Is taking at least one of the same courses. This is the most important factor.
  2. Has a similar major.
  3. Has a compatible study style (e.g., 'Quiet' and 'Focused' are compatible, 'Group' and 'Collaborative' are compatible).

  For each match, provide a compatibility score from 0-100, a brief reason for the match, and a list of the courses you have in common.
  Do not match the user with themselves.
  If no good matches are found, return an empty array for "matches".
  `,
});

const findStudyBuddyFlow = ai.defineFlow(
  {
    name: 'findStudyBuddyFlow',
    inputSchema: FindStudyBuddyInputSchema,
    outputSchema: FindStudyBuddyOutputSchema,
  },
  async (input) => {
    // Filter out the current user from the list of potential buddies
    const otherStudents = input.potentialBuddies.filter(
      (buddy) => buddy.name !== input.currentUser.name
    );

    const { output } = await prompt({ ...input, potentialBuddies: otherStudents });
    return output!;
  }
);
