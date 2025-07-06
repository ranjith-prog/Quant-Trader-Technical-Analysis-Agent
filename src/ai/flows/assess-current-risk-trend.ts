'use server';

/**
 * @fileOverview Assesses the current risk level (overbought/oversold) and trend strength using CRT analysis.
 *
 * - assessCurrentRiskTrend - A function that handles the CRT analysis process.
 * - AssessCurrentRiskTrendInput - The input type for the assessCurrentRiskTrend function.
 * - AssessCurrentRiskTrendOutput - The return type for the assessCurrentRiskTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCurrentRiskTrendInputSchema = z.object({
  ohlcvData: z.string().describe('Recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair.'),
});
export type AssessCurrentRiskTrendInput = z.infer<typeof AssessCurrentRiskTrendInputSchema>;

const AssessCurrentRiskTrendOutputSchema = z.object({
  riskAssessment: z.string().describe('Assessment of the current risk level (overbought/oversold).'),
  trendStrength: z.string().describe('Assessment of the current trend strength (uptrend, downtrend, sideways).'),
  crtAnalysis: z.string().describe('Overall CRT (Current Risk & Trend) analysis summary.'),
});
export type AssessCurrentRiskTrendOutput = z.infer<typeof AssessCurrentRiskTrendOutputSchema>;

export async function assessCurrentRiskTrend(input: AssessCurrentRiskTrendInput): Promise<AssessCurrentRiskTrendOutput> {
  return assessCurrentRiskTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessCurrentRiskTrendPrompt',
  input: {schema: AssessCurrentRiskTrendInputSchema},
  output: {schema: AssessCurrentRiskTrendOutputSchema},
  prompt: `You are an expert technical analyst.

You will be given recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair (e.g., BTC/USDT) across a specific time interval (e.g., 15m, 1h, 1d). Use this data to perform CRT (Current Risk & Trend) analysis and respond with the following insights:

Analyze the provided OHLCV data to determine:

1.  **Risk Assessment** - Determine if the asset is currently in a high-risk overbought or oversold zone.
2.  **Trend Strength** - Indicate the strength of the current market trend.
3.  **CRT Analysis** - Give an overal summary of your CRT (Current Risk & Trend) analysis.

Data:
{{{ohlcvData}}}

Respond in clear markdown format with emojis. Be concise, actionable, and professional. Avoid vague statements. Prioritize clarity and confidence in your assessment.

Output:
riskAssessment: {{riskAssessment}}
trendStrength: {{trendStrength}}
crtAnalysis: {{crtAnalysis}}`,
});

const assessCurrentRiskTrendFlow = ai.defineFlow(
  {
    name: 'assessCurrentRiskTrendFlow',
    inputSchema: AssessCurrentRiskTrendInputSchema,
    outputSchema: AssessCurrentRiskTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
