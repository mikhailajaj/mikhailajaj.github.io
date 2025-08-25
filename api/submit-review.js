// Simple Serverless Function for Review Submission
// This can be deployed to Vercel, Netlify, or similar platforms

const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory storage (for demo - use a database in production)
const reviews = new Map();

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://mikhailajaj.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Basic validation
    if (!data.name || !data.email || !data.testimonial || !data.rating) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, testimonial, and rating are required'
      });
    }

    // Check honeypot
    if (data.honeypot && data.honeypot.trim() !== '') {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Generate review ID
    const reviewId = 'review-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Store review (in production, use a proper database)
    const review = {
      id: reviewId,
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      verified: false
    };
    
    reviews.set(reviewId, review);

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@resend.dev',
        to: process.env.ADMIN_EMAIL || 'mikhailajaj@gmail.com',
        subject: `New testimonial from ${data.name}`,
        html: `
          <h2>New Testimonial Submission</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Rating:</strong> ${data.rating}/5 stars</p>
          <p><strong>Relationship:</strong> ${data.relationship}</p>
          ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
          
          <h3>Testimonial:</h3>
          <blockquote style="border-left: 3px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666;">
            ${data.testimonial}
          </blockquote>
          
          <p><strong>Recommendation:</strong> ${data.recommendation ? 'Yes' : 'No'}</p>
          
          <hr>
          <p><small>Review ID: ${reviewId}</small></p>
        `
      });

      // Send confirmation email to user
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@resend.dev',
        to: data.email,
        replyTo: process.env.REPLY_TO_EMAIL || 'mikhailajaj@gmail.com',
        subject: 'Thank you for your testimonial!',
        html: `
          <h2>Thank you, ${data.name}!</h2>
          <p>We've received your testimonial and appreciate you taking the time to share your experience.</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #28a745;">Your Testimonial</h3>
            <p style="margin: 0; font-style: italic;">"${data.testimonial}"</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
              Rating: ${data.rating}/5 stars
            </p>
          </div>
          
          <p>Your testimonial will be reviewed and may be featured on the website. If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>Mikhail Ajaj</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">Reference ID: ${reviewId}</p>
        `
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the entire request if email fails
    }

    return res.status(200).json({
      success: true,
      reviewId,
      message: 'Thank you for your testimonial! You should receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.'
    });
  }
}