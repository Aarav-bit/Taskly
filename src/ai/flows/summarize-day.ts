'use server';
/**
 * @fileOverview Summarizes the day's completed and incomplete tasks.
 *
 * - summarizeDay - A function that handles the summarization process.
 * - SummarizeDayInput - The input type for the summarizeDay function.
 * - SummarizeDayOutput - The return type for the summarizeDay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDayInputSchema = z.object({
  completedTasks: z.array(z.string()).describe('List of completed tasks for the day.'),
  incompleteTasks: z.array(z.string()).describe('List of incomplete tasks for the day.'),
});
export type SummarizeDayInput = z.infer<typeof SummarizeDayInputSchema>;

const SummarizeDayOutputSchema = z.object({
  summary: z.string().describe('A summary of the day, including completed and incomplete tasks.'),
});
export type SummarizeDayOutput = z.infer<typeof SummarizeDayOutputSchema>;

export async function summarizeDay(input: SummarizeDayInput): Promise<SummarizeDayOutput> {
  return summarizeDayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDayPrompt',
  input: {schema: SummarizeDayInputSchema},
  output: {schema: SummarizeDayOutputSchema},
  prompt: `Summarize the day's tasks, including what was completed and what remains incomplete.\n\nCompleted Tasks:\n{{#each completedTasks}}\n- {{this}}\n{{/each}}\n\nIncomplete Tasks:\n{{#each incompleteTasks}}\n- {{this}}\n{{/each}}\n\nSummary: `,
});

const summarizeDayFlow = ai.defineFlow(
  {
    name: 'summarizeDayFlow',
    inputSchema: SummarizeDayInputSchema,
    outputSchema: SummarizeDayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
