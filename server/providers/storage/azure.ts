import { StorageProvider, UploadResult } from './interface';

export class AzureBlobStorageProvider implements StorageProvider {
  private account: string;
  private container: string;
  private connectionString?: string;
  private sasTtlMinutes: number;

  constructor() {
    this.account = process.env.AZURE_STORAGE_ACCOUNT || '';
    this.container = process.env.AZURE_STORAGE_CONTAINER || '';
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.sasTtlMinutes = parseInt(process.env.AZURE_STORAGE_SAS_TTL_MINUTES || '60', 10);

    if (!this.account || !this.container) {
      console.warn('[AzureBlobStorage] Missing config: AZURE_STORAGE_ACCOUNT and/or AZURE_STORAGE_CONTAINER');
    }
  }

  private ensureConfigured(): void {
    if (!this.account || !this.container) {
      throw Object.assign(
        new Error('Missing Azure Storage config. Set AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_CONTAINER environment variables.'),
        { status: 503 }
      );
    }
  }

  async uploadEvidence(_file: Express.Multer.File, _meta: { caseId: string; kind: string }): Promise<UploadResult> {
    this.ensureConfigured();
    // TODO: Implement with @azure/storage-blob SDK
    // const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
    // const containerClient = blobServiceClient.getContainerClient(this.container);
    // const blobName = `${meta.caseId}/${meta.kind}_${Date.now()}${ext}`;
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // await blockBlobClient.uploadFile(file.path);
    // return { url: blockBlobClient.url, providerMeta: { azure: true, blobName } };
    throw Object.assign(
      new Error('Azure Blob Storage upload not yet implemented. Install @azure/storage-blob and implement.'),
      { status: 501 }
    );
  }

  async getSignedUploadUrl(_meta: { caseId: string; filename: string; contentType: string }): Promise<{ url: string; expiresAt: number }> {
    this.ensureConfigured();
    // TODO: Implement SAS URL generation
    throw Object.assign(
      new Error('Azure SAS URL generation not yet implemented.'),
      { status: 501 }
    );
  }
}
