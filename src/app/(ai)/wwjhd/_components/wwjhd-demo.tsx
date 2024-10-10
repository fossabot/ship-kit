"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  question: z.string().min(1, "Please enter a question"),
});

export function WWJHDDemo() {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/wwjhd/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-sky-700">
        What Would Jesus Have Done?
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Enter your question here..."
                    className="min-h-[100px] text-lg p-4 border-2 border-sky-200 focus:border-sky-500 rounded-lg resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Asking Jesus...
              </>
            ) : (
              "What Would Jesus Do?"
            )}
          </Button>
        </form>
      </Form>
      {isLoading && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-sky-600 animate-pulse">
            "{form.getValues().question}"
          </p>
        </div>
      )}
      {response && (
        <div className="mt-6 p-4 bg-sky-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-sky-800">Response:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}
