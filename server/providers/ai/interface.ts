export interface ClassificationResult {
  material: string;
  bucket: string;
  confidence: number;
  quality: 'buena' | 'regular' | 'mala';
  tips: string[];
}

export interface CollectorRecommendation {
  collectorId: string;
  collectorName: string;
  score: number;
  reasons: string[];
}

export interface RecommendCollectorsResult {
  recommendations: CollectorRecommendation[];
  recommendedId: string;
}

export interface AIProvider {
  classifyWasteFromImages(imageUrls: string[], context?: Record<string, any>): Promise<ClassificationResult>;
  recommendCollectors(caseDraft: any, collectors: any[]): Promise<RecommendCollectorsResult>;
  generateTips?(material: string, bucket: string, quality: string): Promise<string[]>;
}
