import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "10 Ways AI is Transforming Content Marketing",
    category: "AI",
    date: "2024-01-10",
    excerpt: "Discover how artificial intelligence is revolutionizing the way brands create, distribute, and optimize content for maximum impact.",
    author: "Team WriteFlow",
    thumbnail: "",
  },
  {
    title: "How to Write Persuasive Copy That Converts",
    category: "Writing Tips",
    date: "2024-02-15",
    excerpt: "Learn proven strategies to craft compelling copy that drives action and boosts your conversion rates.",
    author: "Team WriteFlow",
    thumbnail: "",
  },
  {
    title: "The Future of SaaS Content Teams",
    category: "Industry",
    date: "2024-03-05",
    excerpt: "Explore the evolving landscape of SaaS content teams and how to stay ahead in a rapidly changing industry.",
    author: "Team WriteFlow",
    thumbnail: "",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">WriteFlow Blog</h1>
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((post, i) => (
          <Card key={i} className="flex flex-col h-full">
            <div className="h-36 bg-muted flex items-center justify-center rounded-t-md">
              {/* Thumbnail placeholder */}
              <span className="text-4xl text-muted-foreground">📝</span>
            </div>
            <CardHeader className="pb-2">
              <Badge className="mb-2" variant="secondary">{post.category}</Badge>
              <CardTitle className="text-lg leading-tight line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{post.author}</span>
                <span>{new Date(post.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
              </div>
              <Button variant="outline" className="mt-auto w-full">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
