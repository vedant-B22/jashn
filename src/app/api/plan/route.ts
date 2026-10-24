import { NextRequest, NextResponse } from 'next/server';
import { PlanRequestSchema } from '@/ai/schemas/plan.schema';
import { checkRateLimit } from '@/lib/rate-limiter';
import { globalPlanCache, hashString } from '@/ai/cache';
import { GeminiProvider } from '@/ai/providers/gemini-provider';
import { FallbackProvider } from '@/ai/providers/fallback-provider';
import { calculateInitialBudget } from '@/engine/budget-allocator';
import { buildTimelineSchedule } from '@/engine/timeline-scheduler';
import { buildVendorChecklists } from '@/engine/checklist-rules';
import { calculatePlanBScenario } from '@/engine/contingency-engine';
import { generateExplainabilityReports } from '@/engine/explainability';
import { EventBrief, PlanBTrigger } from '@/engine/types';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 50 * 1024; // 50 KB

export async function POST(req: NextRequest) {
  // 1. Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
        },
      },
    );
  }

  // 2. Request body size check
  const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body exceeds maximum allowed size' }, { status: 413 });
  }

  try {
    const rawJson = await req.json();
    const validationResult = PlanRequestSchema.safeParse(rawJson);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid plan request format', details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { rawBrief, overrideBrief } = validationResult.data;

    // 3. Cache lookup
    const cacheKey = hashString(rawBrief + JSON.stringify(overrideBrief || {}));
    const cachedPlan = globalPlanCache.get(cacheKey);
    if (cachedPlan) {
      return NextResponse.json(cachedPlan, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // 4. Select AI Provider
    const apiKey = process.env.GEMINI_API_KEY;
    const provider = apiKey ? new GeminiProvider(apiKey) : new FallbackProvider();

    // 5. Parse or blend brief
    const parsedBrief = await provider.parseBrief(rawBrief);
    const brief: EventBrief = {
      eventType: overrideBrief?.eventType ?? parsedBrief.eventType,
      guests: overrideBrief?.guests ?? parsedBrief.guests,
      budget: overrideBrief?.budget ?? parsedBrief.budget,
      currency: overrideBrief?.currency ?? parsedBrief.currency,
      targetDate: overrideBrief?.targetDate ?? parsedBrief.targetDate,
      city: overrideBrief?.city ?? parsedBrief.city,
      vibe: overrideBrief?.vibe ?? parsedBrief.vibe,
      priorities: overrideBrief?.priorities ?? parsedBrief.priorities,
      dietaryConstraints: overrideBrief?.dietaryConstraints ?? parsedBrief.dietaryConstraints,
    };

    // 6. Deterministic Engine Executions
    const budget = calculateInitialBudget(brief);
    const timeline = buildTimelineSchedule(brief);
    const checklists = buildVendorChecklists(brief);
    const explainability = generateExplainabilityReports(brief, budget);

    const planBTriggers: readonly PlanBTrigger[] = ['rain', 'vendor_cancellation', 'guest_surge', 'budget_cut'];
    const planBScenarios = planBTriggers.map((trigger) => calculatePlanBScenario(trigger, budget));

    // 7. Creative Ideas from Provider
    const creativeIdeas = await provider.generateCreativeIdeas(brief);

    const fullPlan = {
      brief,
      missingFields: parsedBrief.missingFields,
      budget,
      timeline,
      checklists,
      planBScenarios,
      explainability,
      creativeIdeas,
      providerName: provider.name,
      generatedAt: new Date().toISOString(),
    };

    // 8. Cache result
    globalPlanCache.set(cacheKey, fullPlan);

    return NextResponse.json(fullPlan, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal plan generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
