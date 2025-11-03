// backend/test-pinata.js
import dotenv from 'dotenv';
import pinata from './src/config/pinata.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function testPinata() {
    try {
        console.log('🧪 Testing Pinata connection...');

        // Test authentication
        const result = await pinata.testAuthentication();
        console.log('✅ Pinata authenticated:', result);

        // Test upload
        const testFilePath = path.join(process.cwd(), 'test.txt');
        fs.writeFileSync(testFilePath, 'Hello from Research Network!');

        const readableStream = fs.createReadStream(testFilePath);

        const uploadResult = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: { name: 'test-file' },
        });

        console.log('✅ Upload successful!');
        console.log('IPFS Hash:', uploadResult.IpfsHash);
        console.log('View at:', `https://gateway.pinata.cloud/ipfs/${uploadResult.IpfsHash}`);

        // Test unpin (cleanup)
        await pinata.unpin(uploadResult.IpfsHash);
        console.log('✅ Cleaned up test file');

    } catch (error) {
        console.error('❌ Pinata test failed:', error.message);
    }
}

testPinata();