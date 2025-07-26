import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Pricing from "@/components/pricing"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import SmoothMount from "@/components/smooth-mount"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SmoothMount>
          <>
            <Hero />
            <Features />
            <Pricing />
            <FAQ />
            <CTA />
          </>
        </SmoothMount>
      </main>
      <Footer />
    </div>
  );
}

