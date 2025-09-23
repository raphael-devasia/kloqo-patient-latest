// src/ai/flows/smart-reschedule.ts
'use server';

/**
 * @fileOverview A smart appointment rescheduling AI agent.
 *
 * - smartReschedule - A function that handles the smart rescheduling process.
 * - SmartRescheduleInput - The input type for the smartReschedule function.
 * - SmartRescheduleOutput - The return type for the smartReschedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRescheduleInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user preferences for rescheduling the appointment.'),
  doctorAvailability: z
    .string()
    .describe("The doctor's availability for appointments."),
  currentSchedule: z.string().describe('The user current schedule.'),
});
export type SmartRescheduleInput = z.infer<typeof SmartRescheduleInputSchema>;

const SmartRescheduleOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe('Suggested times for rescheduling the appointment.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested rescheduling times.'),
});
export type SmartRescheduleOutput = z.infer<typeof SmartRescheduleOutputSchema>;

export async function smartReschedule(input: SmartRescheduleInput): Promise<SmartRescheduleOutput> {
  return smartRescheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReschedulePrompt',
  input: {schema: SmartRescheduleInputSchema},
  output: {schema: SmartRescheduleOutputSchema},
  prompt: `You are an AI assistant specialized in providing smart suggestions for rescheduling medical appointments.

  Given the user preferences, doctor's availability, and the user's current schedule, suggest optimal times for rescheduling the appointment.

  User Preferences: {{{userPreferences}}}
  Doctor Availability: {{{doctorAvailability}}}
  Current Schedule: {{{currentSchedule}}}

  Consider all the information provided to find the best possible rescheduling times for the user.
  Provide the suggested times and the reasoning behind your suggestions.
  Format the suggested times as a list of strings.
  `,
});

const smartRescheduleFlow = ai.defineFlow(
  {
    name: 'smartRescheduleFlow',
    inputSchema: SmartRescheduleInputSchema,
    outputSchema: SmartRescheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

