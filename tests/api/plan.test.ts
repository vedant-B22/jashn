import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/plan/route';
import { NextRequest } from 'next/server';

describe('POST /api/plan Route Handler (Zero API Key Mode)', () => {
  it('generates a full structured plan deterministically with no GEMINI_API_KEY', async () => {
    delete process.env.GEMINI_API_KEY;

    const requestBody = {
      rawBrief: 'Indian wedding in Udaipur, 220 guests, 18 Lakhs, royal heritage theme, 20 weeks away',
    };

    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': JSON.stringify(requestBody).length.toString(),
      },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.providerName).toBe('DeterministicFallback');
    expect(data.brief.eventType).toBe('wedding');
    expect(data.budget.allocatedBudget).toBe(1800000);
    expect(data.budget.totalBudget).toBe(1800000);
    expect(data.timeline.tasks.length).toBeGreaterThan(0);
    expect(data.checklists.length).toBeGreaterThan(0);
    expect(data.planBScenarios.length).toBe(4);
    expect(data.creativeIdeas.themeTitle).toBeDefined();
  });

  it('rejects invalid plan request formats with 400 Bad Request', async () => {
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ rawBrief: '' }), // Too short
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
