import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

const CONTRACT_ABI = [
    'function registerResearch(string ipfsHash, string title) public returns (uint256)',
    'function getResearch(uint256 id) public view returns (string, string, address, uint256)',
    'function researchCount() public view returns (uint256)',
];

async function test() {
    try {
        console.log('🧪 Testing Blockchain...\n');

        // Connect
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            CONTRACT_ABI,
            wallet
        );

        console.log('Wallet:', wallet.address);
        console.log('Contract:', contract.target);

        // Test register
        console.log('\n📝 Registering research...');
        const tx = await contract.registerResearch('QmTestHash123', 'Test Research');
        console.log('TX Hash:', tx.hash);

        const receipt = await tx.wait();
        console.log('✅ Confirmed in block:', receipt.blockNumber);

        // Get count
        const count = await contract.researchCount();
        console.log('\n📊 Total researches:', count.toString());

        // Get research
        const research = await contract.getResearch(count);
        console.log('Latest research:', {
            ipfsHash: research[0],
            title: research[1],
            author: research[2],
            timestamp: new Date(Number(research[3]) * 1000).toISOString(),
        });

        console.log('\n✅ Blockchain works!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

test();