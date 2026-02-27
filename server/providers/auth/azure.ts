import { AuthProvider, AuthUser, LoginResult } from './interface';

export class AzureAuthProvider implements AuthProvider {
  private tenantId: string;
  private clientId: string;
  private issuer: string;
  private audience: string;

  constructor() {
    this.tenantId = process.env.AUTH_TENANT_ID || '';
    this.clientId = process.env.AUTH_CLIENT_ID || '';
    this.issuer = process.env.AUTH_ISSUER || '';
    this.audience = process.env.AUTH_AUDIENCE || '';

    if (!this.tenantId || !this.clientId) {
      console.warn('[AzureAuth] Missing config: AUTH_TENANT_ID and/or AUTH_CLIENT_ID');
    }
  }

  private ensureConfigured(): void {
    const missing: string[] = [];
    if (!this.tenantId) missing.push('AUTH_TENANT_ID');
    if (!this.clientId) missing.push('AUTH_CLIENT_ID');
    if (!this.issuer) missing.push('AUTH_ISSUER');
    if (!this.audience) missing.push('AUTH_AUDIENCE');
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Auth real no configurada. Variables faltantes: ${missing.join(', ')}`),
        { status: 503 }
      );
    }
  }

  async login(_role: string, _name?: string): Promise<LoginResult> {
    this.ensureConfigured();
    // TODO: Implement with Microsoft Entra External ID / B2C
    // Would redirect to Entra login page
    throw Object.assign(
      new Error('Azure Entra auth login not yet implemented. Configure Microsoft Entra External ID.'),
      { status: 501 }
    );
  }

  async verifyToken(_token: string): Promise<AuthUser | null> {
    this.ensureConfigured();
    // TODO: Validate JWT against Entra JWKS endpoint
    // const jwksUri = `${this.issuer}/.well-known/openid-configuration`;
    throw Object.assign(
      new Error('Azure Entra token verification not yet implemented.'),
      { status: 501 }
    );
  }

  async getUser(_id: string): Promise<AuthUser | null> {
    this.ensureConfigured();
    // TODO: Query Microsoft Graph API for user info
    throw Object.assign(
      new Error('Azure Entra user lookup not yet implemented.'),
      { status: 501 }
    );
  }
}
