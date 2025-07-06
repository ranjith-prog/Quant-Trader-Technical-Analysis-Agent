
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  symbol: z.string().min(1, "Symbol cannot be empty.").max(10, "Symbol too long.").regex(/^[a-zA-Z0-9]+$/, "Symbol can only contain letters and numbers."),
});

type DataInputFormValues = z.infer<typeof formSchema>;

interface DataInputFormProps {
  onSubmit: (symbol: string) => Promise<void>; // Changed to Promise<void> to reflect async nature
  isLoading: boolean;
}

export function DataInputForm({ onSubmit, isLoading }: DataInputFormProps) {
  const form = useForm<DataInputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "BTC", // Default symbol
    },
  });

  // Make this handler async and await the onSubmit prop
  const handleSubmit = async (values: DataInputFormValues) => {
    await onSubmit(values.symbol);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Crypto Symbol</CardTitle>
        <CardDescription>
          Enter a cryptocurrency symbol (e.g., BTC, ETH) to fetch its recent OHLCV data against USDT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crypto Symbol (e.g., BTC)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BTC"
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Fetching & Analyzing..." : "Fetch & Analyze"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
