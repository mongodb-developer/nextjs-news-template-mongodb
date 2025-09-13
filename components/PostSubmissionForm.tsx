"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSubmissionSchema, type PostSubmission } from "@/lib/schemas";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitPost } from "@/lib/actions";

export function PostSubmissionForm() {
  const form = useForm<PostSubmission>({
    resolver: zodResolver(PostSubmissionSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const handleSubmit = async (data: PostSubmission) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("url", data.url);

      await submitPost(formData);

      form.reset();
      toast.success("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit post");
    }
  };

  return (
    <div className="border border-[#023430] rounded-lg p-6 bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="title..."
                    {...field}
                    className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="url..."
                    {...field}
                    className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00ED64] text-[#001E2B] hover:bg-[#00684A] hover:text-white font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}