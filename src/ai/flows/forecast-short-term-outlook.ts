// Forecast short-term price movements and suggest potential entry/exit points based on identified patterns.
'use server';
/**
 * @fileOverview Forecasts short-term price movements and suggests potential entry/exit points.
 *
 * - forecastShortTermOutlook - A function that forecasts short-term price movements and suggests potential entry/exit points.
 * - ForecastShortTermOutlookInput - The input type for the forecastShortTermOutlook function.
 * - ForecastShortTermOutlookOutput - The return type for the forecastShortTermOutlook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastShortTermOutlookInputSchema = z.object({
  ohlcvData: z.string().describe('Recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair across a specific time interval.'),
});
export type ForecastShortTermOutlookInput = z.infer<typeof ForecastShortTermOutlookInputSchema>;

const ForecastShortTermOutlookOutputSchema = z.object({
  trend: z.enum(['uptrend', 'downtrend', 'sideways']).describe('The current market trend.'),
  crtAnalysis: z.string().describe('Analysis of the current risk and trend (CRT), including whether the asset is in a high-risk overbought or oversold zone.'),
  supportLevel: z.string().describe('The nearest strong support level.'),
  resistanceLevel: z.string().describe('The nearest strong resistance level.'),
  breakoutSignal: z.string().describe('Potential breakout or breakdown scenarios.'),
  shortTermOutlook: z.string().describe('Forecast of possible short-term price movement and suggestions for entry/exit points.'),
});
export type ForecastShortTermOutlookOutput = z.infer<typeof ForecastShortTermOutlookOutputSchema>;

export async function forecastShortTermOutlook(input: ForecastShortTermOutlookInput): Promise<ForecastShortTermOutlookOutput> {
  return forecastShortTermOutlookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastShortTermOutlookPrompt',
  input: {schema: ForecastShortTermOutlookInputSchema},
  output: {schema: ForecastShortTermOutlookOutputSchema},
  prompt: `You are an expert technical analyst.

You will be given recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair (e.g., BTC/USDT) across a specific time interval (e.g., 15m, 1h, 1d). Use this data to perform technical analysis and respond with the following insights:

1. 📈 Current Market Trend — Indicate whether the market is in an uptrend, downtrend, or sideways movement. Mention any visible chart patterns (e.g., double top, flag, triangle).
2. 🧠 CRT Analysis (Current Risk & Trend) — Comment on risk exposure. Is the asset currently in a high-risk overbought or oversold zone?
3. 🔻 Support & 🔺 Resistance Levels — Identify the nearest strong support and resistance zones from the data.
4. 💥 Breakout Signals — Detect potential breakout or breakdown scenarios based on volume spikes, tight consolidations, or resistance tests.
5. ⏳ Short-Term Outlook — Forecast possible short-term price movement and mention if it’s a good entry/exit point.

Use indicators only if visible from price & volume action (no indicators like RSI or MACD unless inferred).

### Data:
{{{ohlcvData}}}

Respond in clear markdown format with emojis. Be concise, actionable, and professional. Avoid vague statements. Prioritize clarity and confidence in your predictions.`,
});

const forecastShortTermOutlookFlow = ai.defineFlow(
  {
    name: 'forecastShortTermOutlookFlow',
    inputSchema: ForecastShortTermOutlookInputSchema,
    outputSchema: ForecastShortTermOutlookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
