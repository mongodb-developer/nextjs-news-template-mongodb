#!/usr/bin/env node

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'better-auth';

async function setupIndexes() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();

    const db = client.db(MONGODB_DB);
    const postsCollection = db.collection('posts');

    console.log(`📊 Setting up indexes for database: ${MONGODB_DB}`);

    // Get existing indexes
    const existingIndexes = await postsCollection.indexes();
    const existingIndexNames = existingIndexes.map(index => index.name);

    console.log('📋 Existing indexes:', existingIndexNames);

    // Index 1: Compound index for sorting posts by points (desc) and submittedAt (desc)
    const sortIndexName = 'points_-1_submittedAt_-1';
    if (!existingIndexNames.includes(sortIndexName)) {
      console.log('⚡ Creating compound sort index: { points: -1, submittedAt: -1 }');
      await postsCollection.createIndex(
        { points: -1, submittedAt: -1 },
        {
          name: sortIndexName,
          background: true
        }
      );
      console.log('✅ Compound sort index created successfully');
    } else {
      console.log('ℹ️  Compound sort index already exists');
    }

    // Index 2: Unique index on URL to prevent duplicates
    const urlIndexName = 'url_1_unique';
    if (!existingIndexNames.includes(urlIndexName)) {
      console.log('🔗 Creating unique URL index: { url: 1 }');
      await postsCollection.createIndex(
        { url: 1 },
        {
          name: urlIndexName,
          unique: true,
          background: true
        }
      );
      console.log('✅ Unique URL index created successfully');
    } else {
      console.log('ℹ️  Unique URL index already exists');
    }

    // Verify all indexes
    const finalIndexes = await postsCollection.indexes();
    console.log('\n📊 Final index summary:');
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n🎉 Database indexes setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up indexes:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the setup
setupIndexes().catch(console.error);