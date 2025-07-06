
// use server'
'use server';

/**
 * @fileOverview Analyzes real-time OHLCV data to identify market trends and chart patterns.
 *
 * - analyzeMarketTrend - A function that analyzes market trend.
 * - AnalyzeMarketTrendInput - The input type for the analyzeMarketTrend function.
 * - AnalyzeMarketTrendOutput - The return type for the analyzeMarketTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketTrendInputSchema = z.object({
  ohlcvData: z
    .string()
    .describe(
      'Recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair (e.g., BTC/USDT) across a specific time interval (e.g., 15m, 1h, 1d). The analysis should focus on the 1-day timeframe based on this data.'
    ),
});
export type AnalyzeMarketTrendInput = z.infer<typeof AnalyzeMarketTrendInputSchema>;

const AnalyzeMarketTrendOutputSchema = z.object({
  marketTrend: z
    .string()
    .describe(
      'The current market trend (uptrend, downtrend, or sideways movement) and any visible chart patterns (e.g., double top, flag, triangle).'
    ),
  recentCandleAnalysis: z
    .string()
    .describe(
      'Detailed analysis of recent significant daily candles, including their specific high and low prices, and any identified liquidity sweep patterns with implications. Focus on the 1-day timeframe.'
    ),
  crtAnalysis:
    z.string().describe('Comment on risk exposure. Is the asset currently in a high-risk overbought or oversold zone?'),
  supportResistanceLevels:
    z.string().describe('The nearest strong support and resistance zones from the data.'),
  breakoutSignals:
    z.string().describe('Potential breakout or breakdown scenarios based on volume spikes, tight consolidations, or resistance tests.'),
  shortTermOutlook:
    z.string().describe('Possible short-term price movement and mention if it’s a good entry/exit point, focusing on the 1-day timeframe.'),
});
export type AnalyzeMarketTrendOutput = z.infer<typeof AnalyzeMarketTrendOutputSchema>;

export async function analyzeMarketTrend(input: AnalyzeMarketTrendInput): Promise<AnalyzeMarketTrendOutput> {
  return analyzeMarketTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketTrendPrompt',
  input: {schema: AnalyzeMarketTrendInputSchema},
  output: {schema: AnalyzeMarketTrendOutputSchema},
  prompt: `You are an expert technical analyst specializing in identifying subtle market signals and patterns from OHLCV data, with a focus on the 1-day timeframe.

You will be given recent real-time OHLCV (Open, High, Low, Close, Volume) candlestick data for a trading pair (e.g., BTC/USDT). Use this data to perform in-depth technical analysis and respond with the following insights. Be specific and detailed in your explanations:

1. 📈 **Current Market Trend & Key Patterns (1-Day Timeframe)** — Indicate the prevailing market trend (uptrend, downtrend, or sideways/consolidation). Explicitly identify any significant chart patterns (e.g., head and shoulders, double top/bottom, flags, pennants, triangles, wedges) and noteworthy candlestick patterns (e.g., doji, hammer, engulfing) that support your trend assessment. Elaborate on the implications of these patterns based on daily candles.

2. 🕯️ **Recent Daily Candle Analysis (1-Day Timeframe)**
    *   **Candle Range:** For the most recent significant daily candles (e.g., last 1-3 candles or candles forming key patterns), explicitly state their **High and Low prices**.
    *   **Liquidity Sweeps:** Identify any **Liquidity Sweep patterns** on the 1-day chart. Look for instances where price wicked significantly above a recent key daily high or below a recent key daily low and then quickly reversed, closing back near or within the previous candle's range. These sweeps often indicate stop-loss hunting or absorption of orders at key levels. Describe the candle(s) involved (e.g., date/timestamp if available, high/low of the wick) and the potential implications for future price movement.

3. 🧠 **Comprehensive CRT Analysis (Current Risk & Trend)** — Provide a detailed comment on risk exposure based on the daily chart. Is the asset currently in a high-risk overbought or oversold zone? Assess the strength and conviction of the current trend. Are there signs of trend exhaustion or continuation?

4. 🔻 **Key Support & 🔺 Resistance Levels (1-Day Timeframe)** — Identify the nearest strong support and resistance zones based on daily price action. Explain why these levels are significant (e.g., previous swing highs/lows on the daily chart, psychological levels, high volume nodes if inferable).

5. 💥 **Emerging Breakout & Breakdown Signals (1-Day Timeframe)** — Detect potential breakout (bullish) or breakdown (bearish) scenarios on the daily chart. Detail the specific signals (e.g., sustained volume spikes on attempted breakouts, price testing a key daily level multiple times, narrowing consolidation ranges prior to a move). Assess the probability and potential targets for such moves.

6. ⏳ **Detailed Short-Term Outlook & Actionable Advice (Focus on 1-Day Chart)** — Forecast possible short-term price movement with conviction, primarily based on the 1-day chart analysis. Mention specific price targets if possible. Clearly state if it’s a potentially good entry/exit point for a trader whose strategy aligns with daily chart signals (e.g., swing trader). Include any important caveats or conditions for your outlook.

Use indicators only if directly inferable from price & volume action (no complex indicators like RSI or MACD unless their signals are clearly visible in P&V). Prioritize actionable insights and avoid overly vague statements. Provide reasoning for your conclusions.

### Data:
{{{ohlcvData}}}

Respond in clear markdown format with emojis. Be professional and insightful, aiming to provide a deeper understanding of the market dynamics from a 1-day perspective.`,
});

const analyzeMarketTrendFlow = ai.defineFlow(
  {
    name: 'analyzeMarketTrendFlow',
    inputSchema: AnalyzeMarketTrendInputSchema,
    outputSchema: AnalyzeMarketTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

