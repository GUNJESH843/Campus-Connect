'use server';
/**
 * @fileOverview An AI wellness coach to help students with stress and mindfulness.
 *
 * - askWellnessCoach - A function that provides wellness advice.
 * - WellnessCoachInput - The input type for the askWellnessCoach function.
 * - WellnessCoachOutput - The return type for the askWellnessCoach function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { GenerateRequest } from 'genkit';

const WellnessCoachInputSchema = z.object({
  query: z.string().describe("The user's question or statement about their well-being."),
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
export type WellnessCoachInput = z.infer<typeof WellnessCoachInputSchema>;

const WellnessCoachOutputSchema = z.object({
  response: z.string().describe("The AI coach's response."),
});
export type WellnessCoachOutput = z.infer<typeof WellnessCoachOutputSchema>;

export async function askWellnessCoach(
  input: WellnessCoachInput
): Promise<WellnessCoachOutput> {
  return wellnessCoachFlow(input);
}

const wellnessCoachFlow = ai.defineFlow(
  {
    name: 'wellnessCoachFlow',
    inputSchema: WellnessCoachInputSchema,
    outputSchema: WellnessCoachOutputSchema,
  },
  async ({ query, history }) => {
    const systemPrompt = `You are an AI Wellness Coach for college students. Your persona is calm, empathetic, and supportive.
Your primary goal is to provide helpful, actionable advice and mindfulness exercises.
You are not a therapist. If a user expresses severe distress, thoughts of self-harm, or a mental health crisis, you MUST gently guide them to real-world resources and provide the following contact information: "Campus Counseling Services at (555) 123-4567 or the National Crisis and Suicide Lifeline at 988." Do not attempt to handle the crisis yourself.
For general stress, anxiety, or questions, provide practical tips, encouragement, or guided exercises (like breathing or grounding techniques).
Keep your responses concise and easy to understand.`;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      system: systemPrompt,
      prompt: query,
      history: history as GenerateRequest['history'],
    });

    return { response: llmResponse.text };
  }
);
