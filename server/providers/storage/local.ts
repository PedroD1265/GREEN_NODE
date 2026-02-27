import path from 'path';
import fs from 'fs';
import { StorageProvider, UploadResult } from './interface';

export class LocalStorageProvider implements StorageProvider {
  private uploadsDir: string;

  constructor(uploadsDir: string) {
    this.uploadsDir = uploadsDir;
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadEvidence(file: Express.Multer.File, meta: { caseId: string; kind: string }): Promise<UploadResult> {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${meta.caseId}_${meta.kind}_${Date.now()}${ext}`;
    const destPath = path.join(this.uploadsDir, filename);
    fs.renameSync(file.path, destPath);
    const url = `/uploads/${filename}`;
    return { url, providerMeta: { local: true, path: destPath } };
  }
}
