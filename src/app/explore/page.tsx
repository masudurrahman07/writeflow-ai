// src/app/explore/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface Template {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  rating: number;
  usageCount: number;
}

export default function ExplorePage() {
  // ----- State -----
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("popular");

  const debouncedSearch = useDebounce(search, 400);

  // Build query string based on filters
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (category !== "All") params.append("category", category);
    if (rating !== "All") {
      const min = rating === "4" ? "4" : "3"; // "4" means 4+, "3" means 3+
      params.append("rating", min);
    }
    if (sort) params.append("sort", sort);
    params.append("page", String(page));
    params.append("limit", String(limit));
    return params.toString();
  }, [debouncedSearch, category, rating, sort, page]);

  // ----- Data fetching -----
  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      try {
        const query = buildQuery();
        const res = await fetch(`/api/items?${query}`);
        const json = await res.json();
        if (json.success) {
          setTemplates(json.data);
          setTotal(json.meta.total);
        } else {
          console.error("Failed to fetch templates", json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, [buildQuery]);

  // ----- Helpers -----
  const totalPages = Math.ceil(total / limit);
  const ratingOptions = ["All", "4", "3"]; // "4" => 4+ stars, "3" => 3+ stars
  const sortOptions: Record<string, string> = {
    popular: "Most Popular",
    newest: "Newest",
    rated: "Highest Rated",
  };

  // ----- Render -----
  return (
    <section className="px-4 py-8 max-w-7xl mx-auto">
      <SectionTitle heading="Explore Templates" subheading="Find the perfect template for your next project" />

      {/* Search bar */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="All">All Categories</option>
          <option value="Blog">Blog</option>
          <option value="Social Media">Social Media</option>
          <option value="Email">Email</option>
          <option value="Ad Copy">Ad Copy</option>
        </select>

        {/* Rating */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="All">All Ratings</option>
          <option value="4">4★ and above</option>
          <option value="3">3★ and above</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded-md"
        >
          {Object.entries(sortOptions).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl._id}
              className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col h-full"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full">
                {tpl.thumbnail ? (
                  <Image
                    src={tpl.thumbnail}
                    alt={tpl.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{tpl.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {tpl.description}
                </p>

                {/* Badges */}
                <div className="flex items-center mb-2 space-x-2">
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">{tpl.category}</span>
                </div>

                {/* Rating & usage */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-1 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={i < Math.round(tpl.rating) ? "currentColor" : "none"}
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
                    <span className="ml-1 text-gray-600 dark:text-gray-300">{tpl.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {tpl.usageCount.toLocaleString()} uses
                  </span>
                </div>

                {/* Action */}
                <Link
                  href={`/explore/${tpl._id}`}
                  className="mt-4 w-full text-center bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-primary text-white" : "bg-muted"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
