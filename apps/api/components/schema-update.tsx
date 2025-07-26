import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import SmoothMount from "./smooth-mount";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Badge} from "./ui/badge";

// app/updates/schema-viewer/page.tsx
export default function SchemaViewerUpdate(props: { isEmail?: boolean }) {
  const { isEmail = false } = props;
  return (
    <>
      <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-12">
        <SmoothMount>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <nav className="flex justify-between items-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Badge variant="outline">April, 2025</Badge>
            </nav>
            <h1 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl ">
              🚀 New in FastBase: Table Schema Viewer
            </h1>

            <p className="text-md text-muted-foreground">
              We've shipped one of our most requested features — a smooth,
              visual way to inspect your PostgreSQL table schemas.
            </p>

            <div className="aspect-video rounded-xl overflow-hidden mb-6">
              <iframe
                src="https://www.youtube.com/embed/idOT0D3NafU"
                title="Schema Viewer Demo"
                className="w-full h-full "
              ></iframe>
            </div>

            <h2 className="text-xl font-semibold mb-2">🔍 What's New</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>📄 View complete table schema with types</li>
              <li>🔗 Visualize foreign key relationships</li>
              <li>↕️ Sort columns by name or type</li>
              <li>🌒 Dark mode support</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">🛣️ Coming Soon</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>📝 Inline table editing</li>
              <li>📤 Export schema to SQL</li>
            </ul>

            <p className="text-lg mb-6">
              FastBase is still in early access — join the waitlist to be among
              the first to try it!
            </p>

            {!isEmail ? (
              <WaitlistDialog />
            ) : (
              <a href="https://fastbase.in">Join the Waitlist</a>
            )}
          </div>
        </SmoothMount>
      </main>
    </>
  );
}
