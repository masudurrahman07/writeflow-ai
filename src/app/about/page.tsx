import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">About WriteFlow AI</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          WriteFlow AI empowers creators and teams to write smarter, faster, and more creatively with the power of artificial intelligence. Our mission is to make high-quality content creation accessible to everyone.
        </p>
      </section>
      {/* Team Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alex Carter", role: "CEO", bio: "Visionary leader passionate about empowering creators." },
            { name: "Priya Nair", role: "Head of AI", bio: "Expert in machine learning and natural language processing." },
            { name: "James Liu", role: "Lead Engineer", bio: "Builder of robust, scalable AI-powered platforms." },
          ].map((member) => (
            <Card key={member.name} className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
              </div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">{member.name}</CardTitle>
              </CardHeader>
              <Badge className="mb-2" variant="secondary">{member.role}</Badge>
              <CardContent className="p-0 text-sm text-muted-foreground">{member.bio}</CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Stats Row */}
      <section className="flex flex-wrap justify-center gap-6 py-6">
        <div className="text-center">
          <div className="text-2xl font-bold">2023</div>
          <div className="text-xs text-muted-foreground">Founded</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">10,000+</div>
          <div className="text-xs text-muted-foreground">Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">500,000+</div>
          <div className="text-xs text-muted-foreground">Words Generated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">4.9★</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
      </section>
      {/* Vision Section */}
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
        <p className="text-muted-foreground text-base">
          We believe the future of writing is collaborative, creative, and AI-augmented. WriteFlow AI is committed to building tools that help people express ideas, tell stories, and connect with audiences in ways never before possible.
        </p>
      </section>
    </div>
  );
}
