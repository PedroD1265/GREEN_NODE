import fs from 'fs';
import path from 'path';
import { getConfig } from '../../config';
import { initDb, closeDb } from '../index';
import { seedDb } from '../seed';

async function main() {
  try {
    const config = getConfig();
    
    closeDb();
    
    if (fs.existsSync(config.dbPath)) {
      fs.unlinkSync(config.dbPath);
      console.log('[Reset] Deleted database file');
    }
    
    const shm = config.dbPath + '-shm';
    const wal = config.dbPath + '-wal';
    if (fs.existsSync(shm)) fs.unlinkSync(shm);
    if (fs.existsSync(wal)) fs.unlinkSync(wal);
    
    initDb();
    seedDb();
    closeDb();
    
    console.log('[Reset] Successfully reset and seeded database');
    process.exit(0);
  } catch (error) {
    console.error('[Reset] Error:', error);
    process.exit(1);
  }
}

main();
