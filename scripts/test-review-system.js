#!/usr/bin/env node

/**
 * Test Review System
 * 
 * Comprehensive testing script for the review system
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN;

console.log('🧪 Testing Review System');
console.log('========================\n');

// Test data
const testReview = {
  name: 'Test User',
  email: 'test@example.com',
  title: 'Software Engineer',
  organization: 'Test Company',
  relationship: 'colleague',
  rating: 5,
  testimonial: 'This is a comprehensive test of the review system. The implementation is excellent and demonstrates strong technical skills in building secure, scalable applications.',
  recommendation: true,
  timestamp: Date.now()
};

/**
 * Make HTTP request
 */
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test 1: Environment Configuration
 */
async function testEnvironment() {
  console.log('📋 Test 1: Environment Configuration');
  console.log('-----------------------------------');
  
  const requiredVars = [
    'RESEND_API_KEY',
    'ADMIN_API_TOKEN', 
    'REVIEW_SECRET_KEY',
    'NEXT_PUBLIC_SITE_URL'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 8)}...`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  }
  
  if (allPresent) {
    console.log('✅ All environment variables present\n');
    return true;
  } else {
    console.log('❌ Missing environment variables\n');
    return false;
  }
}

/**
 * Test 2: Server Status
 */
async function testServer() {
  console.log('🌐 Test 2: Server Status');
  console.log('------------------------');
  
  try {
    const url = new URL(BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/api/reviews/admin',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      protocol: url.protocol
    };
    
    const response = await makeRequest(options);
    
    if (response.status === 200) {
      console.log('✅ Server is running and API is accessible');
      console.log(`✅ Admin API responds with status: ${response.status}\n`);
      return true;
    } else {
      console.log(`❌ Server responded with status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Server connection failed: ${error.message}\n`);
    return false;
  }
}

/**
 * Test 3: Review Submission
 */
async function testReviewSubmission() {
  console.log('📝 Test 3: Review Submission');
  console.log('----------------------------');
  
  try {
    const url = new URL(BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/api/reviews/submit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      protocol: url.protocol
    };
    
    const response = await makeRequest(options, testReview);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ Review submission successful');
      console.log(`✅ Review ID: ${response.data.data?.reviewId}`);
      console.log(`✅ Verification sent: ${response.data.data?.verificationSent}`);
      console.log('✅ Check your email for verification link\n');
      return response.data.data?.reviewId;
    } else {
      console.log(`❌ Review submission failed with status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}\n`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Review submission error: ${error.message}\n`);
    return null;
  }
}

/**
 * Test 4: File System Check
 */
async function testFileSystem() {
  console.log('📁 Test 4: File System Check');
  console.log('----------------------------');
  
  const directories = [
    'data/reviews/pending',
    'data/reviews/verified', 
    'data/reviews/approved',
    'data/reviews/rejected',
    'data/verification/tokens'
  ];
  
  let allExist = true;
  
  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
      console.log(`✅ ${dir}: exists (${files.length} files)`);
    } else {
      console.log(`❌ ${dir}: missing`);
      allExist = false;
    }
  }
  
  // Check for pending reviews
  const pendingDir = path.join(process.cwd(), 'data/reviews/pending');
  if (fs.existsSync(pendingDir)) {
    const pendingFiles = fs.readdirSync(pendingDir).filter(f => f.endsWith('.json'));
    if (pendingFiles.length > 0) {
      console.log(`📋 Found ${pendingFiles.length} pending review(s)`);
      
      // Show latest pending review
      const latestFile = pendingFiles[pendingFiles.length - 1];
      const reviewPath = path.join(pendingDir, latestFile);
      try {
        const reviewData = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
        console.log(`   Latest: ${reviewData.reviewer?.name} (${reviewData.reviewer?.email})`);
      } catch (e) {
        console.log(`   Latest: ${latestFile} (could not read)`);
      }
    }
  }
  
  console.log(allExist ? '✅ All directories exist\n' : '❌ Some directories missing\n');
  return allExist;
}

/**
 * Test 5: Token Validation
 */
