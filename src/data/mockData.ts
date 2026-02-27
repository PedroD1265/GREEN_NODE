// GREEN NODE - Demo Data (Cochabamba, Bolivia)

export type Bucket = 'Reciclable' | 'Biodegradable' | 'No aprovechable' | 'Peligroso' | 'Especial';
export type CaseStatus = 'Pendiente' | 'Aceptado' | 'En camino' | 'Completado';
export type UserLevel = 'Bronce' | 'Plata' | 'Oro';
export type IncentiveType = 'Efectivo' | 'Puntos';
export type CollectorType = 'Independiente' | 'Empresa';

export interface Material {
  id: string;
  name: string;
  bucket: Bucket;
  icon: string;
  pointsPerKg: number;
  tips: string;
}

export interface CaseItem {
  materialId: string;
  materialName: string;
  bucket: Bucket;
  estimatedKg: number;
  photos: number;
}

export interface PickupCase {
  id: string;
  status: CaseStatus;
  items: CaseItem[];
  totalKg: number;
  incentive: IncentiveType;
  collectorId: string;
  collectorName: string;
  scheduledTime: string;
  address: string;
  addressVisible: boolean;
  pin: string;
  aiConfirmed: boolean;
  createdAt: number;
  userLevel: UserLevel;
  userId: string;
  payoutBs?: number;
  pointsEarned?: number;
}

export interface Collector {
  id: string;
  name: string;
  type: CollectorType;
  rating: number;
  completedPickups: number;
  verified: boolean;
  materialsAccepted: string[];
  tariffs: Record<string, number>; // material -> Bs/kg
  pickupWindows: string[];
  zone: string;
  autoAccept: boolean;
  aiRecommended?: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  icon: string;
  category: string;
}

export interface Center {
  id: string;
  name: string;
  materialsAccepted: string[];
  hours: string;
  address: string;
  phone: string;
}

// ─── MATERIALS TO BUCKET MAPPING ───
export const MATERIALS: Material[] = [
  { id: 'm1', name: 'PET', bucket: 'Reciclable', icon: '🥤', pointsPerKg: 2, tips: 'Enjuaga, retira etiqueta y aplasta.' },
  { id: 'm2', name: 'Plástico rígido', bucket: 'Reciclable', icon: '🪣', pointsPerKg: 2, tips: 'Limpia y seca antes de separar.' },
  { id: 'm3', name: 'Cartón', bucket: 'Reciclable', icon: '📦', pointsPerKg: 1, tips: 'Debe estar seco, sin grasa ni humedad.' },
  { id: 'm4', name: 'Papel', bucket: 'Reciclable', icon: '📄', pointsPerKg: 1, tips: 'Sin grapas ni cintas adhesivas si es posible.' },
  { id: 'm5', name: 'Vidrio', bucket: 'Reciclable', icon: '🍾', pointsPerKg: 3, tips: 'Lava y retira tapas. Cuidado al manipular.' },
  { id: 'm6', name: 'Aluminio', bucket: 'Reciclable', icon: '🥫', pointsPerKg: 5, tips: 'Aplasta la lata para ahorrar espacio.' },
  { id: 'm7', name: 'Acero/Chatarra', bucket: 'Reciclable', icon: '🔩', pointsPerKg: 3, tips: 'Separa de otros metales si es posible.' },
  { id: 'm8', name: 'Restos de cocina', bucket: 'Biodegradable', icon: '🥬', pointsPerKg: 0, tips: 'Ideal para compostaje. Separa de plásticos.' },
  { id: 'm9', name: 'Residuos de jardín', bucket: 'Biodegradable', icon: '🌿', pointsPerKg: 0, tips: 'Hojas, ramas pequeñas. Compostable.' },
  { id: 'm10', name: 'Envolturas/Bolsas nylon', bucket: 'No aprovechable', icon: '🗑️', pointsPerKg: 0, tips: 'Lamentablemente no reciclable en la mayoría de centros.' },
  { id: 'm11', name: 'Tetra Pak', bucket: 'No aprovechable', icon: '🧃', pointsPerKg: 0, tips: 'Puede variar si un recolector especializado lo acepta.' },
  { id: 'm12', name: 'Pilas/Baterías', bucket: 'Peligroso', icon: '🔋', pointsPerKg: 0, tips: 'Nunca tirar a basura común. Llevar a punto de acopio.' },
  { id: 'm13', name: 'Electrónicos (RAEE)', bucket: 'Peligroso', icon: '📱', pointsPerKg: 0, tips: 'Requiere manejo especial. Consulta centros RAEE.' },
  { id: 'm14', name: 'Medicamentos', bucket: 'Peligroso', icon: '💊', pointsPerKg: 0, tips: 'Llevar a farmacias autorizadas. No tirar al drenaje.' },
  { id: 'm15', name: 'Muebles/Escombros', bucket: 'Especial', icon: '🧱', pointsPerKg: 0, tips: 'Coordinar recojo especial. Voluminosos requieren vehículo grande.' },
];

