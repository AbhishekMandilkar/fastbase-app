import { Database, FileDown, Bot, Shield, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SmoothMount from "./smooth-mount"

const features = [
  {
    icon: Database,
    title: "Advanced PostgreSQL Features",
    description:
      "Full support for arrays, JSON, materialized views, and extensions. Built specifically for PostgreSQL workflows.",
  },
  {
    icon: Bot,
    title: "AI-Powered Suggestions",
    description: "Smart query recommendations optimized for PostgreSQL best practices and syntax improvements.",
  },
  {
    icon: FileDown,
    title: "Flexible Exports",
    description: "Export your data seamlessly in CSV, JSON, JSONL, or PostgreSQL-compatible SQL formats.",
  },
  {
    icon: Shield,
    title: "Secure Connections",
    description: "Enterprise-grade security with SSL encryption and SSH tunneling support for PostgreSQL connections.",
  },
  // many more coming soon element 
  {
    title: "Coming Soon",
    description: "Many more features coming soon. Stay tuned!",
    icon: Plus,
  }
]

export default function Features() {
  return (
    <section id="features" className="container py-24">
    <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Upcoming Features</h2>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
      {features.map((feature, index) => (
        <Card key={index} className="border-0 shadow-none w-full">
          <CardHeader className="gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <feature.icon className="size-7 text-primary" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              <CardContent className="text-muted-foreground p-0">{feature.description}</CardContent>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  </section>
  )
}

