#!/usr/bin/env node

/**
 * JWT Secret Generator for EduEval Deployment
 * 
 * Run this script to generate secure random secrets for your JWT configuration
 * Usage: node generate-jwt-secrets.js
 */

import crypto from 'crypto';

console.log('\n🔐 JWT Secret Generator for EduEval\n');
console.log('=' .repeat(70));
console.log('\nCopy these values to your Render environment variables:\n');

const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_SECRET=');
console.log(jwtSecret);
console.log('\nJWT_REFRESH_SECRET=');
console.log(jwtRefreshSecret);

console.log('\n' + '='.repeat(70));
console.log('\n✅ Secrets generated successfully!');
console.log('\n⚠️  IMPORTANT: Keep these secrets secure and never commit them to Git!\n');
