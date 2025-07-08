/**
 * This route handler exposes the Genkit flows as API endpoints.
 *
 * It uses the Genkit Next.js plugin to create the endpoints.
 *
 * See: https://firebase.google.com/docs/genkit/nextjs-api-routes
 */
import { createAppHostingEndpoints } from '@genkit-ai/next/app';
import { ai } from '@/ai/genkit';

// Make sure to import all the flows you want to expose.
import '@/ai/flows/ai-tutor-flow';
import '@/ai/flows/campus-guide';
import '@/ai/flows/find-study-buddy';
import '@/ai/flows/summarize-course-reviews';
import '@/ai/flows/wellness-coach-flow';
import '@/ai/flows/text-to-speech-flow';

export const { GET, POST } = createAppHostingEndpoints({
  ai,
});
