import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model";
import { Template } from "../models/Template.model";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/writeflow";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Template.deleteMany({});

  // Create users
  const adminPassword = await bcrypt.hash("123456", 10);
  const userPassword = await bcrypt.hash("123456", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@writeflow.com",
    password: adminPassword,
    role: "ADMIN",
    plan: "team",
  });
  const user = await User.create({
    name: "Demo User",
    email: "user@writeflow.com",
    password: userPassword,
    role: "USER",
    plan: "pro",
  });

  // Seed templates
  const templates = [
    {
      title: "Engaging Blog Introduction",
      category: "Blog",
      description: "Generate a captivating introduction for your blog post.",
      prompt: "Write an engaging introduction for a blog post about [topic].",
      sampleOutput: "Are you ready to dive into the world of [topic]? In this post, we'll explore...",
      thumbnail: "https://placehold.co/80x80?text=Blog",
      rating: 4.8,
      usageCount: 120,
      createdBy: admin._id,
    },
    {
      title: "SEO Blog Outline",
      category: "Blog",
      description: "Create a detailed, SEO-friendly outline for your next blog.",
      prompt: "Generate an SEO-optimized outline for a blog post about [topic].",
      sampleOutput: "1. Introduction\n2. Key Points\n3. Conclusion",
      thumbnail: "https://placehold.co/80x80?text=Blog",
      rating: 4.7,
      usageCount: 95,
      createdBy: admin._id,
    },
    {
      title: "Social Media Caption",
      category: "Social Media",
      description: "Craft a catchy caption for your social media post.",
      prompt: "Write a creative caption for a social media post about [topic].",
      sampleOutput: "Unlock the secrets of [topic]—click to learn more!",
      thumbnail: "https://placehold.co/80x80?text=Social",
      rating: 4.6,
      usageCount: 80,
      createdBy: user._id,
    },
    {
      title: "Twitter Thread Generator",
      category: "Social Media",
      description: "Generate a multi-tweet thread on a trending topic.",
      prompt: "Write a 5-tweet thread about [topic].",
      sampleOutput: "1/5: Let's talk about [topic]...",
      thumbnail: "https://placehold.co/80x80?text=Social",
      rating: 4.5,
      usageCount: 60,
      createdBy: user._id,
    },
    {
      title: "Welcome Email",
      category: "Email",
      description: "Generate a warm welcome email for new users.",
      prompt: "Write a welcome email for a new user named [name].",
      sampleOutput: "Hi [name], Welcome to our platform! We're excited to have you.",
      thumbnail: "https://placehold.co/80x80?text=Email",
      rating: 4.9,
      usageCount: 150,
      createdBy: admin._id,
    },
    {
      title: "Follow-up Email",
      category: "Email",
      description: "Create a polite follow-up email after a meeting.",
      prompt: "Write a follow-up email to [recipient] after a meeting about [topic].",
      sampleOutput: "Hi [recipient], It was great meeting you to discuss [topic]...",
      thumbnail: "https://placehold.co/80x80?text=Email",
      rating: 4.7,
      usageCount: 70,
      createdBy: user._id,
    },
    {
      title: "Ad Copy Headline",
      category: "Ad Copy",
      description: "Generate a high-converting headline for your ad campaign.",
      prompt: "Write a compelling ad headline for [product/service].",
      sampleOutput: "Transform Your [product] Experience Today!",
      thumbnail: "https://placehold.co/80x80?text=Ad",
      rating: 4.8,
      usageCount: 110,
      createdBy: admin._id,
    },
    {
      title: "Product Description Ad",
      category: "Ad Copy",
      description: "Write a persuasive product description for an ad.",
      prompt: "Write a short, persuasive product description for [product].",
      sampleOutput: "Discover the benefits of [product]—order now and see the difference!",
      thumbnail: "https://placehold.co/80x80?text=Ad",
      rating: 4.6,
      usageCount: 90,
      createdBy: user._id,
    },
  ];

  await Template.insertMany(templates);
  console.log("Seeded users and templates.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
