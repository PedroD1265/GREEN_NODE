import { AIProvider, ClassificationResult, RecommendCollectorsResult } from './interface';

const REQUIRED_ENV_VARS = [
  'EXTERNAL_AI_API_KEY',
  'EXTERNAL_AI_ENDPOINT',
] as const;

export class ExternalAIProvider implements AIProvider {
  private apiKey: string;
  private endpoint: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.EXTERNAL_AI_API_KEY || '';
    this.endpoint = process.env.EXTERNAL_AI_ENDPOINT || '';
    this.model = process.env.EXTERNAL_AI_MODEL || 'gpt-4o';

    const missing = this.getMissingVars();
    if (missing.length > 0) {
      console.warn(`[ExternalAI] Missing config: ${missing.join(', ')}`);
    }
  }

  getMissingVars(): string[] {
    const missing: string[] = [];
    if (!this.apiKey) missing.push('EXTERNAL_AI_API_KEY');
    if (!this.endpoint) missing.push('EXTERNAL_AI_ENDPOINT');
    return missing;
  }

  private ensureConfigured(): void {
    const missing = this.getMissingVars();
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`External AI provider not configured. Missing environment variables: ${missing.join(', ')}`),
        { status: 503 }
      );
    }
  }

  async classifyWasteFromImages(_imageUrls: string[], _context?: Record<string, any>): Promise<ClassificationResult> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('External AI classification not yet implemented. Install openai SDK and implement.'),
      { status: 501 }
    );
  }

  async recommendCollectors(_caseDraft: any, _collectors: any[]): Promise<RecommendCollectorsResult> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('External AI collector recommendation not yet implemented.'),
      { status: 501 }
    );
  }

  async generateTips(_material: string, _bucket: string, _quality: string): Promise<string[]> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('External AI tips generation not yet implemented.'),
      { status: 501 }
    );
  }
}