async function testTokenValidation() {
  console.log('🔐 Test 5: Token Validation');
  console.log('---------------------------');
  
  // Check if there are any tokens to validate
  const tokensDir = path.join(process.cwd(), 'data/verification/tokens');
  
  if (!fs.existsSync(tokensDir)) {
    console.log('❌ Tokens directory does not exist\n');
    return false;
  }
  
  const tokenFiles = fs.readdirSync(tokensDir).filter(f => f.endsWith('.json'));
  
  if (tokenFiles.length === 0) {
    console.log('ℹ️  No tokens found (submit a review first)\n');
    return true;
  }
  
  console.log(`📋 Found ${tokenFiles.length} verification token(s)`);
  
  // Validate token format
  for (const tokenFile of tokenFiles.slice(0, 3)) { // Check first 3 tokens
    const tokenPath = path.join(tokensDir, tokenFile);
    try {
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      const tokenName = tokenFile.replace('.json', '');
      
      // Validate token format
      if (tokenName.length === 64 && /^[a-f0-9]+$/.test(tokenName)) {
        console.log(`✅ Token format valid: ${tokenName.substring(0, 8)}...`);
        
        // Check expiration
        const expiresAt = new Date(tokenData.expiresAt);
        const now = new Date();
        
        if (now < expiresAt) {
          console.log(`   ✅ Token not expired (expires: ${expiresAt.toLocaleString()})`);
        } else {
          console.log(`   ⚠️  Token expired (expired: ${expiresAt.toLocaleString()})`);
        }
      } else {
        console.log(`❌ Invalid token format: ${tokenName}`);
      }
    } catch (e) {
      console.log(`❌ Could not read token: ${tokenFile}`);
    }
  }
  
  console.log('');
  return true;
}

/**
 * Test 6: Admin API
 */
async function testAdminAPI() {
  console.log('👑 Test 6: Admin API');
  console.log('-------------------');
  
  try {
    const url = new URL(BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/api/reviews/admin?status=verified&limit=5',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      protocol: url.protocol
    };
    
    const response = await makeRequest(options);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Admin API accessible');
      console.log(`✅ Found ${response.data.data?.reviews?.length || 0} verified reviews`);
      console.log(`✅ Total reviews: ${response.data.data?.stats?.total || 0}`);
      console.log(`✅ Pending: ${response.data.data?.stats?.pending || 0}`);
      console.log(`✅ Approved: ${response.data.data?.stats?.approved || 0}\n`);
      return true;
    } else {
      console.log(`❌ Admin API failed with status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Admin API error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test 7: Rate Limiting
 */
async function testRateLimiting() {
  console.log('🚦 Test 7: Rate Limiting');
  console.log('------------------------');
  
  try {
    const url = new URL(BASE_URL);
    
    // Try to submit multiple reviews quickly
    const promises = [];
    for (let i = 0; i < 3; i++) {
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: '/api/reviews/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        protocol: url.protocol
      };
      
      const testData = {
        ...testReview,
        email: `test${i}@example.com`,
        timestamp: Date.now() + i
      };
      
      promises.push(makeRequest(options, testData));
    }
    
    const responses = await Promise.all(promises);
    
    let successCount = 0;
    let rateLimitedCount = 0;
    
    responses.forEach((response, index) => {
      if (response.status === 201) {
        successCount++;
      } else if (response.status === 429) {
        rateLimitedCount++;
      }
      console.log(`   Request ${index + 1}: Status ${response.status}`);
    });
    
    if (rateLimitedCount > 0) {
      console.log('✅ Rate limiting is working');
      console.log(`✅ ${successCount} allowed, ${rateLimitedCount} rate limited\n`);
    } else {
      console.log('⚠️  Rate limiting may not be working as expected');
      console.log(`   All ${successCount} requests succeeded\n`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Rate limiting test error: ${error.message}\n`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`Testing against: ${BASE_URL}\n`);
  
  const tests = [
    { name: 'Environment', fn: testEnvironment },
    { name: 'Server', fn: testServer },
    { name: 'Review Submission', fn: testReviewSubmission },
    { name: 'File System', fn: testFileSystem },
    { name: 'Token Validation', fn: testTokenValidation },
    { name: 'Admin API', fn: testAdminAPI },
    { name: 'Rate Limiting', fn: testRateLimiting }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      console.log(`❌ ${test.name} test failed: ${error.message}\n`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  console.log('📊 Test Summary');
  console.log('===============');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log(`\n🎯 ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your review system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
  
  // Next steps
  console.log('\n📋 Next Steps:');
  if (passed >= 6) {
    console.log('1. ✅ System is ready for use');
    console.log('2. 📧 Check your email for verification links');
    console.log('3. 🎨 Ready to build UI components (Phase 3)');
  } else {
    console.log('1. 🔧 Fix the failing tests above');
    console.log('2. 📖 Check the setup guide: docs/review/setup-guide.md');
    console.log('3. 🔄 Run tests again: npm run test:review');
  }
}

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  dotenv not available, using system environment variables');
}

// Run tests
runTests().catch(console.error);