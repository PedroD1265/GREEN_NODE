import { StorageProvider, UploadResult } from './interface';

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_BUCKET',
] as const;

export class SupabaseStorageProvider implements StorageProvider {
  private supabaseUrl: string;
  private serviceRoleKey: string;
  private bucket: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.bucket = process.env.SUPABASE_BUCKET || 'evidence';

    const missing = this.getMissingVars();
    if (missing.length > 0) {
      console.warn(`[SupabaseStorage] Missing config: ${missing.join(', ')}`);
    }
  }

  getMissingVars(): string[] {
    const missing: string[] = [];
    if (!this.supabaseUrl) missing.push('SUPABASE_URL');
    if (!this.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    return missing;
  }

  private ensureConfigured(): void {
    const missing = this.getMissingVars();
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Supabase Storage not configured. Missing environment variables: ${missing.join(', ')}`),
        { status: 503 }
      );
    }
  }

  async uploadEvidence(_file: Express.Multer.File, _meta: { caseId: string; kind: string }): Promise<UploadResult> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase Storage upload not yet implemented. Install @supabase/supabase-js and implement.'),
      { status: 501 }
    );
  }

  async getSignedUploadUrl(_meta: { caseId: string; filename: string; contentType: string }): Promise<{ url: string; expiresAt: number }> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase Storage signed URL generation not yet implemented.'),
      { status: 501 }
    );
  }
}
