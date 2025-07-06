'use server';
/**
 * @fileOverview An AI tutor that can answer student questions on various subjects.
 *
 * - askAITutor - A function that answers questions.
 * - AITutorInput - The input type for the askAITutor function.
 * - AITutorOutput - The return type for the askAITutor function.
 */

import { ai } from '@/ai/genkit';
import type { GenerateRequest } from 'genkit';
import { z } from 'genkit';

const AITutorInputSchema = z.object({
  subject: z.string().describe('The academic subject of the question.'),
  query: z.string().describe("The user's question."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() })),
      })
    )
    .optional()
    .describe('The conversation history.'),
});
export type AITutorInput = z.infer<typeof AITutorInputSchema>;

const AITutorOutputSchema = z.object({
  response: z.string().describe("The AI tutor's answer to the user query."),
});
export type AITutorOutput = z.infer<typeof AITutorOutputSchema>;

export async function askAITutor(
  input: AITutorInput
): Promise<AITutorOutput> {
  return aiTutorFlow(input);
}

const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: AITutorInputSchema,
    outputSchema: AITutorOutputSchema,
  },
  async ({ subject, query, history }) => {
    const systemPrompt = `You are an expert AI Tutor. Your persona is encouraging, patient, and knowledgeable.
You are tutoring a student in: ${subject}.

Your goal is not to just give the answer, but to explain the underlying concepts and guide the student to understanding.
Break down complex topics into smaller, easy-to-digest pieces. Use examples and analogies where helpful.`;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      system: systemPrompt,
      prompt: query,
      history: history as GenerateRequest['history'], // Cast to the correct type
    });

    return { response: llmResponse.text };
  }
);
