import path from 'path';
import fs from 'fs';
import { StorageProvider, UploadResult } from './interface';

export class ReplitStorageProvider implements StorageProvider {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR || './uploads';
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    console.log(`[ReplitStorageProvider] Using local uploads at ${this.uploadsDir}`);
    console.log('[ReplitStorageProvider] For production Replit deployments, migrate to Replit Object Storage (@replit/object-storage)');
  }

  async uploadEvidence(file: Express.Multer.File, meta: { caseId: string; kind: string }): Promise<UploadResult> {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${meta.caseId}_${meta.kind}_${Date.now()}${ext}`;
    const destPath = path.join(this.uploadsDir, filename);
    fs.renameSync(file.path, destPath);
    const url = `/uploads/${filename}`;
    return { url, providerMeta: { provider: 'replit', local: true, path: destPath } };
  }

  static validateConfig(): string[] {
    return [];
  }
}
