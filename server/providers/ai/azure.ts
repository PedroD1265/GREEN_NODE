import { AIProvider, ClassificationResult, RecommendCollectorsResult } from './interface';

export class AzureAIProvider implements AIProvider {
  private endpoint: string;
  private apiKey: string;
  private deployment: string;
  private apiVersion: string;

  constructor() {
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    this.apiKey = process.env.AZURE_OPENAI_API_KEY || '';
    this.deployment = process.env.AZURE_OPENAI_DEPLOYMENT || '';
    this.apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-01';

    if (!this.endpoint || !this.apiKey || !this.deployment) {
      console.warn('[AzureAI] Missing config: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and/or AZURE_OPENAI_DEPLOYMENT');
    }
  }

  private ensureConfigured(): void {
    const missing: string[] = [];
    if (!this.endpoint) missing.push('AZURE_OPENAI_ENDPOINT');
    if (!this.apiKey) missing.push('AZURE_OPENAI_API_KEY');
    if (!this.deployment) missing.push('AZURE_OPENAI_DEPLOYMENT');
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Missing Azure OpenAI config: ${missing.join(', ')}. Set these environment variables to enable AI features.`),
        { status: 503 }
      );
    }
  }

  async classifyWasteFromImages(_imageUrls: string[], _context?: Record<string, any>): Promise<ClassificationResult> {
    this.ensureConfigured();
    // TODO: Implement with Azure OpenAI SDK (GPT-4 Vision)
    // const client = new OpenAI({ apiKey: this.apiKey, baseURL: `${this.endpoint}/openai/deployments/${this.deployment}`, ... });
    // const response = await client.chat.completions.create({ model: this.deployment, messages: [...], ... });
    throw Object.assign(
      new Error('Azure OpenAI classification not yet implemented. Install openai SDK and implement.'),
      { status: 501 }
    );
  }

  async recommendCollectors(_caseDraft: any, _collectors: any[]): Promise<RecommendCollectorsResult> {
    this.ensureConfigured();
    // TODO: Implement with Azure OpenAI or custom logic
    throw Object.assign(
      new Error('Azure OpenAI collector recommendation not yet implemented.'),
      { status: 501 }
    );
  }

  async generateTips(_material: string, _bucket: string, _quality: string): Promise<string[]> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Azure OpenAI tips generation not yet implemented.'),
      { status: 501 }
    );
  }
}