// ─── COLLECTORS (3 demo) ───
export const COLLECTORS: Collector[] = [
  {
    id: 'col-1',
    name: 'Carlos M.',
    type: 'Independiente',
    rating: 4.6,
    completedPickups: 87,
    verified: true,
    materialsAccepted: ['PET', 'Cartón', 'Papel', 'Plástico rígido'],
    tariffs: { 'PET': 1.5, 'Cartón': 0.8, 'Papel': 0.6, 'Plástico rígido': 1.2 },
    pickupWindows: ['Lun-Vie 8:00-12:00', 'Lun-Vie 14:00-18:00'],
    zone: 'Zona Norte - Cala Cala',
    autoAccept: false,
  },
  {
    id: 'col-2',
    name: 'María R.',
    type: 'Independiente',
    rating: 4.4,
    completedPickups: 52,
    verified: true,
    materialsAccepted: ['Vidrio', 'Aluminio', 'Acero/Chatarra'],
    tariffs: { 'Vidrio': 1.0, 'Aluminio': 8.0, 'Acero/Chatarra': 3.5 },
    pickupWindows: ['Mar-Sáb 9:00-13:00'],
    zone: 'Zona Sur - Temporal',
    autoAccept: false,
  },
  {
    id: 'col-3',
    name: 'EcoCocha',
    type: 'Empresa',
    rating: 4.8,
    completedPickups: 342,
    verified: true,
    materialsAccepted: ['PET', 'Cartón', 'Papel', 'Vidrio', 'Aluminio', 'Plástico rígido', 'Acero/Chatarra'],
    tariffs: { 'PET': 1.2, 'Cartón': 0.7, 'Papel': 0.5, 'Vidrio': 0.8, 'Aluminio': 7.5, 'Plástico rígido': 1.0, 'Acero/Chatarra': 3.0 },
    pickupWindows: ['Lun-Sáb 7:00-19:00'],
    zone: 'Toda Cochabamba',
    autoAccept: true,
    aiRecommended: true,
  },
];

// ─── REWARDS CATALOG (7 items) ───
export const REWARDS: Reward[] = [
  { id: 'rw1', name: 'Recarga móvil Bs 10', description: 'Entel, Tigo o Viva', pointsCost: 100, icon: '📱', category: 'Telecomunicaciones' },
  { id: 'rw2', name: 'Café con snack', description: 'Café Cafeladería (cualquier sede)', pointsCost: 150, icon: '☕', category: 'Gastronomía' },
  { id: 'rw3', name: 'Cupón supermercado Bs 20', description: 'Hipermaxi o IC Norte', pointsCost: 250, icon: '🛒', category: 'Compras' },
  { id: 'rw4', name: 'Bolsa reutilizable', description: 'Bolsa ecológica de tela Green Node', pointsCost: 200, icon: '🛍️', category: 'Eco' },
  { id: 'rw5', name: 'Abono/Compost 5kg', description: 'Compost orgánico certificado', pointsCost: 300, icon: '🌱', category: 'Jardín' },
  { id: 'rw6', name: 'Botella térmica', description: 'Botella térmica acero inoxidable 500ml', pointsCost: 500, icon: '🍶', category: 'Eco' },
  { id: 'rw7', name: 'Crédito $10 (Premium)', description: 'Crédito digital para servicios premium', pointsCost: 1000, icon: '💎', category: 'Premium' },
];

// ─── CENTERS / ACOPIO ───
export const CENTERS: Center[] = [
  { id: 'c1', name: 'EcoPunto Cala Cala', materialsAccepted: ['PET', 'Cartón', 'Vidrio', 'Aluminio'], hours: 'Lun-Vie 8:00-17:00', address: 'Av. América E-0234', phone: '4-4251234' },
  { id: 'c2', name: 'Centro RAEE Municipal', materialsAccepted: ['Electrónicos (RAEE)', 'Pilas/Baterías'], hours: 'Lun-Vie 9:00-16:00', address: 'C. Jordán esq. Hamiraya', phone: '4-4259876' },
  { id: 'c3', name: 'Punto Verde EMSA', materialsAccepted: ['PET', 'Vidrio', 'Cartón', 'Papel', 'Aluminio', 'Acero/Chatarra'], hours: 'Lun-Sáb 7:00-18:00', address: 'Av. Blanco Galindo km 4', phone: '4-4367890' },
];

// ─── POINTS RULES ───
export const POINTS_RULES = [
  { material: 'PET', pointsPerKg: 2 },
  { material: 'Vidrio', pointsPerKg: 3 },
  { material: 'Aluminio', pointsPerKg: 5 },
  { material: 'Cartón', pointsPerKg: 1 },
  { material: 'Papel', pointsPerKg: 1 },
  { material: 'Acero/Chatarra', pointsPerKg: 3 },
  { material: 'Plástico rígido', pointsPerKg: 2 },
];

