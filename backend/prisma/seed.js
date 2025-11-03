// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...\n');

    // ==========================================
    // 1. TẠO USERS
    // ==========================================

    console.log('👤 Creating users...');

    // User 1: Đã có (quang2004)
    const user1Id = '3db23194-f1ef-455f-b6c1-af588c7d1a22';
    console.log('✅ User 1: quang2004 (already exists)');

    // User 2: Alice (Researcher in AI)
    const passwordHash2 = await bcrypt.hash('alice123', 10);
    const user2 = await prisma.user.upsert({
        where: { email: 'alice.nguyen@research.edu' },
        update: {},
        create: {
            email: 'alice.nguyen@research.edu',
            username: 'alice_ai',
            passwordHash: passwordHash2,
        },
    });
    console.log('✅ User 2: alice_ai');

    // User 3: Bob (Researcher in Blockchain)
    const passwordHash3 = await bcrypt.hash('bob123', 10);
    const user3 = await prisma.user.upsert({
        where: { email: 'bob.tran@blockchain.org' },
        update: {},
        create: {
            email: 'bob.tran@blockchain.org',
            username: 'bob_blockchain',
            passwordHash: passwordHash3,
        },
    });
    console.log('✅ User 3: bob_blockchain\n');

    // ==========================================
    // 2. TẠO RESEARCHES
    // ==========================================

    console.log('📄 Creating researches...');

    // Research 1: Của quang2004 (Public)
    const research1 = await prisma.research.create({
        data: {
            title: 'Introduction to Blockchain Technology',
            description: 'A comprehensive guide to understanding blockchain fundamentals, including consensus mechanisms, smart contracts, and decentralized applications.',
            ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', // Fake IPFS hash
            encryptedKey: 'encrypted_key_blockchain_intro_quang',
            authorId: user1Id,
            category: 'Computer Science',
            tags: ['blockchain', 'cryptocurrency', 'distributed-systems'],
            isPublic: true,
        },
    });
    console.log('✅ Research 1: Blockchain Technology (quang2004) - PUBLIC');

    // Research 2: Của quang2004 (Private)
    const research2 = await prisma.research.create({
        data: {
            title: 'Advanced Cryptography Techniques',
            description: 'Research paper on modern cryptographic algorithms including Zero-Knowledge Proofs and Homomorphic Encryption.',
            ipfsHash: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX',
            encryptedKey: 'encrypted_key_crypto_advanced_quang',
            authorId: user1Id,
            category: 'Computer Science',
            tags: ['cryptography', 'security', 'zkp'],
            isPublic: false,
        },
    });
    console.log('✅ Research 2: Cryptography (quang2004) - PRIVATE');

    // Research 3: Của alice_ai (Public)
    const research3 = await prisma.research.create({
        data: {
            title: 'Machine Learning for Natural Language Processing',
            description: 'Exploring transformer models and their applications in NLP tasks such as translation, summarization, and sentiment analysis.',
            ipfsHash: 'QmRG3wVgLnm7qXPQKqKQh3Kt3YsPc3qHQiLm5VKH8rEqKU',
            encryptedKey: 'encrypted_key_ml_nlp_alice',
            authorId: user2.id,
            category: 'Computer Science',
            tags: ['machine-learning', 'nlp', 'transformers', 'ai'],
            isPublic: true,
        },
    });
    console.log('✅ Research 3: ML for NLP (alice_ai) - PUBLIC');

    // Research 4: Của alice_ai (Private)
    const research4 = await prisma.research.create({
        data: {
            title: 'Deep Reinforcement Learning in Robotics',
            description: 'Novel approaches to training robotic systems using deep Q-networks and policy gradient methods.',
            ipfsHash: 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
            encryptedKey: 'encrypted_key_drl_robotics_alice',
            authorId: user2.id,
            category: 'Engineering',
            tags: ['robotics', 'reinforcement-learning', 'deep-learning'],
            isPublic: false,
        },
    });
    console.log('✅ Research 4: DRL Robotics (alice_ai) - PRIVATE');

    // Research 5: Của bob_blockchain (Public)
    const research5 = await prisma.research.create({
        data: {
            title: 'Decentralized Finance (DeFi) Protocols Analysis',
            description: 'Comprehensive analysis of popular DeFi protocols including Uniswap, Aave, and Compound, focusing on security and efficiency.',
            ipfsHash: 'QmZULkCELmmk5XNfCgzjCCHTLFFuVjvpQhQcuWJQ1Np6PE',
            encryptedKey: 'encrypted_key_defi_analysis_bob',
            authorId: user3.id,
            category: 'Computer Science',
            tags: ['defi', 'blockchain', 'smart-contracts', 'ethereum'],
            isPublic: true,
        },
    });
    console.log('✅ Research 5: DeFi Analysis (bob_blockchain) - PUBLIC\n');

    // ==========================================
    // 3. TẠO ACCESS GRANTS
    // ==========================================

    console.log('🔑 Creating access grants...');

    // Grant 1: alice_ai được quyền xem research2 của quang2004
    const grant1 = await prisma.accessGrant.create({
        data: {
            researchId: research2.id,
            userId: user2.id,
            decryptionKey: 'decryption_key_for_alice_research2',
        },
    });
    console.log('✅ Grant 1: alice_ai can access "Cryptography" (quang2004)');

    // Grant 2: bob_blockchain được quyền xem research2 của quang2004
    const grant2 = await prisma.accessGrant.create({
        data: {
            researchId: research2.id,
            userId: user3.id,
            decryptionKey: 'decryption_key_for_bob_research2',
        },
    });
    console.log('✅ Grant 2: bob_blockchain can access "Cryptography" (quang2004)');

    // Grant 3: quang2004 được quyền xem research4 của alice_ai
    const grant3 = await prisma.accessGrant.create({
        data: {
            researchId: research4.id,
            userId: user1Id,
            decryptionKey: 'decryption_key_for_quang_research4',
        },
    });
    console.log('✅ Grant 3: quang2004 can access "DRL Robotics" (alice_ai)');

    // Grant 4: bob_blockchain được quyền xem research4 của alice_ai
    const grant4 = await prisma.accessGrant.create({
        data: {
            researchId: research4.id,
            userId: user3.id,
            decryptionKey: 'decryption_key_for_bob_research4',
        },
    });
    console.log('✅ Grant 4: bob_blockchain can access "DRL Robotics" (alice_ai)\n');

    // ==========================================
    // 4. TẠO TRANSACTIONS (Optional)
    // ==========================================

    console.log('📜 Creating transactions...');

    const tx1 = await prisma.transaction.create({
        data: {
            researchId: research1.id,
            txType: 'UPLOAD',
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            metadata: {
                blockNumber: 12345678,
                timestamp: Date.now(),
            },
        },
    });
    console.log('✅ Transaction 1: Upload research1');

    const tx2 = await prisma.transaction.create({
        data: {
            researchId: research2.id,
            txType: 'UPLOAD',
            txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
    });
    console.log('✅ Transaction 2: Upload research2');

    const tx3 = await prisma.transaction.create({
        data: {
            researchId: research2.id,
            txType: 'GRANT_ACCESS',
            metadata: {
                grantedTo: 'alice_ai',
                timestamp: Date.now(),
            },
        },
    });
    console.log('✅ Transaction 3: Grant access to alice_ai\n');

    // ==========================================
    // SUMMARY
    // ==========================================

    console.log('═══════════════════════════════════════');
    console.log('🎉 Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  • Users: 3 (quang2004, alice_ai, bob_blockchain)');
    console.log('  • Researches: 5 (2 public, 3 private)');
    console.log('  • Access Grants: 4');
    console.log('  • Transactions: 3');
    console.log('═══════════════════════════════════════\n');

    console.log('🔐 Login credentials:');
    console.log('  1. quang2004 / (your password)');
    console.log('  2. alice_ai / alice123');
    console.log('  3. bob_blockchain / bob123');
    console.log('═══════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });