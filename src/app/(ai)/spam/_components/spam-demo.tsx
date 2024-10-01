"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isFormFieldRequired } from "@/lib/utils/is-form-field-required";
import { isSpamAction } from "@/server/api/actions/is-spam";
import { toast } from "sonner";

const FormSchema = z.object({
  content: z
    .string()
    .min(5, {
      message: "Message content must be at least 5 characters.",
    })
    .max(160, {
      message: "Message content must not be longer than 160 characters.",
    }),
  sender: z.string().optional(),
});

const isFieldRequired = (fieldName: keyof typeof FormSchema.shape) =>
  isFormFieldRequired(FormSchema, fieldName);

export function SpamDemo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await isSpamAction(data)
      .then((result) => {
        console.log(result);
        toast.success(result);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sender{" "}
                {!isFieldRequired("sender") && (
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Tell us a little bit about yourself"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
