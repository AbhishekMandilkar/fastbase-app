import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import {WaitlistDialog} from "./waitlist-dialog"

export default function CTA() {
  return (
    <section className="container py-12 md:py-24">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
          <CardTitle className="text-3xl font-bold">Be the First to Experience Fastbase</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Join our waitlist and get early access to the future of PostgreSQL management on Mac.
          </CardDescription>
          <WaitlistDialog>
            <Button size="lg" variant="secondary">
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </WaitlistDialog>
        </CardContent>
      </Card>
    </section>
  )
}

