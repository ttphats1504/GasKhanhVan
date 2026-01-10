import sequelize from '../config/db';
import { up } from './add-categoryId-to-banners';

const runMigration = async () => {
  try {
    console.log('🚀 Starting migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Run migration
    await up(sequelize.getQueryInterface());
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();

