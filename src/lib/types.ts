import type { AnalyzeMarketTrendOutput as GenAIAnalysisResult } from '@/ai/flows/analyze-market-trend';

export interface ParsedOhlcvEntry {
  timestamp: number; // Unix timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type AnalysisResult = GenAIAnalysisResult;

export interface ChartDataPoint {
  date: string; // Formatted date string for X-axis
  close: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
}
