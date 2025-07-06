
"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataInputForm } from '@/components/dashboard/data-input-form';
import { TradingChart } from '@/components/dashboard/trading-chart';
import { InsightsDisplay } from '@/components/dashboard/insights-display';
import { analyzeMarketTrend } from '@/ai/flows/analyze-market-trend';
import { fetchBinanceKlines } from '@/services/crypto-data-service';
import type { ParsedOhlcvEntry, AnalysisResult, ChartDataPoint } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function DashboardPage() {
  const [ohlcvInputStringForAI, setOhlcvInputStringForAI] = useState<string>('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDataSubmit = async (symbol: string): Promise<void> => {
    setIsLoading(true);
    setOhlcvInputStringForAI('');
    setChartData([]);
    setAnalysis(null);

    try {
      const parsedData: ParsedOhlcvEntry[] = await fetchBinanceKlines(symbol, '1d', 90);

      if (parsedData.length === 0) {
        toast({
          title: "No Data Found",
          description: `Could not fetch data for symbol ${symbol.toUpperCase()}. It might be an invalid symbol or pair.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      parsedData.sort((a, b) => a.timestamp - b.timestamp);

      const dataStringForAI = JSON.stringify(
        parsedData.map(p => ({
          timestamp: p.timestamp,
          open: p.open,
          high: p.high,
          low: p.low,
          close: p.close,
          volume: p.volume,
        }))
      );
      setOhlcvInputStringForAI(dataStringForAI);
    
      const formattedChartData = parsedData.map(item => ({
        date: format(new Date(item.timestamp), 'MMM dd, HH:mm'),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));
      setChartData(formattedChartData);

      const result = await analyzeMarketTrend({ ohlcvData: dataStringForAI });
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: `Trading insights for ${symbol.toUpperCase()} have been generated.`,
      });
    } catch (error) {
      console.error("Error processing data:", error);
      let errorMessage = "Could not process data. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setAnalysis(null);
      setChartData([]);
      toast({
        title: "Operation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToContent = () => {
    const contentElement = document.getElementById('main-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-svh w-full py-12 md:py-16 lg:py-20 bg-card text-card-foreground shadow-xl">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-primary">
            Quant Trader Technical Analysis Agent
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl lg:text-2xl">
            Leverage advanced AI to decode market trends, identify breakout signals, and receive actionable trading insights based on real-time OHLCV data.
          </p>
          <Button 
            onClick={scrollToContent} 
            variant="outline" 
            size="lg" 
            className="mt-10 animate-bounce"
          >
            <ArrowDown className="mr-2 h-5 w-5" />
            Explore Insights
          </Button>
        </div>
      </section>

      {/* Main Content Section */}
      <div id="main-content" className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 flex flex-col gap-8">
        {/* Data Input and Chart Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DataInputForm onSubmit={handleDataSubmit} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <TradingChart data={chartData} />
          </div>
        </div>

        {/* Insights Display Section */}
        <div>
          <InsightsDisplay analysisResult={analysis} isLoading={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}
