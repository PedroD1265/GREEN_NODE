import { initDb } from '../index';
import { seedDb } from '../seed';

async function main() {
  try {
    initDb();
    seedDb();
    console.log('[Seed] Successfully seeded database');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  }
}

main();
