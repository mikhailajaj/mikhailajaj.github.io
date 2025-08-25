/**
 * Advanced Anti-Spam Security Measures
 * 
 * Enhanced spam detection and prevention for review submissions
 */

import { promises as fs } from 'fs';
import path from 'path';
import { validateTrustedDomain } from '@/lib/validation/review';
import type { ReviewSubmissionData } from '@/lib/types/review';

/**
 * Spam Detection Configuration
 */
const SPAM_CONFIG = {
  // Content analysis thresholds
  maxRepeatedChars: 5,
  maxRepeatedWords: 3,
  minUniqueWords: 10,
  maxUrlCount: 2,
  
  // Behavioral analysis
  minSubmissionTime: 30, // seconds (too fast = bot)
  maxSubmissionTime: 30 * 60, // 30 minutes (too slow = suspicious)
  
  // Pattern detection
  suspiciousPatterns: [
    /(.)\1{5,}/g,                    // Repeated characters
    /\b(\w+)\s+\1\b/gi,             // Repeated words
    /https?:\/\/[^\s]+/gi,          // URLs
    /\$\d+|\d+\$|money|pay|buy/gi,  // Commercial terms
    /click|visit|download|free/gi,   // Spam keywords
    /viagra|casino|lottery|winner/gi, // Common spam words
    /[A-Z]{10,}/g,                   // Excessive caps
    /[!]{3,}|[?]{3,}/g,             // Excessive punctuation
  ],
  
  // Email analysis
  disposableEmailDomains: [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org'
  ],
  
  // IP reputation
  suspiciousIpRanges: [
    // Add known VPN/proxy ranges if needed
  ],
  
  // Scoring thresholds
  spamThreshold: 70,    // 0-100 scale
  suspiciousThreshold: 40,
  
  // Machine learning features (simple implementation)
  featureWeights: {
    contentQuality: 0.3,
    emailReputation: 0.25,
    behavioralAnalysis: 0.2,
    domainTrust: 0.15,
    ipReputation: 0.1
  }
};

/**
 * Spam Analysis Result
 */
export interface SpamAnalysisResult {
  isSpam: boolean;
  isSuspicious: boolean;
  score: number; // 0-100, higher = more likely spam
  reasons: string[];
  features: {
    contentQuality: number;
    emailReputation: number;
    behavioralAnalysis: number;
    domainTrust: number;
    ipReputation: number;
  };
  recommendation: 'allow' | 'review' | 'block';
}

/**
 * Submission Context for Analysis
 */
export interface SubmissionContext {
  submissionData: ReviewSubmissionData;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
  submissionTime?: number; // Time spent on form
  referrer?: string;
}

/**
 * Anti-Spam Analyzer Class
 */
export class AntiSpamAnalyzer {
  private static instance: AntiSpamAnalyzer;
  private spamHistoryPath: string;

  private constructor() {
    this.spamHistoryPath = path.join(process.cwd(), 'data', 'spam-history.json');
  }

  public static getInstance(): AntiSpamAnalyzer {
    if (!AntiSpamAnalyzer.instance) {
      AntiSpamAnalyzer.instance = new AntiSpamAnalyzer();
    }
    return AntiSpamAnalyzer.instance;
  }

  /**
   * Analyze submission for spam indicators
   */
  async analyzeSubmission(context: SubmissionContext): Promise<SpamAnalysisResult> {
    const features = {
      contentQuality: await this.analyzeContentQuality(context.submissionData),
      emailReputation: await this.analyzeEmailReputation(context.submissionData.email),
      behavioralAnalysis: this.analyzeBehavior(context),
      domainTrust: this.analyzeDomainTrust(context.submissionData.email),
      ipReputation: await this.analyzeIpReputation(context.ipAddress)
    };

    // Calculate weighted score
    const score = Object.entries(features).reduce((total, [key, value]) => {
      const weight = SPAM_CONFIG.featureWeights[key as keyof typeof SPAM_CONFIG.featureWeights];
      return total + (value * weight);
    }, 0);

    const isSpam = score >= SPAM_CONFIG.spamThreshold;
    const isSuspicious = score >= SPAM_CONFIG.suspiciousThreshold;

    const reasons = this.generateReasons(features, context);
    
    let recommendation: 'allow' | 'review' | 'block' = 'allow';
    if (isSpam) {
      recommendation = 'block';
    } else if (isSuspicious) {
      recommendation = 'review';
    }

    const result: SpamAnalysisResult = {
      isSpam,
      isSuspicious,
      score,
      reasons,
      features,
      recommendation
    };

    // Log analysis for learning
    await this.logSpamAnalysis(context, result);

    return result;
  }