// ─── DEMO CASES (6 cases) ───
export const DEMO_CASES: PickupCase[] = [
  {
    id: 'CASE-001', status: 'Completado',
    items: [{ materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 3.5, photos: 4 }],
    totalKg: 3.5, incentive: 'Puntos', collectorId: 'col-3', collectorName: 'EcoCocha',
    scheduledTime: 'Ayer 10:00-12:00', address: 'Av. América #234, Cala Cala',
    addressVisible: true, pin: '4821', aiConfirmed: true, createdAt: Date.now() - 86400000,
    userLevel: 'Plata', userId: 'user-me', pointsEarned: 7,
  },
  {
    id: 'CASE-002', status: 'En camino',
    items: [
      { materialId: 'm3', materialName: 'Cartón', bucket: 'Reciclable', estimatedKg: 5, photos: 3 },
      { materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 2, photos: 2 },
    ],
    totalKg: 7, incentive: 'Efectivo', collectorId: 'col-1', collectorName: 'Carlos M.',
    scheduledTime: 'Hoy 14:00-16:00', address: 'C. Baptista #567, Centro',
    addressVisible: true, pin: '7392', aiConfirmed: true, createdAt: Date.now() - 3600000,
    userLevel: 'Plata', userId: 'user-me', payoutBs: 9.5,
  },
  {
    id: 'CASE-003', status: 'Aceptado',
    items: [{ materialId: 'm6', materialName: 'Aluminio', bucket: 'Reciclable', estimatedKg: 2, photos: 4 }],
    totalKg: 2, incentive: 'Efectivo', collectorId: 'col-2', collectorName: 'María R.',
    scheduledTime: 'Mañana 9:00-11:00', address: 'Av. Heroínas #890',
    addressVisible: true, pin: '1548', aiConfirmed: false, createdAt: Date.now() - 7200000,
    userLevel: 'Oro', userId: 'user-other1', payoutBs: 16,
  },
  {
    id: 'CASE-004', status: 'Pendiente',
    items: [
      { materialId: 'm5', materialName: 'Vidrio', bucket: 'Reciclable', estimatedKg: 4, photos: 3 },
    ],
    totalKg: 4, incentive: 'Puntos', collectorId: '', collectorName: '',
    scheduledTime: 'Mañana 14:00-16:00', address: 'Dirección protegida',
    addressVisible: false, pin: '6204', aiConfirmed: true, createdAt: Date.now() - 1800000,
    userLevel: 'Bronce', userId: 'user-other2', pointsEarned: 12,
  },
  {
    id: 'CASE-005', status: 'Pendiente',
    items: [
      { materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 8, photos: 4 },
      { materialId: 'm3', materialName: 'Cartón', bucket: 'Reciclable', estimatedKg: 3, photos: 2 },
    ],
    totalKg: 11, incentive: 'Efectivo', collectorId: '', collectorName: '',
    scheduledTime: 'Hoy 16:00-18:00', address: 'Dirección protegida',
    addressVisible: false, pin: '3917', aiConfirmed: true, createdAt: Date.now() - 900000,
    userLevel: 'Plata', userId: 'user-other3',
  },
  {
    id: 'CASE-006', status: 'Completado',
    items: [{ materialId: 'm7', materialName: 'Acero/Chatarra', bucket: 'Reciclable', estimatedKg: 15, photos: 4 }],
    totalKg: 15, incentive: 'Efectivo', collectorId: 'col-2', collectorName: 'María R.',
    scheduledTime: 'Hace 3 días', address: 'Av. Blanco Galindo km 2',
    addressVisible: true, pin: '8523', aiConfirmed: false, createdAt: Date.now() - 259200000,
    userLevel: 'Oro', userId: 'user-other1', payoutBs: 52.5,
  },
];

// ─── BUCKET HELPERS ───
export const BUCKET_CONFIG: Record<Bucket, { color: string; bgColor: string; icon: string }> = {
  'Reciclable': { color: '#16A34A', bgColor: '#DCFCE7', icon: '✅' },
  'Biodegradable': { color: '#146C43', bgColor: '#DFF3E7', icon: '🌿' },
  'No aprovechable': { color: '#6B7280', bgColor: '#F3F4F6', icon: '🗑️' },
  'Peligroso': { color: '#DC2626', bgColor: '#FEE2E2', icon: '⚠️' },
  'Especial': { color: '#F59E0B', bgColor: '#FEF3C7', icon: '🧱' },
};

export function getBucketForMaterial(name: string): Bucket {
  const mat = MATERIALS.find(m => m.name === name);
  return mat?.bucket || 'No aprovechable';
}
