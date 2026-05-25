import { Response, NextFunction } from "express";
import { Document } from "../models/Document.model";
import { AuthRequest } from "../middleware/auth.middleware";

interface CreateDocumentBody {
  title: string;
  content: string;
  status?: "draft" | "published" | "archived";
}

interface UpdateDocumentBody {
  title?: string;
  content?: string;
  status?: "draft" | "published" | "archived";
}

function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

export async function getDocuments(
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
    const status = req.query.status as string | undefined;
    const search = (req.query.search as string | undefined)?.trim();

    const filter: Record<string, unknown> = { userId: req.userId };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Document.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: documents,
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

export async function createDocument(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, content, status = "draft" } = req.body as CreateDocumentBody;

    if (!title?.trim() || !content?.trim()) {
      res.status(400).json({
        success: false,
        message: "title and content are required.",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const wordCount = countWords(content);

    const document = await Document.create({
      userId: req.userId,
      title: title.trim(),
      content,
      status,
      wordCount,
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

export async function updateDocument(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateDocumentBody;

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const document = await Document.findOne({ _id: id, userId: req.userId });
    if (!document) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }

    if (updates.title !== undefined) document.title = updates.title.trim();
    if (updates.content !== undefined) {
      document.content = updates.content;
      document.wordCount = countWords(updates.content);
    }
    if (updates.status !== undefined) document.status = updates.status;

    await document.save();

    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

export async function deleteDocument(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const document = await Document.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!document) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }

    res.json({ success: true, message: "Document deleted." });
  } catch (error) {
    next(error);
  }
}
