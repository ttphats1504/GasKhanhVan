import { mysqlDB } from '../database/mysql';

async function createAdminUsersTable() {
  try {
    console.log('Creating admin_users table...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await mysqlDB.query(createTableQuery);
    console.log('✅ Admin users table created successfully!');

    // Insert default admin emails
    const insertDefaultAdmins = `
      INSERT IGNORE INTO admin_users (email, role, is_active) VALUES
      ('skphat789@gmail.com', 'super_admin', true)
      ON DUPLICATE KEY UPDATE email = email;
    `;

    await mysqlDB.query(insertDefaultAdmins);
    console.log('✅ Default admin users inserted!');

    // Check table structure
    const [rows]: any = await mysqlDB.query('DESCRIBE admin_users');
    console.log('\nAdmin users table structure:');
    console.table(rows);

    // Show inserted admins
    const [admins]: any = await mysqlDB.query('SELECT * FROM admin_users');
    console.log('\nCurrent admin users:');
    console.table(admins);

  } catch (error) {
    console.error('❌ Error creating admin_users table:', error);
    throw error;
  }
}

// Run migration
createAdminUsersTable()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

