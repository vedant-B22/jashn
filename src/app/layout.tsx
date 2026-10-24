import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen bg-grain antialiased selection:bg-festive-saffron selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-festive-saffron text-black font-semibold rounded-md shadow-lg outline-none ring-2 ring-white"
        >
          Skip to main content
        </a>
        <div className="relative min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
