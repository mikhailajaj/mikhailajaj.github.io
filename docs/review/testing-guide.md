# Review System Testing Guide

## 🧪 How to Test Your Review System

This guide will help you test every component of the review system to ensure it's working correctly.

---

## 🚀 Quick Start Testing

### Step 1: Generate Tokens (if not done)
```bash
npm run setup:tokens
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Run Automated Tests
```bash
npm run test:review
```

This will run a comprehensive test suite that checks:
- ✅ Environment configuration
- ✅ Server connectivity
- ✅ Review submission process
- ✅ File system operations
- ✅ Token validation
- ✅ Admin API functionality
- ✅ Rate limiting

---

## 📋 Manual Testing Steps

### 1. Environment Setup Test

**Check your `.env.local` file contains:**
```bash
RESEND_API_KEY=re_your_actual_key
ADMIN_API_TOKEN=64_character_hex_string
REVIEW_SECRET_KEY=64_character_hex_string
NEXT_PUBLIC_SITE_URL=https://mikhailajaj.github.io
```

**Verify with:**
```bash
# Check if environment variables are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');"
```

### 2. Server Status Test

**Start the server:**
```bash
npm run dev
```

**Check server is running:**
- Open browser to `http://localhost:3000`
- Should see your portfolio site
- No console errors

### 3. API Endpoints Test

**Test Admin API:**
```bash
curl -X GET "http://localhost:3000/api/reviews/admin" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [],
    "pagination": {...},
    "stats": {...}
  }
}
```

### 4. Review Submission Test

**Submit a test review:**
```bash
curl -X POST "http://localhost:3000/api/reviews/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "relationship": "colleague",
    "rating": 5,
    "testimonial": "This is a test review to verify the system works correctly.",
    "recommendation": true,
    "timestamp": '$(date +%s000)'
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully!",
  "data": {
    "reviewId": "uuid-string",
    "verificationSent": true,
    "estimatedApprovalTime": "2-3 business days"
  }
}
```

### 5. File System Test

**Check directories were created:**
```bash
ls -la data/reviews/
ls -la data/verification/tokens/
```

**Should see:**
```
data/reviews/pending/     # Contains submitted reviews
data/verification/tokens/ # Contains verification tokens
data/audit/              # Contains log files
```

### 6. Email System Test (Requires Resend API Key)

**Test email sending:**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_RESEND_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@resend.dev",
    "to": "mikhailajaj@gmail.com",
    "subject": "Test Email - Review System",
    "text": "This is a test email to verify Resend integration works."
  }'
```

**Check your Gmail for the test email.**

### 7. Token Verification Test

**Find a verification token:**
```bash
ls data/verification/tokens/
```

**Test verification (replace TOKEN with actual token):**
```bash
curl -X GET "http://localhost:3000/api/reviews/verify?token=TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "reviewId": "uuid-string",
    "verified": true,
    "status": "verified"
  }
}
```

### 8. Admin Actions Test

**Approve a verified review:**
```bash
curl -X POST "http://localhost:3000/api/reviews/admin" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewId": "your-review-id",
    "action": "approve",
    "notes": "Test approval"
  }'
```

### 9. Rate Limiting Test

**Submit multiple reviews quickly:**
```bash
for i in {1..3}; do
  curl -X POST "http://localhost:3000/api/reviews/submit" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test User $i\",
      \"email\": \"test$i@example.com\",
      \"relationship\": \"colleague\",
      \"rating\": 5,
      \"testimonial\": \"Test review $i\",
      \"recommendation\": true,
      \"timestamp\": $(date +%s000)
    }"
  echo ""
done
```

**Should see rate limiting after first request.**

---

## 🔍 Debugging Common Issues

### Issue 1: "RESEND_API_KEY not found"

**Solution:**
1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Add to `.env.local`: `RESEND_API_KEY=re_your_key`

### Issue 2: "Server not responding"

**Check:**
```bash
# Is the server running?
lsof -i :3000

# Check for errors
npm run dev
```

### Issue 3: "Admin API unauthorized"

**Check:**
```bash
# Verify admin token is set
echo $ADMIN_API_TOKEN

# Or check .env.local file
grep ADMIN_API_TOKEN .env.local
```

### Issue 4: "Files not being created"

**Check permissions:**
```bash
# Check if data directory is writable
ls -la data/
mkdir -p data/test && rmdir data/test
```

### Issue 5: "Email not sending"

**Debug steps:**
1. Test Resend API key directly (see step 6 above)
2. Check email logs: `tail -f data/audit/emails.log`
3. Verify email limits: Check Resend dashboard

---

## 📊 Test Results Interpretation

### ✅ All Tests Pass
- System is fully operational
- Ready for production use
- Can proceed to Phase 3 (UI components)

### ⚠️ Some Tests Fail
- **Environment issues**: Check `.env.local` configuration
- **Server issues**: Verify Next.js is running correctly
- **API issues**: Check network connectivity and tokens
- **File system issues**: Check permissions and disk space

### ❌ Many Tests Fail
- **Setup incomplete**: Run `npm run setup:tokens` first
- **Dependencies missing**: Run `npm install`
- **Configuration errors**: Review setup guide

---

## 🎯 Performance Benchmarks

### Expected Performance:
- **API Response Time**: < 200ms
- **Email Sending**: < 2 seconds
- **File Operations**: < 50ms
- **Token Validation**: < 10ms

### Load Testing:
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET "http://localhost:3000/api/reviews/admin" \
    -H "Authorization: Bearer $ADMIN_API_TOKEN" &
done
wait
```

---

## 📝 Test Checklist

Before moving to Phase 3, ensure:

- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] Review submission works
- [ ] Email verification works (if Resend configured)
- [ ] Admin API accessible
- [ ] File system operations work
- [ ] Rate limiting functions
- [ ] Tokens validate correctly
- [ ] Audit logs are created
- [ ] No security vulnerabilities

---

## 🆘 Getting Help

If tests fail:

1. **Run automated tests**: `npm run test:review`
2. **Check logs**: `tail -f data/audit/*.log`
3. **Verify setup**: Review `docs/review/setup-guide.md`
4. **Test individual components**: Use manual tests above
5. **Check environment**: Ensure all variables are set

**Common Solutions:**
- Restart development server: `npm run dev`
- Clear rate limits: `rm -rf data/rate-limits/*`
- Reset tokens: `npm run setup:tokens`
- Check file permissions: `ls -la data/`