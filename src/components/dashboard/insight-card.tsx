"use client";

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightCardProps {
  title: string;
  icon: LucideIcon;
  content?: string;
  isLoading?: boolean;
}

export function InsightCard({ title, icon: Icon, content, isLoading = false }: InsightCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : content ? (
          <div className="text-sm whitespace-pre-wrap">{content}</div>
        ) : (
          <p className="text-sm text-muted-foreground">No analysis available.</p>
        )}
      </CardContent>
    </Card>
  );
}
