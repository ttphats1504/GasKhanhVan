import sequelize from '../config/db';
import Banner from '../models/BannerModel';

const checkBanners = async () => {
  try {
    console.log('🔍 Checking banners in database...\n');
    
    await sequelize.authenticate();
    
    const banners = await Banner.findAll({
      order: [['order', 'ASC']],
    });
    
    console.log(`Found ${banners.length} banners:\n`);
    
    banners.forEach((banner) => {
      console.log({
        id: banner.id,
        order: banner.order,
        categoryId: banner.categoryId,
        image: banner.image.substring(0, 50) + '...',
      });
    });
    
    console.log('\n✅ Check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkBanners();

