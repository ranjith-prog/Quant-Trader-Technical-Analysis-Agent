// src/ai/flows/detect-breakout-signals.ts
'use server';

/**
 * @fileOverview Detects potential breakout or breakdown scenarios based on OHLCV data.
 *
 * - detectBreakoutSignals - A function that analyzes candlestick data and identifies breakout signals.
 * - DetectBreakoutSignalsInput - The input type for the detectBreakoutSignals function.
 * - DetectBreakoutSignalsOutput - The return type for the detectBreakoutSignals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBreakoutSignalsInputSchema = z.object({
  ohlcvData: z
    .string()
    .describe(
      'Recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair. Should be formatted as a string.'
    ),
});
export type DetectBreakoutSignalsInput = z.infer<typeof DetectBreakoutSignalsInputSchema>;

const DetectBreakoutSignalsOutputSchema = z.object({
  breakoutSignals: z
    .string()
    .describe(
      'A description of potential breakout or breakdown scenarios based on volume spikes, consolidation patterns, and resistance tests.'
    ),
});
export type DetectBreakoutSignalsOutput = z.infer<typeof DetectBreakoutSignalsOutputSchema>;

export async function detectBreakoutSignals(
  input: DetectBreakoutSignalsInput
): Promise<DetectBreakoutSignalsOutput> {
  return detectBreakoutSignalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectBreakoutSignalsPrompt',
  input: {schema: DetectBreakoutSignalsInputSchema},
  output: {schema: DetectBreakoutSignalsOutputSchema},
  prompt: `You are an expert technical analyst.

You will be given recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair (e.g., BTC/USDT) across a specific time interval (e.g., 15m, 1h, 1d). Use this data to perform technical analysis and detect potential breakout or breakdown scenarios based on volume spikes, consolidation patterns, and resistance tests.

Data:
{{{ohlcvData}}}

Respond in clear markdown format with emojis. Be concise, actionable, and professional. Avoid vague statements. Prioritize clarity and confidence in your predictions.
`,
});

const detectBreakoutSignalsFlow = ai.defineFlow(
  {
    name: 'detectBreakoutSignalsFlow',
    inputSchema: DetectBreakoutSignalsInputSchema,
    outputSchema: DetectBreakoutSignalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
