
// src/services/crypto-data-service.ts
import type { ParsedOhlcvEntry } from '@/lib/types';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';

/**
 * Fetches Kline (candlestick) data from Binance API.
 * @param symbol The trading symbol (e.g., BTC, ETH). Assumes USDT pair.
 * @param interval The interval for klines (e.g., '1d', '4h', '1h').
 * @param limit The number of klines to retrieve.
 * @returns A promise that resolves to an array of ParsedOhlcvEntry.
 */
export async function fetchBinanceKlines(
  symbol: string,
  interval: string = '1d',
  limit: number = 30
): Promise<ParsedOhlcvEntry[]> {
  const tradingPair = `${symbol.toUpperCase()}USDT`; // Assuming USDT as the quote currency
  const url = `${BINANCE_API_BASE_URL}/klines?symbol=${tradingPair}&interval=${interval}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
      throw new Error(
        `Failed to fetch data from Binance: ${response.status} ${response.statusText}. ${errorData.msg || ''}`.trim()
      );
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from Binance API.');
    }

    return data.map((kline: any[]): ParsedOhlcvEntry => {
      if (kline.length < 6) {
        // Binance kline data structure:
        // [0: Open time, 1: Open, 2: High, 3: Low, 4: Close, 5: Volume, ...]
        throw new Error('Unexpected kline data structure from Binance.');
      }
      return {
        timestamp: Number(kline[0]),
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
      };
    });
  } catch (error) {
    console.error('Error in fetchBinanceKlines:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while fetching crypto data.');
  }
}
