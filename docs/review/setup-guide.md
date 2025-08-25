# Review System Setup Guide

## 🚀 Quick Setup for GitHub Pages & Gmail

This guide will help you set up the review system for your GitHub Pages portfolio using your Gmail address.

---

## 📋 Prerequisites

1. **GitHub Pages**: Your portfolio is hosted at `https://mikhailajaj.github.io`
2. **Gmail Account**: Using `mikhailajaj@gmail.com` for notifications
3. **Resend Account**: Free email service (3,000 emails/month)

---

## 🔧 Environment Configuration

### Step 1: Create Environment File

Copy the example environment file:
```bash
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Update `.env.local` with your settings:

```bash
# Email Service (Resend) - Get your API key from resend.com
RESEND_API_KEY=re_your_actual_resend_api_key_here

# Review System Configuration
REVIEW_FROM_EMAIL=noreply@resend.dev
REVIEW_REPLY_TO_EMAIL=mikhailajaj@gmail.com
REVIEW_ADMIN_EMAIL=mikhailajaj@gmail.com

# Security Configuration
ADMIN_API_TOKEN=your-secure-random-token-here
REVIEW_SECRET_KEY=your-32-character-secret-key-for-tokens

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mikhailajaj.github.io

# Development Configuration
NODE_ENV=production
```

---

## 📧 Email Service Setup (Resend)

### Why Resend?
- **Free Tier**: 3,000 emails/month, 100/day
- **No Custom Domain Required**: Can use `noreply@resend.dev`
- **Professional Delivery**: High deliverability rates
- **Simple Setup**: Just need an API key

### Setup Steps:

1. **Sign up at [resend.com](https://resend.com)**
2. **Create API Key**:
   - Go to API Keys section
   - Click "Create API Key"
   - Name it "Review System"
   - Copy the key (starts with `re_`)
3. **Add to Environment**:
   ```bash
   RESEND_API_KEY=re_your_actual_key_here
   ```

### Email Configuration Explained:

```bash
# From Address: Uses Resend's default domain (no setup required)
REVIEW_FROM_EMAIL=noreply@resend.dev

# Reply-To: Your Gmail address (where replies go)
REVIEW_REPLY_TO_EMAIL=mikhailajaj@gmail.com

# Admin Email: Where admin notifications are sent
REVIEW_ADMIN_EMAIL=mikhailajaj@gmail.com
```

---

## 🔐 Security Configuration

### Generate Secure Tokens:

```bash
# Generate a secure admin token (32+ characters)
ADMIN_API_TOKEN=$(openssl rand -hex 32)

# Generate a secret key for token encryption (32+ characters)
REVIEW_SECRET_KEY=$(openssl rand -hex 32)
```

Or use online generators:
- [Random.org](https://www.random.org/strings/)
- [LastPass Password Generator](https://www.lastpass.com/password-generator)

### Security Best Practices:

1. **Never commit `.env.local`** to Git (already in .gitignore)
2. **Use different tokens** for development and production
3. **Rotate tokens** periodically (every 6 months)
4. **Keep tokens secure** - treat them like passwords

---

## 🌐 GitHub Pages Configuration

### Current Setup:
- **Domain**: `https://mikhailajaj.github.io`
- **Deployment**: Automatic via GitHub Actions
- **SSL**: Provided by GitHub Pages

### Environment Variables for GitHub Pages:

If deploying to GitHub Pages with Actions, add these as **Repository Secrets**:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add these secrets:
   - `RESEND_API_KEY`
   - `ADMIN_API_TOKEN`
   - `REVIEW_SECRET_KEY`

---

## 📁 File Structure Check

Ensure these directories exist (they should be created automatically):

```
data/
├── reviews/
│   ├── pending/
│   ├── verified/
│   ├── approved/
│   ├── rejected/
│   └── archived/
├── verification/
│   └── tokens/
└── audit/
```

---

## 🧪 Testing the Setup

### 1. Test Email Service

Create a simple test script or use the API directly:

```bash
# Test if Resend API key works
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_RESEND_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@resend.dev",
    "to": "mikhailajaj@gmail.com",
    "subject": "Test Email",
    "text": "This is a test email from your review system."
  }'
```

### 2. Test Review Submission

```bash
# Test review submission API
curl -X POST 'http://localhost:3000/api/reviews/submit' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "relationship": "colleague",
    "rating": 5,
    "testimonial": "This is a test review to verify the system is working correctly.",
    "recommendation": true,
    "timestamp": '$(date +%s000)'
  }'
```

### 3. Check Email Delivery

- Check your Gmail inbox for test emails
- Verify email templates look professional
- Test verification links work correctly

---

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Email Not Sending**
```bash
# Check Resend API key
echo $RESEND_API_KEY

# Check logs
tail -f data/audit/emails.log
```

#### 2. **Environment Variables Not Loading**
```bash
# Verify .env.local exists and has correct format
cat .env.local

# Restart development server
npm run dev
```

#### 3. **Rate Limiting Issues**
```bash
# Check rate limit files
ls -la data/rate-limits/

# Clear rate limits (development only)
rm -rf data/rate-limits/*
```

#### 4. **Token Validation Errors**
```bash
# Check token directory
ls -la data/verification/tokens/

# Check token format in logs
tail -f data/audit/tokens.log
```

---

## 📊 Monitoring & Maintenance

### Log Files to Monitor:

```bash
# Email sending logs
tail -f data/audit/emails.log

# Review submissions
tail -f data/audit/submissions.log

# Security events
tail -f data/audit/spam-analysis.log

# Admin actions
tail -f data/audit/admin-actions.log
```

### Regular Maintenance:

1. **Weekly**: Check email delivery rates
2. **Monthly**: Review spam detection accuracy
3. **Quarterly**: Rotate security tokens
4. **As needed**: Clean up old log files

---

## 🎯 Production Deployment

### For GitHub Pages:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test production build**:
   ```bash
   npm run start
   ```

3. **Deploy via GitHub Actions** (automatic)

### Environment Variables in Production:

Make sure these are set in your deployment environment:
- `RESEND_API_KEY`
- `ADMIN_API_TOKEN`
- `REVIEW_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL=https://mikhailajaj.github.io`

---

## ✅ Setup Checklist

- [ ] Resend account created and API key obtained
- [ ] `.env.local` file created with all required variables
- [ ] Security tokens generated (32+ characters each)
- [ ] Email service tested and working
- [ ] Review submission API tested
- [ ] Email templates verified in Gmail
- [ ] Rate limiting tested
- [ ] File permissions correct for data directories
- [ ] Production environment variables configured
- [ ] Monitoring logs set up

---

## 🆘 Support

If you encounter issues:

1. **Check the logs** in `data/audit/` directory
2. **Verify environment variables** are set correctly
3. **Test email service** independently
4. **Review GitHub Pages deployment** logs
5. **Check Resend dashboard** for delivery status

**Contact**: For system-specific issues, check the audit logs first, then review the API responses for detailed error messages.