import { Database, FileDown, Bot, Shield, Plus, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SmoothMount from "./smooth-mount"

const features = [
  {
    icon: Database,
    title: "PostgreSQL Features",
    description:
      "Full support for arrays, JSON, enums, and more. Built specifically for PostgreSQL workflows.",
  },
  {
    icon: Bot,
    title: "AI-Powered Chatbot",
    description: "Build, test, and debug your SQL queries with the help of our AI-powered chatbot.",
  },
  {
    icon: Sparkles,
    title: "Filters Generator",
    description: "Generate filters for your data with the help of AI.",
  }
]

export default function Features() {
  return (
    <section id="features" className="container py-24">
    <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Why should you use Fastbase?</h2>
    <div className="flex flex-row gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="border-0 shadow-none w-full bg-foreground/5">
          <CardHeader className="gap-4">
            <div className="min-h-36 rounded-2xl bg-background flex items-center justify-center">
              <feature.icon className="size-7 text-primary" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-xl font-semibold font-mono">{feature.title}</CardTitle>
              <CardContent className="text-muted-foreground p-0 font-mono">{feature.description}</CardContent>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  </section>
  )
}

