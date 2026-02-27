import { AIProvider, ClassificationResult, RecommendCollectorsResult } from './interface';

const MATERIAL_DB: Record<string, { bucket: string; tips: string[] }> = {
  'PET': { bucket: 'Reciclable', tips: ['Enjuaga antes de reciclar', 'Retira la etiqueta', 'Aplasta la botella'] },
  'Cartón': { bucket: 'Reciclable', tips: ['Debe estar seco', 'Sin grasa ni humedad', 'Aplana las cajas'] },
  'Vidrio': { bucket: 'Reciclable', tips: ['Lava antes de reciclar', 'Retira las tapas', 'Cuidado con fragmentos'] },
  'Aluminio': { bucket: 'Reciclable', tips: ['Aplasta las latas', 'Limpia residuos', 'No mezclar con otros metales'] },
  'Papel': { bucket: 'Reciclable', tips: ['Sin grapas ni cintas', 'Mantener seco', 'No papel encerado'] },
  'Plástico rígido': { bucket: 'Reciclable', tips: ['Limpia y seca', 'Separa por tipo', 'Retira etiquetas'] },
  'Acero/Chatarra': { bucket: 'Reciclable', tips: ['Separa de otros metales', 'Quita partes no metálicas'] },
  'Restos de cocina': { bucket: 'Biodegradable', tips: ['Ideal para compost', 'Separa de plásticos'] },
  'Pilas/Baterías': { bucket: 'Peligroso', tips: ['Nunca tirar a basura común', 'Llevar a punto de acopio'] },
};

export class AIMockProvider implements AIProvider {
  async classifyWasteFromImages(imageUrls: string[], _context?: Record<string, any>): Promise<ClassificationResult> {
    const hash = imageUrls.length > 0
      ? imageUrls[0].split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      : 42;

    const materials = Object.keys(MATERIAL_DB);
    const material = materials[hash % materials.length];
    const info = MATERIAL_DB[material];

    return {
      material,
      bucket: info.bucket,
      confidence: 0.85 + (hash % 15) / 100,
      quality: hash % 3 === 0 ? 'buena' : hash % 3 === 1 ? 'regular' : 'mala',
      tips: info.tips,
    };
  }

  async recommendCollectors(caseDraft: any, collectors: any[]): Promise<RecommendCollectorsResult> {
    const materials: string[] = (caseDraft.items || []).map((i: any) => i.materialName);

    const scored = collectors.map((col: any) => {
      const accepted = col.materialsAccepted || JSON.parse(col.materialsAcceptedJson || '[]');
      const matchCount = materials.filter((m: string) => accepted.includes(m)).length;
      const matchRatio = materials.length > 0 ? matchCount / materials.length : 0;
      const ratingScore = (col.rating || 0) / 5;
      const verifiedBonus = col.verified ? 0.1 : 0;
      const autoAcceptBonus = col.autoAccept ? 0.05 : 0;
      const score = matchRatio * 0.5 + ratingScore * 0.3 + verifiedBonus + autoAcceptBonus;

      const reasons: string[] = [];
      if (matchRatio === 1) reasons.push('Acepta todos los materiales');
      else if (matchRatio > 0) reasons.push(`Acepta ${matchCount}/${materials.length} materiales`);
      if (col.verified) reasons.push('Recolector verificado');
      if (col.rating >= 4.5) reasons.push(`Excelente rating (${col.rating})`);
      if (col.autoAccept) reasons.push('Acepta automáticamente');

      return {
        collectorId: col.id,
        collectorName: col.name,
        score: Math.round(score * 100) / 100,
        reasons,
      };
    });

    scored.sort((a: any, b: any) => b.score - a.score);
    const top3 = scored.slice(0, 3);

    return {
      recommendations: top3,
      recommendedId: top3[0]?.collectorId || '',
    };
  }

  async generateTips(material: string, _bucket: string, quality: string): Promise<string[]> {
    const info = MATERIAL_DB[material];
    const tips = info ? [...info.tips] : ['Separa correctamente', 'Limpia antes de reciclar'];
    if (quality === 'mala') tips.push('Mejora la calidad de separación para ganar más puntos');
    return tips;
  }
}
