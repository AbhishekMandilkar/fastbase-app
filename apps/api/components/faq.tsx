import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section id="faq" className="container py-12 md:py-24 space-y-8">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>When will Fastbase be available?</AccordionTrigger>
          <AccordionContent>
            We're working hard to bring Fastbase to you as soon as possible. Join our waitlist to be notified about our
            launch date and get early access.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Which PostgreSQL versions will be supported?</AccordionTrigger>
          <AccordionContent>
            Fastbase will support all PostgreSQL versions 10 and above, ensuring compatibility with the latest features
            and improvements.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Will there be a free version of Fastbase?</AccordionTrigger>
          <AccordionContent>
            Yes, Fastbase will offer a free Basic version with essential PostgreSQL management features. The Pro version
            will include additional features like AI-powered suggestions and advanced export options.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How will Fastbase handle large PostgreSQL datasets?</AccordionTrigger>
          <AccordionContent>
            Fastbase is being optimized for performance, using efficient data loading and virtualization techniques to
            handle large PostgreSQL datasets without UI lag.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

