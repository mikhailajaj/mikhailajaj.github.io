#!/usr/bin/env node

/**
 * Generate Secure Tokens for Review System
 * 
 * This script generates cryptographically secure tokens for the review system
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating secure tokens for Review System...\n');

// Generate tokens
const adminToken = crypto.randomBytes(32).toString('hex');
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Generated tokens:');
console.log('================');
console.log(`ADMIN_API_TOKEN=${adminToken}`);
console.log(`REVIEW_SECRET_KEY=${secretKey}`);
console.log('');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  // Copy from .env.example if it exists
  if (fs.existsSync(envExamplePath)) {
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Replace placeholder tokens
    envContent = envContent.replace(
      'ADMIN_API_TOKEN=admin-dev-token-change-in-production',
      `ADMIN_API_TOKEN=${adminToken}`
    );
    envContent = envContent.replace(
      'REVIEW_SECRET_KEY=your-secret-key-for-tokens-32-chars-min',
      `REVIEW_SECRET_KEY=${secretKey}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local created with secure tokens!');
  } else {
    // Create minimal .env.local
    const minimalEnv = `# Review System Environment Configuration
# Generated on ${new Date().toISOString()}

# Email Service (Resend) - Get your API key from resend.com
RESEND_API_KEY=your_resend_api_key_here

# Review System Configuration
REVIEW_FROM_EMAIL=noreply@resend.dev
REVIEW_REPLY_TO_EMAIL=mikhailajaj@gmail.com
REVIEW_ADMIN_EMAIL=mikhailajaj@gmail.com

# Security Configuration (Generated)
ADMIN_API_TOKEN=${adminToken}
REVIEW_SECRET_KEY=${secretKey}

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mikhailajaj.github.io

# Development Configuration
NODE_ENV=development
`;
    
    fs.writeFileSync(envPath, minimalEnv);
    console.log('✅ .env.local created with secure tokens!');
  }
} else {
  console.log('⚠️  .env.local already exists.');
  console.log('   Please manually update the tokens in your .env.local file.');
}

console.log('\n🔒 Security Notes:');
console.log('- Keep these tokens secret and secure');
console.log('- Never commit .env.local to version control');
console.log('- Rotate tokens every 6 months for security');
console.log('- Use different tokens for development and production');

console.log('\n📋 Next Steps:');
console.log('1. Add your Resend API key to .env.local');
console.log('2. Test the system with: npm run dev');
console.log('3. Verify email functionality');

console.log('\n🚀 Ready to go!');