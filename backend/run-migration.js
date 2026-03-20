// Load environment variables FIRST before anything else
require('dotenv').config();

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration from environment only — never hardcode credentials
if (!process.env.NEON_DB_URL) {
  console.error('❌ NEON_DB_URL environment variable is not set.');
  console.error('   Create a .env file with: NEON_DB_URL=postgresql://...');
  process.exit(1);
}

const dbConfig = {
  connectionString: process.env.NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

async function runMigration() {
  const pool = new Pool(dbConfig);

  try {
    console.log('🔗 Connecting to database...');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'database', 'migration-dynamic-nft.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');
    console.log('🚀 Running migration...');

    // Execute the migration
    const result = await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Result:', result[result.length - 1]?.rows || 'Migration executed');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

runMigration();
