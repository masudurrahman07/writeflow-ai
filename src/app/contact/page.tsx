"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      reset();
      setTimeout(() => setSent(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-6">We&apos;d love to hear from you! Fill out the form and our team will respond within 24 hours.</p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder="Full Name" {...register("name")}
            aria-invalid={!!errors.name} />
          {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
          <Input placeholder="Email" type="email" {...register("email")}
            aria-invalid={!!errors.email} />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          <Input placeholder="Subject" {...register("subject")}
            aria-invalid={!!errors.subject} />
          {errors.subject && <span className="text-xs text-destructive">{errors.subject.message}</span>}
          <Textarea placeholder="Message" rows={5} {...register("message")}
            aria-invalid={!!errors.message} />
          {errors.message && <span className="text-xs text-destructive">{errors.message.message}</span>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
          {sent && <span className="block text-success text-center mt-2">Message sent! We&apos;ll get back to you within 24 hours.</span>}
        </form>
      </div>
      <Card className="mt-8 md:mt-0">
        <CardHeader>
          <CardTitle>Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="font-semibold">Email:</span> <a href="mailto:hello@writeflow.ai" className="text-primary underline">hello@writeflow.ai</a>
          </div>
          <div>
            <span className="font-semibold">Location:</span> San Francisco, CA
          </div>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com/writeflowai" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-primary"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg></a>
            <a href="https://linkedin.com/company/writeflowai" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-primary"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59zm0 0"/></svg></a>
            <a href="https://github.com/writeflowai" target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-primary"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.012-1.243-.018-2.25-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z"/></svg></a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
