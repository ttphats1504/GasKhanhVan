import { mysqlDB } from '../database/mysql';

async function createUsersTable() {
  try {
    console.log('Creating users table...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        photo_url TEXT,
        firebase_uid VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_firebase_uid (firebase_uid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await mysqlDB.query(createTableQuery);
    console.log('✅ Users table created successfully!');

    // Check if table exists and show structure
    const [rows]: any = await mysqlDB.query('DESCRIBE users');
    console.log('\nUsers table structure:');
    console.table(rows);

  } catch (error) {
    console.error('❌ Error creating users table:', error);
    throw error;
  }
}

// Run migration
createUsersTable()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

