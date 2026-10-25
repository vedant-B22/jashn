import type { Metadata } from 'next';
import './globals.css';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { AuroraMesh } from '@/components/ui/AuroraMesh';

export const metadata: Metadata = {
  title: 'Jashn — GenAI Celebration & Event Planner',
  description:
    'GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.',
  keywords: [
    'event planner',
    'wedding planner',
    'Indian wedding',
    'budget allocator',
    'timeline scheduler',
    'vendor checklist',
    'GenAI event planner',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-background text-slate-100 min-h-screen antialiased selection:bg-festive-saffron selection:text-black relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2.5 bg-festive-gold text-black font-extrabold rounded-xl shadow-glow outline-none ring-2 ring-white"
        >
          Skip to main content
        </a>

        {/* Global ambient background & tactile film grain */}
        <AuroraMesh />
        <GrainOverlay />
        <ScrollProgress />

        <div className="relative min-h-screen flex flex-col z-10">{children}</div>
      </body>
    </html>
  );
}
