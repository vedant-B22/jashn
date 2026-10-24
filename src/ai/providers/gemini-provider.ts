import { AIProvider } from './ai-provider.interface';
import { FallbackProvider } from './fallback-provider';
import { EventBrief } from '../../engine/types';
import { ParsedBrief, ParsedBriefSchema, CreativeIdeas, CreativeIdeasSchema } from '../schemas/plan.schema';
import { buildBriefParserPrompt } from '../prompts/brief-parser.prompt';
import { buildCreativeIdeasPrompt } from '../prompts/creative-ideas.prompt';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash';
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

export class GeminiProvider implements AIProvider {
  readonly name = 'GeminiAI';
  private apiKey: string;
  private model: string;
  private fallback: FallbackProvider;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
    this.fallback = new FallbackProvider();
  }

  async parseBrief(rawText: string): Promise<ParsedBrief> {
    if (!this.apiKey) {
      return this.fallback.parseBrief(rawText);
    }

    const { systemPrompt, userPrompt } = buildBriefParserPrompt(rawText);

    try {
      const responseText = await this.callGeminiWithRetry(systemPrompt, userPrompt);
      const json = JSON.parse(cleanJsonOutput(responseText));
      const parsed = ParsedBriefSchema.safeParse(json);
      if (parsed.success) {
        return parsed.data;
      }
    } catch {
      // Fall through to fallback provider
    }

    return this.fallback.parseBrief(rawText);
  }

  async generateCreativeIdeas(brief: EventBrief): Promise<CreativeIdeas> {
    if (!this.apiKey) {
      return this.fallback.generateCreativeIdeas(brief);
    }

    const { systemPrompt, userPrompt } = buildCreativeIdeasPrompt(brief);

    try {
      const responseText = await this.callGeminiWithRetry(systemPrompt, userPrompt);
      const json = JSON.parse(cleanJsonOutput(responseText));
      const parsed = CreativeIdeasSchema.safeParse(json);
      if (parsed.success) {
        return parsed.data;
      }
    } catch {
      // Fall through to fallback provider
    }

    return this.fallback.generateCreativeIdeas(brief);
  }

  private async callGeminiWithRetry(systemPrompt: string, userPrompt: string, retryCount = 1): Promise<string> {
    let attempts = 0;
    while (attempts <= retryCount) {
      try {
        return await this.executeGeminiRequest(systemPrompt, userPrompt);
      } catch (err) {
        attempts += 1;
        if (attempts > retryCount) throw err;
      }
    }
    throw new Error('Gemini request failed after retry');
  }

  private async executeGeminiRequest(systemPrompt: string, userPrompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const url = `${GEMINI_API_BASE}/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid or empty content response from Gemini API');
      }
      return content;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/** Strips accidental markdown backticks or wrappers */
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}
