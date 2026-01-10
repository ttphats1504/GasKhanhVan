import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Check if column already exists
  const tableDescription = await queryInterface.describeTable('banner_images');
  
  if (!tableDescription.categoryId) {
    console.log('Adding categoryId column to banner_images table...');
    
    await queryInterface.addColumn('banner_images', 'categoryId', {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    
    console.log('✅ categoryId column added successfully!');
  } else {
    console.log('⚠️ categoryId column already exists, skipping...');
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('Removing categoryId column from banner_images table...');
  
  await queryInterface.removeColumn('banner_images', 'categoryId');
  
  console.log('✅ categoryId column removed successfully!');
}

