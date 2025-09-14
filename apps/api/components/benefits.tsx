import { FileDown, Database, Zap, Layout } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Benefits() {
  return (
    <section id="features" className="container py-12 md:py-24">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Why PostgreSQL Developers Love Fastbase</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Zap className="h-6 w-6 text-primary" />
            <CardTitle>Blazing Fast</CardTitle>
            <CardDescription>Optimized for smooth interactions with large PostgreSQL datasets.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Database className="h-6 w-6 text-primary" />
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Full support for PostgreSQL-specific features like JSON and arrays.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Layout className="h-6 w-6 text-primary" />
            <CardTitle>Modern UI</CardTitle>
            <CardDescription>Clean, intuitive interface designed for PostgreSQL workflows.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <FileDown className="h-6 w-6 text-primary" />
            <CardTitle>Flexible Exports</CardTitle>
            <CardDescription>Export data in CSV, JSON, JSONL, or PostgreSQL-compatible SQL formats.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}

