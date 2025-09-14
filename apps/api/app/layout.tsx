import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Fastbase',
  description: 'Lightning-fast, beautiful, and AI-powered PostgreSQL client. Be the first to experience the future of database management.',
  icons: "/favicons/favicon.ico"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
      <Toaster position="top-center" richColors />
    </html>
  );
}