  /**
   * Analyze content quality
   */
  private async analyzeContentQuality(data: ReviewSubmissionData): Promise<number> {
    let score = 0;
    const testimonial = data.testimonial.toLowerCase();

    // Check for repeated characters
    const repeatedChars = testimonial.match(/(.)\1{5,}/g);
    if (repeatedChars && repeatedChars.length > 0) {
      score += 30;
    }

    // Check for repeated words
    const words = testimonial.split(/\s+/);
    const wordCounts = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });

    const repeatedWords = Array.from(wordCounts.values()).filter(count => count > SPAM_CONFIG.maxRepeatedWords);
    if (repeatedWords.length > 0) {
      score += 25;
    }

    // Check unique word count
    const uniqueWords = new Set(words.filter(word => word.length > 3));
    if (uniqueWords.size < SPAM_CONFIG.minUniqueWords) {
      score += 20;
    }

    // Check for suspicious patterns
    for (const pattern of SPAM_CONFIG.suspiciousPatterns) {
      const matches = testimonial.match(pattern);
      if (matches && matches.length > 0) {
        score += 15 * matches.length;
      }
    }

    // Check for URLs
    const urls = testimonial.match(/https?:\/\/[^\s]+/gi);
    if (urls && urls.length > SPAM_CONFIG.maxUrlCount) {
      score += 40;
    }

    // Check testimonial length vs quality
    if (data.testimonial.length < 50) {
      score += 15;
    } else if (data.testimonial.length > 2000) {
      score += 10;
    }

    // Check for generic/template content
    const genericPhrases = [
      'great work',
      'highly recommend',
      'excellent service',
      'very professional',
      'good job'
    ];

    const genericCount = genericPhrases.filter(phrase => 
      testimonial.includes(phrase)
    ).length;

    if (genericCount > 2) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Analyze email reputation
   */
  private async analyzeEmailReputation(email: string): Promise<number> {
    let score = 0;
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
      return 100; // Invalid email format
    }

    // Check disposable email domains
    if (SPAM_CONFIG.disposableEmailDomains.includes(domain)) {
      score += 80;
    }

    // Check for suspicious email patterns
    const localPart = email.split('@')[0];
    
    // Random character patterns
    if (/^[a-z0-9]{20,}$/.test(localPart)) {
      score += 30;
    }

    // Excessive numbers
    if ((localPart.match(/\d/g) || []).length > localPart.length * 0.5) {
      score += 25;
    }

    // Check email history
    const emailHistory = await this.getEmailHistory(email);
    if (emailHistory.submissionCount > 3) {
      score += 40;
    }

    if (emailHistory.rejectionRate > 0.5) {
      score += 50;
    }

    return Math.min(score, 100);
  }

  /**
   * Analyze behavioral patterns
   */
  private analyzeBehavior(context: SubmissionContext): number {
    let score = 0;

    // Check submission time
    if (context.submissionTime) {
      if (context.submissionTime < SPAM_CONFIG.minSubmissionTime) {
        score += 40; // Too fast = bot
      } else if (context.submissionTime > SPAM_CONFIG.maxSubmissionTime) {
        score += 20; // Too slow = suspicious
      }
    }

    // Check user agent
    const userAgent = context.userAgent.toLowerCase();
    
    // Bot-like user agents
    if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
      score += 60;
    }

    // Missing or suspicious user agent
    if (!userAgent || userAgent.length < 10) {
      score += 30;
    }

    // Check for automation patterns
    if (context.timestamp) {
      const hour = new Date(context.timestamp).getHours();
      // Submissions at unusual hours (2-6 AM) are more suspicious
      if (hour >= 2 && hour <= 6) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Analyze domain trust
   */
  private analyzeDomainTrust(email: string): number {
    let score = 0;
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
      return 100;
    }

    // Check if it's a trusted domain
    if (validateTrustedDomain(email)) {
      return 0; // Trusted domains get 0 spam score
    }

    // Check for suspicious domain patterns
    if (domain.includes('temp') || domain.includes('fake') || domain.includes('test')) {
      score += 60;
    }

    // Very new domains (would need external API to check)
    // For now, we'll use simple heuristics

    // Suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
    if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
      score += 40;
    }

    // Domain length and complexity
    if (domain.length > 30) {
      score += 20;
    }

    const domainParts = domain.split('.');
    if (domainParts.length > 3) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Analyze IP reputation
   */
  private async analyzeIpReputation(ipAddress: string): Promise<number> {
    let score = 0;

    // Check IP history
    const ipHistory = await this.getIpHistory(ipAddress);
    
    if (ipHistory.submissionCount > 5) {
      score += 30;
    }

    if (ipHistory.rejectionRate > 0.3) {
      score += 40;
    }

    // Check for suspicious IP patterns
    if (ipAddress === 'unknown' || ipAddress === '127.0.0.1') {
      score += 20;
    }

    // Check against known suspicious ranges
    for (const range of SPAM_CONFIG.suspiciousIpRanges) {
      if (ipAddress.startsWith(range)) {
        score += 50;
        break;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Generate human-readable reasons
   */
  private generateReasons(features: SpamAnalysisResult['features'], context: SubmissionContext): string[] {
    const reasons: string[] = [];

    if (features.contentQuality > 50) {
      reasons.push('Content shows spam-like patterns');
    }

    if (features.emailReputation > 50) {
      reasons.push('Email address appears suspicious');
    }

    if (features.behavioralAnalysis > 50) {
      reasons.push('Submission behavior indicates automation');
    }

    if (features.domainTrust > 50) {
      reasons.push('Email domain is not trusted');
    }

    if (features.ipReputation > 50) {
      reasons.push('IP address has suspicious activity');
    }

    // Add specific content reasons
    const testimonial = context.submissionData.testimonial.toLowerCase();
    
    if (testimonial.match(/(.)\1{5,}/)) {
      reasons.push('Excessive repeated characters detected');
    }

    if (testimonial.match(/https?:\/\//gi)) {
      reasons.push('Contains URLs');
    }

    if (testimonial.length < 50) {
      reasons.push('Testimonial too short');
    }

    return reasons;
  }

  /**
   * Get email submission history
   */
  private async getEmailHistory(email: string): Promise<{
    submissionCount: number;
    rejectionRate: number;
    lastSubmission?: string;
  }> {
    try {
      const historyData = await this.loadSpamHistory();
      const emailData = historyData.emails[email.toLowerCase()] || {
        submissions: 0,
        rejections: 0,
        lastSubmission: null
      };

      return {
        submissionCount: emailData.submissions,
        rejectionRate: emailData.submissions > 0 ? emailData.rejections / emailData.submissions : 0,
        lastSubmission: emailData.lastSubmission
      };
    } catch (error) {
      console.error('Failed to get email history:', error);
      return { submissionCount: 0, rejectionRate: 0 };
    }
  }

  /**
   * Get IP submission history
   */
  private async getIpHistory(ipAddress: string): Promise<{
    submissionCount: number;
    rejectionRate: number;
    lastSubmission?: string;
  }> {
    try {
      const historyData = await this.loadSpamHistory();
      const ipData = historyData.ips[ipAddress] || {
        submissions: 0,
        rejections: 0,
        lastSubmission: null
      };

      return {
        submissionCount: ipData.submissions,
        rejectionRate: ipData.submissions > 0 ? ipData.rejections / ipData.submissions : 0,
        lastSubmission: ipData.lastSubmission
      };
    } catch (error) {
      console.error('Failed to get IP history:', error);
      return { submissionCount: 0, rejectionRate: 0 };
    }
  }

  /**
   * Load spam history data
   */
  private async loadSpamHistory(): Promise<any> {
    try {
      const data = await fs.readFile(this.spamHistoryPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist, return empty structure
      return {
        emails: {},
        ips: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Save spam history data
   */
  private async saveSpamHistory(data: any): Promise<void> {
    try {
      const dataDir = path.dirname(this.spamHistoryPath);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.spamHistoryPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save spam history:', error);
    }
  }

  /**
   * Update spam history with new submission
   */
  async updateSpamHistory(
    email: string,
    ipAddress: string,
    wasRejected: boolean = false
  ): Promise<void> {
    try {
      const historyData = await this.loadSpamHistory();
      const now = new Date().toISOString();

      // Update email history
      if (!historyData.emails[email.toLowerCase()]) {
        historyData.emails[email.toLowerCase()] = {
          submissions: 0,
          rejections: 0,
          lastSubmission: null
        };
      }

      historyData.emails[email.toLowerCase()].submissions++;
      historyData.emails[email.toLowerCase()].lastSubmission = now;
      if (wasRejected) {
        historyData.emails[email.toLowerCase()].rejections++;
      }

      // Update IP history
      if (!historyData.ips[ipAddress]) {
        historyData.ips[ipAddress] = {
          submissions: 0,
          rejections: 0,
          lastSubmission: null
        };
      }

      historyData.ips[ipAddress].submissions++;
      historyData.ips[ipAddress].lastSubmission = now;
      if (wasRejected) {
        historyData.ips[ipAddress].rejections++;
      }

      historyData.lastUpdated = now;
      await this.saveSpamHistory(historyData);
    } catch (error) {
      console.error('Failed to update spam history:', error);
    }
  }

  /**
   * Log spam analysis for machine learning
   */
  private async logSpamAnalysis(
    context: SubmissionContext,
    result: SpamAnalysisResult
  ): Promise<void> {
    try {
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });

      const logPath = path.join(auditDir, 'spam-analysis.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        email: context.submissionData.email.toLowerCase(),
        ipAddress: context.ipAddress,
        score: result.score,
        isSpam: result.isSpam,
        isSuspicious: result.isSuspicious,
        features: result.features,
        reasons: result.reasons,
        recommendation: result.recommendation
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.error('Failed to log spam analysis:', error);
    }
  }

  /**
   * Get spam statistics
   */
  async getSpamStats(): Promise<{
    totalAnalyzed: number;
    spamDetected: number;
    suspiciousDetected: number;
    spamRate: number;
    topReasons: Array<{ reason: string; count: number }>;
  }> {
    try {
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      const logPath = path.join(auditDir, 'spam-analysis.log');
      
      const logData = await fs.readFile(logPath, 'utf-8');
      const lines = logData.trim().split('\n').filter(line => line);
      
      let totalAnalyzed = 0;
      let spamDetected = 0;
      let suspiciousDetected = 0;
      const reasonCounts = new Map<string, number>();

      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          totalAnalyzed++;
          
          if (entry.isSpam) spamDetected++;
          if (entry.isSuspicious) suspiciousDetected++;
          
          entry.reasons?.forEach((reason: string) => {
            reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
          });
        } catch {
          // Ignore malformed lines
        }
      }

      const topReasons = Array.from(reasonCounts.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalAnalyzed,
        spamDetected,
        suspiciousDetected,
        spamRate: totalAnalyzed > 0 ? spamDetected / totalAnalyzed : 0,
        topReasons
      };
    } catch (error) {
      console.error('Failed to get spam stats:', error);
      return {
        totalAnalyzed: 0,
        spamDetected: 0,
        suspiciousDetected: 0,
        spamRate: 0,
        topReasons: []
      };
    }
  }
}

/**
 * Convenience functions for easy usage
 */
export const antiSpamAnalyzer = AntiSpamAnalyzer.getInstance();

export async function analyzeSubmissionForSpam(context: SubmissionContext): Promise<SpamAnalysisResult> {
  return antiSpamAnalyzer.analyzeSubmission(context);
}

export async function updateSpamHistory(email: string, ipAddress: string, wasRejected?: boolean) {
  return antiSpamAnalyzer.updateSpamHistory(email, ipAddress, wasRejected);
}

export async function getSpamStats() {
  return antiSpamAnalyzer.getSpamStats();
}