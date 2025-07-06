'use server';
/**
 * @fileOverview An AI agent for summarizing course reviews.
 *
 * - summarizeCourseReviews - A function that takes reviews and returns a summary.
 * - SummarizeCourseReviewsInput - The input type.
 * - SummarizeCourseReviewsOutput - The return type.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeCourseReviewsInputSchema = z.object({
  courseName: z.string(),
  reviews: z.array(z.string()).describe('A list of student reviews for the course.'),
});
export type SummarizeCourseReviewsInput = z.infer<typeof SummarizeCourseReviewsInputSchema>;

const SummarizeCourseReviewsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A brief, neutral summary of the key points from the reviews.'),
});
export type SummarizeCourseReviewsOutput = z.infer<
  typeof SummarizeCourseReviewsOutputSchema
>;

export async function summarizeCourseReviews(
  input: SummarizeCourseReviewsInput
): Promise<SummarizeCourseReviewsOutput> {
  return summarizeReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: { schema: SummarizeCourseReviewsInputSchema },
  output: { schema: SummarizeCourseReviewsOutputSchema },
  prompt: `You are an academic advisor AI. Your task is to summarize student feedback for a college course to help other students make an informed decision.

  Course Name: {{{courseName}}}

  Please read the following reviews and provide a concise, balanced summary. Mention both positive and negative points if they exist. Do not use bullet points.

  Reviews:
  {{#each reviews}}
  - "{{{this}}}"
  {{/each}}
  `,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeCourseReviewsInputSchema,
    outputSchema: SummarizeCourseReviewsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
