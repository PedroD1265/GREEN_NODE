import path from "path";
import fs from "fs";
import { StorageProvider, UploadResult } from "./interface";

let objectStorageClient: any = null;
let objectStorageReady = false;
const bucketName = process.env.REPLIT_STORAGE_BUCKET || "";

async function getObjectStorageClient(): Promise<any | null> {
  if (objectStorageClient !== null) return objectStorageReady ? objectStorageClient : null;
  if (!bucketName) {
    objectStorageReady = false;
    objectStorageClient = false; // mark as checked
    return null;
  }
  try {
    const mod = await import("@replit/object-storage");
    objectStorageClient = new mod.Client();
    objectStorageReady = true;
    console.log(`[ReplitStorage] Object Storage connected (bucket: ${bucketName})`);
    return objectStorageClient;
  } catch (err) {
    console.warn("[ReplitStorage] @replit/object-storage not available, using local filesystem", err);
    objectStorageReady = false;
    objectStorageClient = false;
    return null;
  }
}

export class ReplitStorageProvider implements StorageProvider {
  private uploadsDir: string;
  private useObjectStorage: boolean;

  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR || "./uploads";
    this.useObjectStorage = !!bucketName;

    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    if (this.useObjectStorage) {
      console.log(`[ReplitStorage] Will use Object Storage (bucket: ${bucketName})`);
      // Eagerly init client
      getObjectStorageClient();
    } else {
      console.log(`[ReplitStorage] Using local uploads at ${this.uploadsDir} (set REPLIT_STORAGE_BUCKET to enable Object Storage)`);
    }
  }

  async uploadEvidence(
    file: Express.Multer.File,
    meta: { caseId: string; kind: string },
  ): Promise<UploadResult> {
    const ext = path.extname(file.originalname) || ".jpg";
    const timestamp = Date.now();
    const objectKey = `evidence/${meta.caseId}/${timestamp}-${meta.kind}${ext}`;

    // Try Object Storage first
    if (this.useObjectStorage) {
      try {
        const client = await getObjectStorageClient();
        if (client) {
          const fileBuffer = fs.readFileSync(file.path);
          await client.uploadFromBytes(objectKey, fileBuffer);
          // Clean up multer tmp file
          try { fs.unlinkSync(file.path); } catch { /* ignore */ }
          const url = `/uploads/${objectKey}`;
          console.log(`[ReplitStorage] Uploaded to Object Storage: ${objectKey}`);
          return {
            url,
            providerMeta: { provider: "replit-object-storage", bucket: bucketName, key: objectKey },
          };
        }
      } catch (err) {
        console.warn(`[ReplitStorage] Object Storage upload failed, falling back to local:`, err);
      }
    }

    // Fallback: local filesystem
    const filename = `${meta.caseId}_${meta.kind}_${timestamp}${ext}`;
    const destPath = path.join(this.uploadsDir, filename);
    fs.renameSync(file.path, destPath);
    const url = `/uploads/${filename}`;
    return { url, providerMeta: { provider: "replit-local", local: true, path: destPath } };
  }

  static validateConfig(): string[] {
    return [];
  }
}

// Export for use by the streaming route in server/index.ts
export { getObjectStorageClient, bucketName as REPLIT_STORAGE_BUCKET };
