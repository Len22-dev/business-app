import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔄 Running database migrations...');

  try {
    // Create connection for migrations
    const migrationClient = postgres(databaseUrl, { max: 1 });
    const db = drizzle(migrationClient);

    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Migrations completed successfully');
    
    // Close connection
    await migrationClient.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };