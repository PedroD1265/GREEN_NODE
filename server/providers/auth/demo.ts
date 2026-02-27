import jwt from 'jsonwebtoken';
import { AuthProvider, AuthUser, LoginResult } from './interface';
import { getDb } from '../../db';
import { getConfig } from '../../config';

export class DemoAuthProvider implements AuthProvider {
  async login(role: string, _name?: string): Promise<LoginResult> {
    const db = getDb();
    const config = getConfig();

    let user: any;
    if (role === 'collector') {
      const collector = db.prepare('SELECT * FROM collectors WHERE id = ?').get('col-3') as any;
      user = { id: 'col-3', role: 'collector', name: collector?.name || 'EcoCocha', trustLevel: 'Oro', points: 0 };
    } else if (role === 'admin') {
      user = db.prepare('SELECT * FROM users WHERE role = ?').get('admin') as any;
      if (!user) user = { id: 'admin-1', role: 'admin', name: 'Admin', trustLevel: 'Oro', points: 0 };
      else user = { id: user.id, role: user.role, name: user.name, trustLevel: user.trustLevel, points: user.points };
    } else {
      user = db.prepare('SELECT * FROM users WHERE id = ?').get('user-me') as any;
      if (!user) user = { id: 'user-me', role: 'user', name: 'Ana', trustLevel: 'Plata', points: 1250 };
      else user = { id: user.id, role: 'user', name: user.name, trustLevel: user.trustLevel, points: user.points };
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '24h' });

    return { token, user };
  }

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const config = getConfig();
      const payload = jwt.verify(token, config.jwtSecret) as any;
      return this.getUser(payload.id);
    } catch {
      return null;
    }
  }

  async getUser(id: string): Promise<AuthUser | null> {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (user) {
      return { id: user.id, role: user.role, name: user.name, trustLevel: user.trustLevel, points: user.points };
    }
    const collector = db.prepare('SELECT * FROM collectors WHERE id = ?').get(id) as any;
    if (collector) {
      return { id: collector.id, role: 'collector', name: collector.name, trustLevel: 'Oro', points: 0 };
    }
    return null;
  }
}
