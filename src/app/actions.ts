'use server';

import { smartReschedule, type SmartRescheduleInput, type SmartRescheduleOutput } from '@/ai/flows/smart-reschedule';
import { doctorAvailability, userSchedule } from '@/lib/data';

type ActionResult = {
    success: boolean;
    data?: SmartRescheduleOutput;
    error?: string;
};

export async function getSmartRescheduleSuggestions(preferences: string): Promise<ActionResult> {
  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const input: SmartRescheduleInput = {
      userPreferences: preferences,
      doctorAvailability: JSON.stringify(doctorAvailability),
      currentSchedule: JSON.stringify(userSchedule),
    };
    const result = await smartReschedule(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getSmartRescheduleSuggestions:', error);
    return { success: false, error: 'Failed to get AI suggestions. Please try again later.' };
  }
}
