import axios from 'axios';

const testAPI = async () => {
  try {
    console.log('🔍 Testing /api/banners endpoint...\n');
    
    const response = await axios.get('http://localhost:3001/api/banners');
    
    console.log(`Found ${response.data.length} banners:\n`);
    
    response.data.forEach((banner: any) => {
      console.log({
        id: banner.id,
        order: banner.order,
        categoryId: banner.categoryId,
        hasImage: !!banner.image,
      });
    });
    
    console.log('\n✅ API test completed!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ Make sure server is running on http://localhost:3001');
    process.exit(1);
  }
};

testAPI();

