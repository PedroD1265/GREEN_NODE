# Microsoft Integration Guide - GREEN NODE

This document describes how to connect GREEN NODE to Microsoft Azure services for production use.

## Prerequisites

- Azure subscription
- Azure CLI installed or Azure Portal access
- GREEN NODE running in demo mode

## 1. Azure Blob Storage (Evidence Photos)

### Setup Steps

1. Create a Storage Account:
   ```bash
   az storage account create \
     --name greennodestorage \
     --resource-group green-node-rg \
     --location eastus \
     --sku Standard_LRS
   ```

2. Create a container for evidence:
   ```bash
   az storage container create \
     --account-name greennodestorage \
     --name evidence \
     --public-access off
   ```

3. Get the connection string:
   ```bash
   az storage account show-connection-string \
     --name greennodestorage \
     --resource-group green-node-rg
   ```

4. Set environment variables:
   ```
   AZURE_STORAGE_ACCOUNT=greennodestorage
   AZURE_STORAGE_CONTAINER=evidence
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
   AZURE_STORAGE_SAS_TTL_MINUTES=60
   ```

5. Set `STORAGE_PROVIDER=azure` or `APP_MODE=real`

### Implementation

The `AzureBlobStorageProvider` in `server/providers/storage/azure.ts` needs:
- Install `@azure/storage-blob` package
- Implement `uploadEvidence()` using `BlobServiceClient`
- Optionally implement `getSignedUploadUrl()` for client-side uploads

## 2. Azure OpenAI (Waste Classification)

### Setup Steps

1. Create an Azure OpenAI resource:
   ```bash
   az cognitiveservices account create \
     --name green-node-openai \
     --resource-group green-node-rg \
     --kind OpenAI \
     --sku S0 \
     --location eastus
   ```

2. Deploy a vision-capable model (GPT-4o):
   - Navigate to Azure OpenAI Studio
   - Create deployment with a vision-capable model
   - Note the deployment name

3. Get the endpoint and key:
   ```bash
   az cognitiveservices account show \
     --name green-node-openai \
     --resource-group green-node-rg \
     --query properties.endpoint

   az cognitiveservices account keys list \
     --name green-node-openai \
     --resource-group green-node-rg
   ```

4. Set environment variables:
   ```
   AZURE_OPENAI_ENDPOINT=https://green-node-openai.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key
   AZURE_OPENAI_DEPLOYMENT=gpt-4o
   AZURE_OPENAI_API_VERSION=2024-02-01
   ```

5. Set `AI_PROVIDER=azure` or `APP_MODE=real`

### Implementation

The `AzureAIProvider` in `server/providers/ai/azure.ts` needs:
- Install `openai` package
- Implement `classifyWasteFromImages()` with GPT-4 Vision
- Send images with a structured prompt for waste classification
- Parse the response into `ClassificationResult` format

### Suggested Prompt

```
Analyze the waste material in these images. Respond in JSON format:
{
  "material": "name of the material",
  "bucket": "Reciclable|Biodegradable|No aprovechable|Peligroso|Especial",
  "confidence": 0.0-1.0,
  "quality": "buena|regular|mala",
  "tips": ["tip1", "tip2", "tip3"]
}
Context: This is for a recycling platform in Cochabamba, Bolivia.
```

## 3. Microsoft Entra External ID (Authentication)

### Setup Steps

1. Create an Entra External ID tenant:
   - Go to Azure Portal > Microsoft Entra External ID
   - Create a new external tenant
   - Note the Tenant ID

2. Register an application:
   - Go to App registrations > New registration
   - Set redirect URIs for your deployment URL
   - Note the Client ID

3. Configure user flows:
   - Set up sign-up/sign-in flows
   - Configure required attributes (name, email)

4. Set environment variables:
   ```
   AUTH_TENANT_ID=your-tenant-id
   AUTH_CLIENT_ID=your-client-id
   AUTH_ISSUER=https://your-tenant.ciamlogin.com/your-tenant-id/v2.0
   AUTH_AUDIENCE=your-client-id
   ```

5. Set `AUTH_MODE=real` or `APP_MODE=real`

### Implementation

The `AzureAuthProvider` in `server/providers/auth/azure.ts` needs:
- Install `@azure/identity` and `jwks-rsa` packages
- Implement JWT validation against Entra JWKS endpoint
- Map Entra user claims to internal `AuthUser` model
- Implement `login()` to redirect to Entra sign-in page

## Switching to Real Mode

To switch from demo to real mode:

1. Set all required environment variables
2. Set `APP_MODE=real` (or individual provider vars)
3. Restart the server
4. Check `/api/health` for any missing configuration warnings

The health endpoint will report which providers are active and flag any missing environment variables.
