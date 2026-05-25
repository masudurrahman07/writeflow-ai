"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, MessageSquare, Save, SendHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";

const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Persuasive",
  "Friendly",
] as const;

interface GeneratedData {
  blogPost: string;
  title: string;
  metaDescription: string;
  tags: string[];
}

interface GenerateResponse {
  success: boolean;
  data: GeneratedData;
}

interface SaveDocumentResponse {
  success: boolean;
  data: { _id: string };
}

type RewriteAction =
  | "formal"
  | "casual"
  | "persuasive"
  | "friendly"
  | "shorten"
  | "expand"
  | "fix-grammar";

interface RewriteResponse {
  success: boolean;
  data: { rewrittenText: string };
}

type ChatRole = "user" | "model";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

const REWRITE_ACTIONS: { value: RewriteAction; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
  { value: "friendly", label: "Friendly" },
  { value: "shorten", label: "Shorten" },
  { value: "expand", label: "Expand" },
  { value: "fix-grammar", label: "Fix Grammar" },
];

export default function EditorPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [audience, setAudience] = useState("");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);

  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [blogPost, setBlogPost] = useState("");

  const [rewriteText, setRewriteText] = useState("");
  const [rewriteAction, setRewriteAction] = useState<RewriteAction | null>(
    null
  );
  const [rewriting, setRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const getDocumentContext = () => {
    const parts: string[] = [];
    if (title.trim()) parts.push(`Title: ${title}`);
    if (metaDescription.trim()) parts.push(`Meta Description: ${metaDescription}`);
    if (blogPost.trim()) parts.push(blogPost);
    if (parts.length === 0 && topic.trim()) parts.push(`Topic: ${topic}`);
    return parts.join("\n\n");
  };

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    const history = chatMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: message },
    ]);
    setChatLoading(true);

    try {
      const res = await apiFetch<ChatResponse>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          documentContext: getDocumentContext(),
          history,
        }),
      });

      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "model", content: res.data.reply },
      ]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to get AI response."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Topic is required.");
      return;
    }
    if (!audience.trim()) {
      toast.error("Target audience is required.");
      return;
    }

    setGenerating(true);
    try {
      const res = await apiFetch<GenerateResponse>("/api/ai/generate-content", {
        method: "POST",
        body: JSON.stringify({ topic, tone, audience }),
      });

      const { data } = res;
      setTitle(data.title);
      setMetaDescription(data.metaDescription);
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setBlogPost(data.blogPost);
      setHasOutput(true);
      toast.success("Content generated successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate content."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!title.trim() || !blogPost.trim()) {
      toast.error("Title and blog content are required to save.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch<SaveDocumentResponse>("/api/documents", {
        method: "POST",
        body: JSON.stringify({
          title,
          content: blogPost,
          status: "draft",
        }),
      });
      toast.success("Document saved to My Documents");
      router.push("/dashboard/documents");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save document."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTagClick = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast.success(`Copied "${tag}" to clipboard`);
  };

  const handleRewrite = async () => {
    if (!rewriteText.trim() || !rewriteAction) return;

    setRewriting(true);
    try {
      const res = await apiFetch<RewriteResponse>("/api/ai/rewrite", {
        method: "POST",
        body: JSON.stringify({ text: rewriteText, action: rewriteAction }),
      });
      setRewrittenText(res.data.rewrittenText);
      toast.success("Text rewritten successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to rewrite text."
      );
    } finally {
      setRewriting(false);
    }
  };

  const handleCopyRewritten = async () => {
    if (!rewrittenText) return;
    try {
      await navigator.clipboard.writeText(rewrittenText);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleReplaceEditorContent = () => {
    if (!rewrittenText) return;
    setBlogPost(rewrittenText);
    setHasOutput(true);
    toast.success("Editor content updated");
  };

  if (!authChecked) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Chat toggle */}
      <Button
        type="button"
        size="sm"
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-r-none rounded-l-md shadow-lg gap-2 pr-3 pl-3"
        onClick={() => setChatOpen((o) => !o)}
        aria-expanded={chatOpen}
        aria-label={chatOpen ? "Close chat" : "Open chat"}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Chat</span>
      </Button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setChatOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Chat sidebar */}
      <AnimatePresence>
        {chatOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-card shadow-xl sm:max-w-[320px]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">
                AI Writing Assistant
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatMessages.length === 0 && !chatLoading && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Ask anything about your document.
                </p>
              )}
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <span className="sr-only">Thinking</span>
                    <span className="inline-flex items-center gap-1">
                      thinking
                      <span className="inline-flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask anything about your document..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  disabled={chatLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  aria-label="Send message"
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

    <div
      className={cn(
        "container py-8 md:py-12 transition-[padding] duration-300",
        chatOpen && "lg:pr-[336px]"
      )}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* LEFT — Inputs */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              AI Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="text-sm font-medium text-foreground"
              >
                Topic <span className="text-destructive">*</span>
              </label>
              <Input
                id="topic"
                placeholder="e.g. Benefits of Remote Work"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={generating}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tone
              </label>
              <Select
                value={tone}
                onValueChange={setTone}
                disabled={generating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="audience"
                className="text-sm font-medium text-foreground"
              >
                Target Audience
              </label>
              <Input
                id="audience"
                placeholder="e.g. Small business owners"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                disabled={generating}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating && <Spinner className="h-4 w-4" />}
              Generate Content
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT — Output */}
        <div className="space-y-4">
          {!hasOutput ? (
            <Card className="flex min-h-[320px] items-center justify-center border-dashed border-border bg-muted/30">
              <p className="text-center text-sm text-muted-foreground px-6">
                Generated content will appear here after you click Generate
                Content.
              </p>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="space-y-5 pt-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {title}
                </h2>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    Meta Description
                  </p>
                  <p className="text-sm text-foreground">{metaDescription}</p>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Blog Post
                  </label>
                  <Textarea
                    value={blogPost}
                    onChange={(e) => setBlogPost(e.target.value)}
                    className="min-h-[280px] max-h-[420px] resize-y font-mono text-sm leading-relaxed"
                    readOnly={false}
                  />
                </div>

                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleSaveDocument}
                  disabled={saving}
                >
                  {saving ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save as Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Rewrite & Tone Tool */}
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Rewrite & Tone Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="rewrite-text"
              className="text-sm font-medium text-foreground"
            >
              Paste text to rewrite
            </label>
            <Textarea
              id="rewrite-text"
              rows={4}
              placeholder="Paste or type the text you want to rewrite..."
              value={rewriteText}
              onChange={(e) => setRewriteText(e.target.value)}
              disabled={rewriting}
              className="min-h-[120px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Action</p>
            <div className="flex flex-wrap gap-2">
              {REWRITE_ACTIONS.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={rewriteAction === value ? "default" : "outline"}
                  className={
                    rewriteAction === value
                      ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : ""
                  }
                  onClick={() => setRewriteAction(value)}
                  disabled={rewriting}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={handleRewrite}
            disabled={rewriting || !rewriteText.trim() || !rewriteAction}
          >
            {rewriting && <Spinner className="h-4 w-4" />}
            Apply
          </Button>

          {rewrittenText && (
            <div className="space-y-4 pt-2 border-t border-border">
              <p className="text-sm font-medium text-foreground">Result</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4 max-h-[320px] overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {rewrittenText}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopyRewritten}
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleReplaceEditorContent}
                >
                  Replace Editor Content
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
