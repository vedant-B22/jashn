import { EventBrief } from '../../engine/types';
import { ParsedBrief, CreativeIdeas } from '../schemas/plan.schema';

export interface AIProvider {
  readonly name: string;
  parseBrief(rawText: string): Promise<ParsedBrief>;
  generateCreativeIdeas(brief: EventBrief): Promise<CreativeIdeas>;
}
