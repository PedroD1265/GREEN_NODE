import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getConfig } from '../config';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const config = getConfig();
    const dir = path.dirname(config.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(config.dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDb() {
  const d = getDb();

  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'user',
      name TEXT NOT NULL,
      trustLevel TEXT NOT NULL DEFAULT 'Bronce',
      points INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS collectors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'Independiente',
      verified INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 0,
      completedPickups INTEGER NOT NULL DEFAULT 0,
      autoAccept INTEGER NOT NULL DEFAULT 0,
      zone TEXT NOT NULL DEFAULT '',
      materialsAcceptedJson TEXT NOT NULL DEFAULT '[]',
      tariffsJson TEXT NOT NULL DEFAULT '{}',
      windowsJson TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      collectorId TEXT NOT NULL DEFAULT '',
      collectorName TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pendiente',
      materialsJson TEXT NOT NULL DEFAULT '[]',
      totalKg REAL NOT NULL DEFAULT 0,
      incentive TEXT NOT NULL DEFAULT 'Efectivo',
      scheduleJson TEXT NOT NULL DEFAULT '""',
      addressJson TEXT NOT NULL DEFAULT '""',
      addressVisible INTEGER NOT NULL DEFAULT 0,
      aiConfirmed INTEGER NOT NULL DEFAULT 0,
      incentiveType TEXT NOT NULL DEFAULT 'Efectivo',
      pin4 TEXT NOT NULL DEFAULT '',
      userLevel TEXT NOT NULL DEFAULT 'Bronce',
      payoutBs REAL,
      pointsEarned INTEGER,
      createdAt INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      url TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'photo',
      createdAt INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (caseId) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      fromRole TEXT NOT NULL,
      stars INTEGER NOT NULL DEFAULT 0,
      issuesJson TEXT NOT NULL DEFAULT '[]',
      createdAt INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (caseId) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      pointsCost INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      rewardId TEXT NOT NULL,
      createdAt INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (rewardId) REFERENCES rewards(id)
    );

    CREATE TABLE IF NOT EXISTS centers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      materialsJson TEXT NOT NULL DEFAULT '[]',
      hours TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT ''
    );
  `);

  console.log('[DB] Tables initialized');
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
