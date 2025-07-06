
"use client";

import type { AnalysisResult } from "@/lib/types";
import { InsightCard } from "./insight-card";
import { LineChart, ShieldAlert, Rows3, Zap, Hourglass, CandlestickChart } from 'lucide-react';

interface InsightsDisplayProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

export function InsightsDisplay({ analysisResult, isLoading }: InsightsDisplayProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InsightCard title="Market Trend" icon={LineChart} isLoading={true} />
        <InsightCard title="Recent Candle Analysis" icon={CandlestickChart} isLoading={true} />
        <InsightCard title="CRT Analysis" icon={ShieldAlert} isLoading={true} />
        <InsightCard title="Support & Resistance" icon={Rows3} isLoading={true} />
        <InsightCard title="Breakout Signals" icon={Zap} isLoading={true} />
        <InsightCard title="Short-Term Outlook" icon={Hourglass} isLoading={true} />
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8 text-center h-full">
        <p className="text-muted-foreground">
          Submit OHLCV data to view AI-powered trading insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <InsightCard
        title="📈 Current Market Trend"
        icon={LineChart}
        content={analysisResult.marketTrend}
      />
      <InsightCard
        title="🕯️ Recent Candle Analysis"
        icon={CandlestickChart}
        content={analysisResult.recentCandleAnalysis}
      />
      <InsightCard
        title="🧠 CRT Analysis"
        icon={ShieldAlert}
        content={analysisResult.crtAnalysis}
      />
      <InsightCard
        title="🔻 Support & 🔺 Resistance"
        icon={Rows3}
        content={analysisResult.supportResistanceLevels}
      />
      <InsightCard
        title="💥 Breakout Signals"
        icon={Zap}
        content={analysisResult.breakoutSignals}
      />
      <InsightCard
        title="⏳ Short-Term Outlook"
        icon={Hourglass}
        content={analysisResult.shortTermOutlook}
      />
    </div>
  );
}

