import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';

dotenv.config(); // Thêm dòng này để đảm bảo .env được load

const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

// Test connection
pinata.testAuthentication()
    .then(() => console.log('✅ Pinata connected'))
    .catch((err) => console.error('❌ Pinata connection failed:', err));

export default pinata;
