/**
 * MONGODB CONNECTION GUIDE
 * 
 * Hướng dẫn cài đặt và kết nối MongoDB
 */

// ============ Option 1: MongoDB Local (Recommended for Development) ============
/**
 * 
 * STEP 1: Install MongoDB Community Edition
 * ============================================
 * 
 * For Windows:
 * 1. Download from: https://www.mongodb.com/try/download/community
 * 2. Run the installer (.msi file)
 * 3. Choose "Complete" installation
 * 4. Keep default settings
 * 5. Finish installation
 * 
 * STEP 2: Start MongoDB Service
 * ==============================
 * 
 * Option A: Using MongoDB Desktop (GUI)
 * - Search for "MongoDB Compass" in Start menu
 * - Open it (this will auto-start MongoDB service)
 * 
 * Option B: Using PowerShell (Command line)
 * - Run as Administrator: 
 *   net start MongoDB
 * 
 * Option C: Using Docker (if you have Docker installed)
 * - docker run -d -p 27017:27017 --name mongodb mongo
 * 
 * STEP 3: Verify Connection
 * ==========================
 * - Run: node test-mongodb.js
 * - You should see: "✅ MongoDB connected successfully!"
 * 
 */

// ============ Option 2: MongoDB Atlas (Cloud) ============
/**
 * 
 * STEP 1: Create Free Tier Cluster
 * =================================
 * 1. Go to: https://www.mongodb.com/cloud/atlas
 * 2. Click "Try Free"
 * 3. Create account or sign in
 * 4. Create new organization
 * 5. Create new project
 * 6. Build a Database → Shared (Free tier)
 * 7. Choose region (nearest to you)
 * 8. Wait for cluster to deploy (5-10 minutes)
 * 
 * STEP 2: Create Database User
 * =============================
 * 1. Go to Database → Security → Database Access
 * 2. Click "Add New Database User"
 * 3. Username: your_username
 * 4. Password: Generate secure password (copy it!)
 * 5. Click "Add User"
 * 
 * STEP 3: Add IP Whitelist
 * ========================
 * 1. Go to Security → Network Access
 * 2. Click "Add IP Address"
 * 3. Choose "Allow access from anywhere" (for development)
 * 4. Click "Confirm"
 * 
 * STEP 4: Get Connection String
 * ==============================
 * 1. Go to Databases → Overview
 * 2. Click "Connect" on your cluster
 * 3. Choose "Drivers" → "Node.js"
 * 4. Copy the connection string (example below)
 * 5. Update .env:
 *    MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forgot-password?retryWrites=true&w=majority
 * 
 * STEP 5: Test Connection
 * =======================
 * - Run: node test-mongodb.js
 * - You should see: "✅ MongoDB connected successfully!"
 * 
 */

// ============ CONNECTION STRING FORMATS ============
/**
 * 
 * Local MongoDB:
 * MONGODB_URI=mongodb://localhost:27017/forgot-password
 * 
 * MongoDB Atlas:
 * MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forgot-password?retryWrites=true&w=majority
 * 
 * Note: Replace:
 * - username: your database user
 * - password: your database password
 * - cluster0.xxxxx: your actual cluster name from Atlas
 * 
 */

// ============ QUICK TEST ============
/**
 * Test your MongoDB connection:
 * 
 * 1. Update .env with your MONGODB_URI
 * 2. Run: node test-mongodb.js
 * 3. Check output
 * 
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDB() {
  console.log('\n🔍 Testing MongoDB Connection...\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forgot-password';
  console.log(`📍 Connection URI: ${mongoUri}\n`);

  try {
    console.log('⏳ Connecting to MongoDB...\n');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully!\n');
    console.log('📊 Connection Details:');
    console.log(`   - Server: ${mongoose.connection.host}`);
    console.log(`   - Port: ${mongoose.connection.port}`);
    console.log(`   - Database: ${mongoose.connection.name}`);
    console.log(`   - State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);

    // Try to access database
    const db = mongoose.connection;
    const collections = await db.listCollections();
    console.log(`📦 Collections in database: ${collections.length || 'None (new database)'}\n`);

    await mongoose.disconnect();
    console.log('✨ Connection closed (test complete)\n');

  } catch (error) {
    console.log('❌ ERROR connecting to MongoDB:\n');
    console.log(error.message + '\n');

    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Hints:');
      console.log('   - Local MongoDB: Make sure mongod service is running');
      console.log('   - Start MongoDB: net start MongoDB (PowerShell as Admin)');
      console.log('   - Or use MongoDB Compass GUI\n');
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 Hints:');
      console.log('   - Check your connection string');
      console.log('   - Atlas users: Verify cluster name and region');
      console.log('   - Check internet connection\n');
    }

    if (error.message.includes('authentication failed')) {
      console.log('💡 Hints:');
      console.log('   - Check username and password in connection string');
      console.log('   - Atlas users: Verify database user credentials');
      console.log('   - Make sure special characters in password are URL-encoded\n');
    }

    process.exit(1);
  }
}

testMongoDB();
