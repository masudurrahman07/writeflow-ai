// src/app/explore/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Template {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  rating: number;
  usageCount: number;
  sampleOutput?: string;
  tone?: string;
  wordCount?: number;
  aiModel?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: { name: string; avatar?: string };
  createdAt: string;
}

export default function TemplateDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [template, setTemplate] = useState<Template | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [tRes, rRes, relRes] = await Promise.all([
          fetch(`/api/items/${id}`),
          fetch(`/api/reviews/item/${id}`),
          fetch(`/api/items/${id}/related`),
        ]);
        const tJson = await tRes.json();
        const rJson = await rRes.json();
        const relJson = await relRes.json();
        if (tJson.success) setTemplate(tJson.data);
        if (rJson.success) setReviews(rJson.data);
        if (relJson.success) setRelated(relJson.data);
        // simple auth check – see if token exists
        setIsAuthenticated(!!localStorage.getItem("token"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const averageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return sum / reviews.length;
  };

  const submitReview = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating: newRating, comment: newComment, itemId: id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Review submitted for approval");
        setNewComment("");
        // Optionally refresh reviews
      } else {
        toast.error(json.message || "Failed to submit review");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!template) return <div className="p-8">Template not found.</div>;

  return (
    <section className="max-w-7xl mx-auto p-4">
      {/* OVERVIEW */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="relative h-64 md:h-auto">
          {template.thumbnail ? (
            <Image src={template.thumbnail} alt={template.title} fill className="object-cover rounded" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 rounded">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
            <span className="inline-block px-2 py-1 text-sm bg-primary/10 text-primary rounded mb-2">
              {template.category}
            </span>
            <p className="text-muted-foreground mb-4">{template.description}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {template.tone && <li>Tone: {template.tone}</li>}
              {template.wordCount && <li>Estimated words: {template.wordCount}</li>}
              {template.aiModel && <li>AI model: {template.aiModel}</li>}
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              {template.usageCount.toLocaleString()} uses
            </span>
            <Link
              href={`/editor?templateId=${template._id}`}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
            >
              Use This Template
            </Link>
          </div>
        </div>
      </div>

      {/* SAMPLE OUTPUT */}
      {template.sampleOutput && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Example AI Output</h2>
          <div className="p-4 bg-muted rounded font-mono whitespace-pre-wrap overflow-auto">
            {template.sampleOutput}
          </div>
        </div>
      )}

      {/* REVIEWS & RATINGS */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Reviews & Ratings</h2>
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill={i < Math.round(averageRating()) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.75.75 0 011.04 0l2.442 2.313a.75.75 0 00.514.219h3.22c.827 0 1.173 1.062.504 1.53l-2.605 1.884a.75.75 0 00-.273.81l.98 3.106c.252.8-.696 1.465-1.374.979l-2.823-1.873a.75.75 0 00-.878 0l-2.823 1.873c-.678.486-1.626-.179-1.374-.98l.98-3.105a.75.75 0 00-.273-.81L4.307 7.56c-.669-.468-.323-1.53.504-1.53h3.22a.75.75 0 00.514-.219L11.48 3.5z"
                />
              </svg>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating().toFixed(1)} ★ — {reviews.length} review{reviews.length !== 1 && "s"}
          </span>
        </div>
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev._id} className="flex items-start space-x-3">
              {rev.userId.avatar ? (
                <Image src={rev.userId.avatar} alt={rev.userId.name} width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm">
                  {rev.userId.name[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{rev.userId.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < rev.rating ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-yellow-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.75.75 0 011.04 0l2.442 2.313a.75.75 0 00.514.219h3.22c.827 0 1.173 1.062.504 1.53l-2.605 1.884a.75.75 0 00-.273.81l.98 3.106c.252.8-.696 1.465-1.374.979l-2.823-1.873a.75.75 0 00-.878 0l-2.823 1.873c-.678.486-1.626-.179-1.374-.98l.98-3.105a.75.75 0 00-.273-.81L4.307 7.56c-.669-.468-.323-1.53.504-1.53h3.22a.75.75 0 00.514-.219L11.48 3.5z"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{rev.comment}</p>
              </div>
            </li>
          ))}
        </ul>
        {isAuthenticated && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Write a Review</h3>
            <div className="flex items-center mb-2">
              <label className="mr-2">Rating:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))
                className="p-1 border rounded"
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {v} ★
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary mb-2"
              placeholder="Your review..."
            />
            <button
              onClick={submitReview}
              disabled={reviewLoading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>

      {/* RELATED TEMPLATES */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((tpl) => (
              <div
                key={tpl._id}
                className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-40 w-full">
                  {tpl.thumbnail ? (
                    <Image src={tpl.thumbnail} alt={tpl.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-md font-semibold line-clamp-2 mb-1">{tpl.title}</h3>
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded mb-2">
                    {tpl.category}
                  </span>
                  <Link
                    href={`/explore/${tpl._id}`}
                    className="mt-auto w-full text-center bg-primary text-white py-1 rounded hover:bg-primary/90 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
