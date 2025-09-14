import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Pricing() {
  return (
    <section id="pricing" className="container py-12 md:py-24">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Simple, Transparent Pricing</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Essential PostgreSQL management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Free</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Blazing fast performance
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Modern UI
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Advanced PostgreSQL features
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Native table editing
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Coming Soon</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Advanced features for power users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Coming Soon</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> All Basic features
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> AI-powered query suggestions
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Advanced export options
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Priority support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

