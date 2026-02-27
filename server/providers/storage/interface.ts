export interface UploadResult {
  url: string;
  providerMeta?: Record<string, any>;
}

export interface StorageProvider {
  uploadEvidence(file: Express.Multer.File, meta: { caseId: string; kind: string }): Promise<UploadResult>;
  getSignedUploadUrl?(meta: { caseId: string; filename: string; contentType: string }): Promise<{ url: string; expiresAt: number }>;
}
