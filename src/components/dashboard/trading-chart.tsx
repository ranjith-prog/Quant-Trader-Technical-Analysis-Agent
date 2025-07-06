"use client";

import { format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartDataPoint } from '@/lib/types';

interface TradingChartProps {
  data: ChartDataPoint[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
           <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Close
            </span>
            <span className="font-bold" style={{ color: payload.find(p => p.dataKey === 'close')?.stroke || 'hsl(var(--foreground))' }}>
              {dataPoint.close?.toFixed(2)}
            </span>
          </div>
          {dataPoint.open && (
             <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Open</span>
              <span className="font-bold text-muted-foreground">{dataPoint.open?.toFixed(2)}</span>
            </div>
          )}
          {dataPoint.high && (
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">High</span>
              <span className="font-bold text-muted-foreground">{dataPoint.high?.toFixed(2)}</span>
            </div>
          )}
          {dataPoint.low && (
             <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Low</span>
              <span className="font-bold text-muted-foreground">{dataPoint.low?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Volume
            </span>
            <span className="font-bold" style={{ color: payload.find(p => p.dataKey === 'volume')?.fill || 'hsl(var(--foreground))' }}>
              {dataPoint.volume?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export function TradingChart({ data, title = "Price & Volume Chart" }: TradingChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">No data available for chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="close" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              dot={false}
              name="Close Price"
            />
            <Bar 
              yAxisId="right" 
              dataKey="volume" 
              fill="hsl(var(--accent))" 
              name="Volume" 
              barSize={20} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
