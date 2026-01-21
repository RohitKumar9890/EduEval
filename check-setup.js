#!/usr/bin/env node

/**
 * Quick Setup Checker for EduEval
 * Run with: node check-setup.js
 */

import axios from 'axios';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

console.log('\n🔍 Checking EduEval Setup...\n');

// Check 1: Frontend .env
console.log('1️⃣ Checking Frontend Configuration...');
if (existsSync('./client/.env.local')) {
  const clientEnv = readFileSync('./client/.env.local', 'utf-8');
  if (clientEnv.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ✅ Frontend .env.local exists');
    console.log('   📝 API URL:', clientEnv.match(/NEXT_PUBLIC_API_URL=(.+)/)?.[1] || 'Not found');
  }
} else {
  console.log('   ❌ Frontend .env.local NOT FOUND!');
  console.log('   💡 Run: cp client/.env.local.example client/.env.local');
}

// Check 2: Backend .env
console.log('\n2️⃣ Checking Backend Configuration...');
if (existsSync('./server/.env')) {
  console.log('   ✅ Backend .env exists');
  const serverEnv = readFileSync('./server/.env', 'utf-8');
  console.log('   📝 PORT:', serverEnv.match(/PORT=(.+)/)?.[1] || '5000 (default)');
  console.log('   📝 CORS:', serverEnv.match(/CORS_ORIGIN=(.+)/)?.[1] || 'Not set');
} else {
  console.log('   ❌ Backend .env NOT FOUND!');
  console.log('   💡 Run: cp server/.env.example server/.env');
}

// Check 3: Firebase credentials
console.log('\n3️⃣ Checking Firebase Setup...');
if (existsSync('./server/firebase-service-account.json')) {
  console.log('   ✅ Firebase service account file exists');
} else {
  console.log('   ❌ Firebase service account NOT FOUND!');
  console.log('   💡 Download from Firebase Console and place in server/');
}

// Check 4: Backend Server
console.log('\n4️⃣ Checking Backend Server...');
try {
  const response = await axios.get('http://localhost:5000/api/health', { timeout: 3000 });
  console.log('   ✅ Backend server is RUNNING');
  console.log('   📝 Status:', response.data.status);
  console.log('   📝 Database:', response.data.database || 'connected');
} catch (error) {
  console.log('   ❌ Backend server is NOT RUNNING or not reachable!');
  console.log('   💡 Start it with: cd server && npm run dev');
  console.log('   ⚠️  Error:', error.message);
}

// Check 5: Frontend Server
console.log('\n5️⃣ Checking Frontend Server...');
try {
  await axios.get('http://localhost:3000', { timeout: 3000 });
  console.log('   ✅ Frontend server is RUNNING');
} catch (error) {
  console.log('   ❌ Frontend server is NOT RUNNING or not reachable!');
  console.log('   💡 Start it with: cd client && npm run dev');
}

console.log('\n' + '='.repeat(60));
console.log('📋 SUMMARY');
console.log('='.repeat(60));
console.log('If you see ❌ marks above, follow the 💡 suggestions to fix them.\n');
