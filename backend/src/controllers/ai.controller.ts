import { Response, NextFunction } from "express";
import { model } from "../config/gemini";
import { AIHistory } from "../models/AIHistory.model";
import { AuthRequest } from "../middleware/auth.middleware";

interface GenerateContentBody {
  topic: string;
  tone: string;
  audience: string;
  templateId?: string;
}

interface GeneratedContent {
  blogPost: string;
  title: string;
  metaDescription: string;
  tags: string[];
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function parseJsonFromGemini(text: string): GeneratedContent {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonStr = fenced ? fenced[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as GeneratedContent;

  if (
    typeof parsed.blogPost !== "string" ||
    typeof parsed.title !== "string" ||
    typeof parsed.metaDescription !== "string" ||
    !Array.isArray(parsed.tags)
  ) {
    throw new Error("Invalid JSON structure from AI response.");
  }

  return parsed;
}

export async function generateContent(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { topic, tone, audience, templateId } = req.body as GenerateContentBody;

    if (!topic || !tone || !audience) {
      res.status(400).json({
        success: false,
        message: "topic, tone, and audience are required.",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const prompt = `You are a professional content writer. Generate content for the following:
Topic: ${topic}
Tone: ${tone}
Target Audience: ${audience}
${templateId ? `Template ID: ${templateId}` : ""}
Return ONLY a valid JSON object with these fields:
{ blogPost, title, metaDescription, tags }
No markdown, no explanation, just the JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const content = parseJsonFromGemini(responseText);

    const tokensUsed =
      estimateTokens(prompt) + estimateTokens(responseText);

    await AIHistory.create({
      userId: req.userId,
      agentUsed: "Content Draft",
      promptSnippet: topic,
      tokensUsed,
    });

    res.json({
      success: true,
      data: {
        blogPost: content.blogPost,
        title: content.title,
        metaDescription: content.metaDescription,
        tags: content.tags,
      },
    });
  } catch (error) {
    next(error);
  }
}

type RewriteAction =
  | "formal"
  | "casual"
  | "persuasive"
  | "friendly"
  | "shorten"
  | "expand"
  | "fix-grammar";

interface RewriteContentBody {
  text: string;
  action: RewriteAction;
}

const REWRITE_PROMPTS: Record<RewriteAction, string> = {
  formal:
    "Rewrite the following text in a formal, professional tone. Return only the rewritten text.",
  casual:
    "Rewrite the following text in a casual, conversational tone. Return only the rewritten text.",
  persuasive:
    "Rewrite the following text to be persuasive and compelling. Return only the rewritten text.",
  friendly:
    "Rewrite the following text in a warm, friendly tone. Return only the rewritten text.",
  shorten:
    "Shorten the following text while keeping the key message. Return only the shortened text.",
  expand:
    "Expand the following text with more detail and examples. Return only the expanded text.",
  "fix-grammar":
    "Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text.",
};

const VALID_ACTIONS = Object.keys(REWRITE_PROMPTS) as RewriteAction[];

export async function rewriteContent(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text, action } = req.body as RewriteContentBody;

    if (!text?.trim()) {
      res.status(400).json({
        success: false,
        message: "text is required.",
      });
      return;
    }

    if (!action || !VALID_ACTIONS.includes(action)) {
      res.status(400).json({
        success: false,
        message: `action must be one of: ${VALID_ACTIONS.join(", ")}`,
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const prompt = `${REWRITE_PROMPTS[action]}\nText: ${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const rewrittenText = responseText
      .replace(/^```[\w]*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const tokensUsed =
      estimateTokens(prompt) + estimateTokens(responseText);

    await AIHistory.create({
      userId: req.userId,
      agentUsed: "Rewrite Agent",
      promptSnippet: text.trim().slice(0, 100),
      tokensUsed,
    });

    res.json({
      success: true,
      data: { rewrittenText },
    });
  } catch (error) {
    next(error);
  }
}

interface ChatHistoryItem {
  role: "user" | "model";
  content: string;
}

interface ChatWithAIBody {
  message: string;
  documentContext?: string;
  history?: ChatHistoryItem[];
}

export async function chatWithAI(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      message,
      documentContext = "",
      history = [],
    } = req.body as ChatWithAIBody;

    if (!message?.trim()) {
      res.status(400).json({
        success: false,
        message: "message is required.",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (h) =>
            h &&
            (h.role === "user" || h.role === "model") &&
            typeof h.content === "string"
        )
      : [];

    const chat = model.startChat({
      history: validHistory.map((h) => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
      generationConfig: { maxOutputTokens: 500 },
    });

    const userMessage = `You are a professional writing assistant. The user is working on this document:
---
${documentContext}
---
User question: ${message}
Answer helpfully and concisely.`;

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    const tokensUsed =
      estimateTokens(userMessage) + estimateTokens(reply);

    await AIHistory.create({
      userId: req.userId,
      agentUsed: "Chat Assistant",
      promptSnippet: message.trim(),
      tokensUsed,
    });

    res.json({
      success: true,
      data: { reply },
    });
  } catch (error) {
    next(error);
  }
}

const VALID_AGENTS = [
  "Content Draft",
  "Rewrite Agent",
  "Chat Assistant",
] as const;

export async function getAIHistory(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(String(req.query.limit ?? "10"), 10) || 10)
    );
    const agentUsed = req.query.agentUsed as string | undefined;

    const filter: Record<string, unknown> = { userId: req.userId };

    if (
      agentUsed &&
      agentUsed !== "all" &&
      VALID_AGENTS.includes(agentUsed as (typeof VALID_AGENTS)[number])
    ) {
      filter.agentUsed = agentUsed;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      AIHistory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AIHistory.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: records,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}
