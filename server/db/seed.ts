import { getDb } from './index';

export function seedDb() {
  const db = getDb();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (userCount.count > 0) {
    console.log('[DB] Already seeded, skipping');
    return;
  }

  console.log('[DB] Seeding database...');

  const insertUser = db.prepare('INSERT INTO users (id, role, name, trustLevel, points) VALUES (?, ?, ?, ?, ?)');
  const insertCollector = db.prepare('INSERT INTO collectors (id, name, type, verified, rating, completedPickups, autoAccept, zone, materialsAcceptedJson, tariffsJson, windowsJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertCase = db.prepare('INSERT INTO cases (id, userId, collectorId, collectorName, status, materialsJson, totalKg, incentive, scheduleJson, addressJson, addressVisible, aiConfirmed, pin4, userLevel, payoutBs, pointsEarned, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertReward = db.prepare('INSERT INTO rewards (id, title, description, pointsCost, type, icon, category) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertCenter = db.prepare('INSERT INTO centers (id, name, materialsJson, hours, address, phone) VALUES (?, ?, ?, ?, ?, ?)');

  const seedAll = db.transaction(() => {
    insertUser.run('user-me', 'user', 'Ana', 'Plata', 1250);
    insertUser.run('user-other1', 'user', 'Carlos', 'Oro', 2100);
    insertUser.run('user-other2', 'user', 'María', 'Bronce', 400);
    insertUser.run('user-other3', 'user', 'Pedro', 'Plata', 900);
    insertUser.run('admin-1', 'admin', 'Admin', 'Oro', 0);

    const collectors = [
      {
        id: 'col-1', name: 'Carlos M.', type: 'Independiente', verified: 1, rating: 4.6,
        completedPickups: 87, autoAccept: 0, zone: 'Zona Norte - Cala Cala',
        materials: ['PET', 'Cartón', 'Papel', 'Plástico rígido'],
        tariffs: { 'PET': 1.5, 'Cartón': 0.8, 'Papel': 0.6, 'Plástico rígido': 1.2 },
        windows: ['Lun-Vie 8:00-12:00', 'Lun-Vie 14:00-18:00'],
      },
      {
        id: 'col-2', name: 'María R.', type: 'Independiente', verified: 1, rating: 4.4,
        completedPickups: 52, autoAccept: 0, zone: 'Zona Sur - Temporal',
        materials: ['Vidrio', 'Aluminio', 'Acero/Chatarra'],
        tariffs: { 'Vidrio': 1.0, 'Aluminio': 8.0, 'Acero/Chatarra': 3.5 },
        windows: ['Mar-Sáb 9:00-13:00'],
      },
      {
        id: 'col-3', name: 'EcoCocha', type: 'Empresa', verified: 1, rating: 4.8,
        completedPickups: 342, autoAccept: 1, zone: 'Toda Cochabamba',
        materials: ['PET', 'Cartón', 'Papel', 'Vidrio', 'Aluminio', 'Plástico rígido', 'Acero/Chatarra'],
        tariffs: { 'PET': 1.2, 'Cartón': 0.7, 'Papel': 0.5, 'Vidrio': 0.8, 'Aluminio': 7.5, 'Plástico rígido': 1.0, 'Acero/Chatarra': 3.0 },
        windows: ['Lun-Sáb 7:00-19:00'],
      },
    ];

    for (const c of collectors) {
      insertCollector.run(c.id, c.name, c.type, c.verified, c.rating, c.completedPickups, c.autoAccept, c.zone, JSON.stringify(c.materials), JSON.stringify(c.tariffs), JSON.stringify(c.windows));
    }

    const now = Date.now();
    const cases = [
      {
        id: 'CASE-001', userId: 'user-me', collectorId: 'col-3', collectorName: 'EcoCocha',
        status: 'Completado',
        items: [{ materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 3.5, photos: 4 }],
        totalKg: 3.5, incentive: 'Puntos', schedule: 'Ayer 10:00-12:00',
        address: 'Av. América #234, Cala Cala', addressVisible: 1, aiConfirmed: 1,
        pin4: '4821', userLevel: 'Plata', payoutBs: null, pointsEarned: 7, createdAt: now - 86400000,
      },
      {
        id: 'CASE-002', userId: 'user-me', collectorId: 'col-1', collectorName: 'Carlos M.',
        status: 'En camino',
        items: [
          { materialId: 'm3', materialName: 'Cartón', bucket: 'Reciclable', estimatedKg: 5, photos: 3 },
          { materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 2, photos: 2 },
        ],
        totalKg: 7, incentive: 'Efectivo', schedule: 'Hoy 14:00-16:00',
        address: 'C. Baptista #567, Centro', addressVisible: 1, aiConfirmed: 1,
        pin4: '7392', userLevel: 'Plata', payoutBs: 9.5, pointsEarned: null, createdAt: now - 3600000,
      },
      {
        id: 'CASE-003', userId: 'user-other1', collectorId: 'col-2', collectorName: 'María R.',
        status: 'Aceptado',
        items: [{ materialId: 'm6', materialName: 'Aluminio', bucket: 'Reciclable', estimatedKg: 2, photos: 4 }],
        totalKg: 2, incentive: 'Efectivo', schedule: 'Mañana 9:00-11:00',
        address: 'Av. Heroínas #890', addressVisible: 1, aiConfirmed: 0,
        pin4: '1548', userLevel: 'Oro', payoutBs: 16, pointsEarned: null, createdAt: now - 7200000,
      },
      {
        id: 'CASE-004', userId: 'user-other2', collectorId: '', collectorName: '',
        status: 'Pendiente',
        items: [{ materialId: 'm5', materialName: 'Vidrio', bucket: 'Reciclable', estimatedKg: 4, photos: 3 }],
        totalKg: 4, incentive: 'Puntos', schedule: 'Mañana 14:00-16:00',
        address: 'Dirección protegida', addressVisible: 0, aiConfirmed: 1,
        pin4: '6204', userLevel: 'Bronce', payoutBs: null, pointsEarned: 12, createdAt: now - 1800000,
      },
      {
        id: 'CASE-005', userId: 'user-other3', collectorId: '', collectorName: '',
        status: 'Pendiente',
        items: [
          { materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 8, photos: 4 },
          { materialId: 'm3', materialName: 'Cartón', bucket: 'Reciclable', estimatedKg: 3, photos: 2 },
        ],
        totalKg: 11, incentive: 'Efectivo', schedule: 'Hoy 16:00-18:00',
        address: 'Dirección protegida', addressVisible: 0, aiConfirmed: 1,
        pin4: '3917', userLevel: 'Plata', payoutBs: null, pointsEarned: null, createdAt: now - 900000,
      },
      {
        id: 'CASE-006', userId: 'user-other1', collectorId: 'col-2', collectorName: 'María R.',
        status: 'Completado',
        items: [{ materialId: 'm7', materialName: 'Acero/Chatarra', bucket: 'Reciclable', estimatedKg: 15, photos: 4 }],
        totalKg: 15, incentive: 'Efectivo', schedule: 'Hace 3 días',
        address: 'Av. Blanco Galindo km 2', addressVisible: 1, aiConfirmed: 0,
        pin4: '8523', userLevel: 'Oro', payoutBs: 52.5, pointsEarned: null, createdAt: now - 259200000,
      },
    ];

    for (const c of cases) {
      insertCase.run(c.id, c.userId, c.collectorId, c.collectorName, c.status, JSON.stringify(c.items), c.totalKg, c.incentive, JSON.stringify(c.schedule), JSON.stringify(c.address), c.addressVisible, c.aiConfirmed, c.pin4, c.userLevel, c.payoutBs, c.pointsEarned, c.createdAt);
    }

    const rewards = [
      { id: 'rw1', title: 'Recarga móvil Bs 10', description: 'Entel, Tigo o Viva', pointsCost: 100, type: 'digital', icon: '📱', category: 'Telecomunicaciones' },
      { id: 'rw2', title: 'Café con snack', description: 'Café Cafeladería (cualquier sede)', pointsCost: 150, type: 'physical', icon: '☕', category: 'Gastronomía' },
      { id: 'rw3', title: 'Cupón supermercado Bs 20', description: 'Hipermaxi o IC Norte', pointsCost: 250, type: 'digital', icon: '🛒', category: 'Compras' },
      { id: 'rw4', title: 'Bolsa reutilizable', description: 'Bolsa ecológica de tela Green Node', pointsCost: 200, type: 'physical', icon: '🛍️', category: 'Eco' },
      { id: 'rw5', title: 'Abono/Compost 5kg', description: 'Compost orgánico certificado', pointsCost: 300, type: 'physical', icon: '🌱', category: 'Jardín' },
      { id: 'rw6', title: 'Botella térmica', description: 'Botella térmica acero inoxidable 500ml', pointsCost: 500, type: 'physical', icon: '🍶', category: 'Eco' },
      { id: 'rw7', title: 'Crédito $10 (Premium)', description: 'Crédito digital para servicios premium', pointsCost: 1000, type: 'digital', icon: '💎', category: 'Premium' },
    ];

    for (const r of rewards) {
      insertReward.run(r.id, r.title, r.description, r.pointsCost, r.type, r.icon, r.category);
    }

    const centers = [
      { id: 'c1', name: 'EcoPunto Cala Cala', materials: ['PET', 'Cartón', 'Vidrio', 'Aluminio'], hours: 'Lun-Vie 8:00-17:00', address: 'Av. América E-0234', phone: '4-4251234' },
      { id: 'c2', name: 'Centro RAEE Municipal', materials: ['Electrónicos (RAEE)', 'Pilas/Baterías'], hours: 'Lun-Vie 9:00-16:00', address: 'C. Jordán esq. Hamiraya', phone: '4-4259876' },
      { id: 'c3', name: 'Punto Verde EMSA', materials: ['PET', 'Vidrio', 'Cartón', 'Papel', 'Aluminio', 'Acero/Chatarra'], hours: 'Lun-Sáb 7:00-18:00', address: 'Av. Blanco Galindo km 4', phone: '4-4367890' },
    ];

    for (const c of centers) {
      insertCenter.run(c.id, c.name, JSON.stringify(c.materials), c.hours, c.address, c.phone);
    }
  });

  seedAll();
  console.log('[DB] Seed complete');
}
