import { AIProvider } from './ai-provider.interface';
import { FallbackProvider } from './fallback-provider';
import { EventBrief } from '../../engine/types';
import { ParsedBrief, CreativeIdeas } from '../schemas/plan.schema';

/**
 * Mock provider for integration testing and deterministic test suites.
 */
export class MockProvider implements AIProvider {
  readonly name = 'MockAI';
  private fallback = new FallbackProvider();

  async parseBrief(rawText: string): Promise<ParsedBrief> {
    return this.fallback.parseBrief(rawText);
  }

  async generateCreativeIdeas(brief: EventBrief): Promise<CreativeIdeas> {
    return this.fallback.generateCreativeIdeas(brief);
  }
}
