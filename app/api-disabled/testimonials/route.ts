import { NextResponse } from "next/server";

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Demo testimonial data
const demoTestimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechCorp Solutions",
    content:
      "Mikhail delivered an exceptional e-commerce platform that exceeded our expectations. His full-stack expertise and attention to detail are remarkable.",
    rating: 5,
    featured: true,
    image: "/testimonials/sarah-johnson.jpg",
    projectId: "1",
    date: "2024-03-25",
    lastUpdated: Date.now(),
  },
  {
    id: "2",
    name: "David Chen",
    role: "DevOps Manager",
    company: "CloudFirst Inc",
    content:
      "The cloud infrastructure automation Mikhail built has saved us countless hours and significantly improved our deployment reliability.",
    rating: 5,
    featured: true,
    image: "/testimonials/david-chen.jpg",
    projectId: "2",
    date: "2024-04-20",
    lastUpdated: Date.now(),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Data Science Lead",
    company: "Analytics Pro",
    content:
      "The analytics dashboard Mikhail created provides incredible insights into our data. The machine learning integration is particularly impressive.",
    rating: 5,
    featured: true,
    image: "/testimonials/emily-rodriguez.jpg",
    projectId: "3",
    date: "2024-06-05",
    lastUpdated: Date.now(),
  },
  {
    id: "4",
    name: "Michael Thompson",
    role: "Product Manager",
    company: "DesignHub",
    content:
      "Working with Mikhail on our design system was a game-changer. His understanding of both design and development is exceptional.",
    rating: 5,
    featured: false,
    image: "/testimonials/michael-thompson.jpg",
    projectId: "4",
    date: "2024-06-20",
    lastUpdated: Date.now(),
  },
  {
    id: "5",
    name: "Lisa Wang",
    role: "CEO",
    company: "FinTech Innovations",
    content:
      "The mobile banking app Mikhail is developing for us showcases his expertise in secure, user-friendly financial applications.",
    rating: 5,
    featured: false,
    image: "/testimonials/lisa-wang.jpg",
    projectId: "5",
    date: "2024-07-10",
    lastUpdated: Date.now(),
  },
  {
    id: "6",
    name: "Robert Kim",
    role: "Customer Success Director",
    company: "ServiceBot AI",
    content:
      "The AI chatbot Mikhail built has revolutionized our customer service. Response times improved by 80% and customer satisfaction is at an all-time high.",
    rating: 5,
    featured: true,
    image: "/testimonials/robert-kim.jpg",
    projectId: "6",
    date: "2024-08-20",
    lastUpdated: Date.now(),
  },
];

export async function GET() {
  try {
    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 150));

    return NextResponse.json({
      data: demoTestimonials,
      status: "success",
      timestamp: Date.now(),
      total: demoTestimonials.length,
    });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json(
      {
        data: [],
        status: "error",
        message: "Failed to fetch testimonials",
        timestamp: Date.now(),
      },
      { status: 500 },
    );
  }
}
