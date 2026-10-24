'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { BriefIntake } from '@/features/brief/BriefIntake';
import { BudgetPlanner } from '@/features/budget/BudgetPlanner';
import { TimelineBuilder } from '@/features/timeline/TimelineBuilder';
import { VendorChecklist } from '@/features/vendors/VendorChecklist';
import { PersonalizedIdeas } from '@/features/ideas/PersonalizedIdeas';
import { PlanBStudio } from '@/features/planb/PlanBStudio';
import { WhyThisDrawer } from '@/features/explainability/WhyThisDrawer';
import { ExportSuite } from '@/features/export/ExportSuite';
import { Locale } from '@/lib/i18n';
import { triggerFestiveBurst } from '@/lib/confetti';
import { EventBrief, BudgetBreakdown, TimelineSchedule, VendorChecklistItem, PlanBScenario, ExplainabilityRecord } from '@/engine/types';
import { CreativeIdeas } from '@/ai/schemas/plan.schema';
import { calculateInitialBudget } from '@/engine/budget-allocator';
import { buildTimelineSchedule } from '@/engine/timeline-scheduler';
import { buildVendorChecklists } from '@/engine/checklist-rules';
import { calculatePlanBScenario } from '@/engine/contingency-engine';
import { generateExplainabilityReports } from '@/engine/explainability';
import { FallbackProvider } from '@/ai/providers/fallback-provider';

// Initialize with the Primary Vertical: Indian Wedding (200 guests, ₹15 Lakhs)
const DEFAULT_BRIEF: EventBrief = {
  eventType: 'wedding',
  guests: 200,
  budget: 1500000,
  currency: 'INR',
  targetDate: '2026-11-20',
  city: 'Jaipur',
  vibe: 'Royal Heritage Elegance',
  priorities: ['venue', 'catering'],
  dietaryConstraints: ['Vegetarian', 'Jain banquet options'],
};

export default function HomePage() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isWhyThisOpen, setIsWhyThisOpen] = useState(false);

  const [brief, setBrief] = useState<EventBrief>(DEFAULT_BRIEF);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [budget, setBudget] = useState<BudgetBreakdown>(() => calculateInitialBudget(DEFAULT_BRIEF));
  const [timeline, setTimeline] = useState<TimelineSchedule>(() => buildTimelineSchedule(DEFAULT_BRIEF));
  const [checklists, setChecklists] = useState<readonly VendorChecklistItem[]>(() => buildVendorChecklists(DEFAULT_BRIEF));
  const [planBScenarios, setPlanBScenarios] = useState<readonly PlanBScenario[]>(() => [
    calculatePlanBScenario('rain', calculateInitialBudget(DEFAULT_BRIEF)),
    calculatePlanBScenario('vendor_cancellation', calculateInitialBudget(DEFAULT_BRIEF)),
    calculatePlanBScenario('guest_surge', calculateInitialBudget(DEFAULT_BRIEF)),
    calculatePlanBScenario('budget_cut', calculateInitialBudget(DEFAULT_BRIEF)),
  ]);
  const [explainability, setExplainability] = useState<readonly ExplainabilityRecord[]>(() =>
    generateExplainabilityReports(DEFAULT_BRIEF, calculateInitialBudget(DEFAULT_BRIEF)),
  );
  const [ideas, setIdeas] = useState<CreativeIdeas | null>(null);

  // Generate initial ideas on mount via FallbackProvider
  useEffect(() => {
    const fallback = new FallbackProvider();
    fallback.generateCreativeIdeas(DEFAULT_BRIEF).then(setIdeas);
  }, []);

  const handleGeneratePlan = async (rawBrief: string, override?: Partial<EventBrief>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawBrief, overrideBrief: override }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setBrief(data.brief);
      setMissingFields(data.missingFields || []);
      setBudget(data.budget);
      setTimeline(data.timeline);
      setChecklists(data.checklists);
      setPlanBScenarios(data.planBScenarios);
      setExplainability(data.explainability);
      setIdeas(data.creativeIdeas);

      triggerFestiveBurst(3000);
    } catch {
      // Deterministic client fallback if network / API route fails
      const fallback = new FallbackProvider();
      const parsed = await fallback.parseBrief(rawBrief);
      const activeBrief: EventBrief = { ...parsed, ...override };
      const newBudget = calculateInitialBudget(activeBrief);
      setBrief(activeBrief);
      setBudget(newBudget);
      setTimeline(buildTimelineSchedule(activeBrief));
      setChecklists(buildVendorChecklists(activeBrief));
      setPlanBScenarios([
        calculatePlanBScenario('rain', newBudget),
        calculatePlanBScenario('vendor_cancellation', newBudget),
        calculatePlanBScenario('guest_surge', newBudget),
        calculatePlanBScenario('budget_cut', newBudget),
      ]);
      setExplainability(generateExplainabilityReports(activeBrief, newBudget));
      const newIdeas = await fallback.generateCreativeIdeas(activeBrief);
      setIdeas(newIdeas);
      triggerFestiveBurst(2500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        currentLocale={currentLocale}
        onLocaleChange={(loc) => {
          setCurrentLocale(loc);
          if (typeof document !== 'undefined') {
            document.documentElement.lang = loc;
          }
        }}
        onFinalizePlan={() => triggerFestiveBurst(3500)}
        hasPlan={Boolean(ideas)}
      />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section 1: Brief Intake */}
        <BriefIntake
          currentLocale={currentLocale}
          isLoading={isLoading}
          onGeneratePlan={handleGeneratePlan}
          extractedBrief={brief}
          missingFields={missingFields}
        />

        {/* Section 2: Smart Budget Planner */}
        <BudgetPlanner
          currentLocale={currentLocale}
          breakdown={budget}
          onUpdateBreakdown={(updated) => {
            setBudget(updated);
            setExplainability(generateExplainabilityReports(brief, updated));
          }}
          guestCount={brief.guests}
          currency={brief.currency}
        />

        {/* Section 3: Timeline Builder */}
        <TimelineBuilder currentLocale={currentLocale} schedule={timeline} />

        {/* Section 4: Vendor Checklist */}
        <VendorChecklist currentLocale={currentLocale} initialChecklists={checklists} currency={brief.currency} />

        {/* Section 5: Personalized Ideas & Procedural Mood Board */}
        {ideas && (
          <PersonalizedIdeas
            currentLocale={currentLocale}
            ideas={ideas}
            onOpenWhyThis={() => setIsWhyThisOpen(true)}
          />
        )}

        {/* Section 6: Plan B Generator */}
        <PlanBStudio currentLocale={currentLocale} scenarios={planBScenarios} currency={brief.currency} />

        {/* Section 7 & 8: Export Suite */}
        <ExportSuite currentLocale={currentLocale} brief={brief} budget={budget} timeline={timeline} />
      </main>

      {/* Why This Drawer / Modal */}
      <WhyThisDrawer
        isOpen={isWhyThisOpen}
        onClose={() => setIsWhyThisOpen(false)}
        reports={explainability}
        brief={brief}
      />

      <footer className="w-full border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-400">
            Jashn — GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.
          </p>
          <p className="text-[11px] text-slate-500">
            Built with pure TypeScript deterministic rules & generative AI. Zero Cloud SDK dependencies. 100% offline fallback compliant.
          </p>
        </div>
      </footer>
    </>
  );
}
