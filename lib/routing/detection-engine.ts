/**
 * Detection Engine for Claude Code SuperClaude Framework
 * 
 * Analyzes requests to understand intent, complexity, and requirements.
 * Provides intelligent routing decisions with wave orchestration capabilities.
 */

export interface DetectionResult {
  complexity: number; // 0.0-1.0 scale
  domain: string[];
  operationType: string[];
  waveScore: number;
  delegationScore: number;
  tokenEstimate: number;
  riskScore: number;
  confidence: number;
}

export interface ResourceThresholds {
  green: { min: 0, max: 60 };
  yellow: { min: 60, max: 75 };
  orange: { min: 75, max: 85 };
  red: { min: 85, max: 95 };
  critical: { min: 95, max: 100 };
}

export class DetectionEngine {
  private patterns: PatternDatabase;
  private resourceThresholds: ResourceThresholds;

  constructor() {
    this.patterns = new PatternDatabase();
    this.resourceThresholds = {
      green: { min: 0, max: 60 },
      yellow: { min: 60, max: 75 },
      orange: { min: 75, max: 85 },
      red: { min: 85, max: 95 },
      critical: { min: 95, max: 100 }
    };
  }

  /**
   * Main detection method that analyzes user requests
   */
  async analyzeRequest(request: string, context?: any): Promise<DetectionResult> {
    const keywords = this.extractKeywords(request);
    const complexity = this.calculateComplexity(request, keywords);
    const domains = this.identifyDomains(keywords);
    const operations = this.classifyOperations(keywords);
    
    const waveScore = this.calculateWaveScore(complexity, domains, operations, keywords);
    const delegationScore = this.calculateDelegationScore(complexity, domains, operations);
    const tokenEstimate = this.estimateTokenUsage(complexity, operations);
    const riskScore = this.assessRisk(complexity, operations, tokenEstimate);
    const confidence = this.calculateConfidence(keywords, domains, operations);

    return {
      complexity,
      domain: domains,
      operationType: operations,
      waveScore,
      delegationScore,
      tokenEstimate,
      riskScore,
      confidence
    };
  }

  /**
   * Extract relevant keywords from user request
   */
  private extractKeywords(request: string): string[] {
    const text = request.toLowerCase();
    const keywords: string[] = [];

    // Domain keywords
    const domainPatterns = this.patterns.getDomainPatterns();
    for (const [domain, patterns] of Object.entries(domainPatterns)) {
      for (const keyword of patterns.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          keywords.push(`domain:${domain}`);
          keywords.push(keyword);
        }
      }
    }

    // Operation keywords
    const operationPatterns = this.patterns.getOperationPatterns();
    for (const [operation, patterns] of Object.entries(operationPatterns)) {
      for (const verb of patterns.verbs) {
        if (text.includes(verb.toLowerCase())) {
          keywords.push(`operation:${operation}`);
          keywords.push(verb);
        }
      }
    }

    // Wave indicators
    const waveIndicators = [
      'comprehensive', 'systematically', 'thoroughly', 'enterprise',
      'large-scale', 'multi-stage', 'progressive', 'iterative'
    ];
    
    for (const indicator of waveIndicators) {
      if (text.includes(indicator)) {
        keywords.push(`wave:${indicator}`);
      }
    }

    return keywords;
  }

  /**
   * Calculate complexity score based on request analysis
   */
  private calculateComplexity(request: string, keywords: string[]): number {
    let score = 0.0;

    // Base complexity from request length
    score += Math.min(request.length / 1000, 0.3);

    // Complexity indicators
    const complexityIndicators = [
      'system-wide', 'architecture', 'performance', 'security',
      'enterprise', 'comprehensive', 'multi-', 'large-scale'
    ];

    for (const indicator of complexityIndicators) {
      if (request.toLowerCase().includes(indicator)) {
        score += 0.15;
      }
    }

    // Multiple domains increase complexity
    const domainCount = keywords.filter(k => k.startsWith('domain:')).length;
    score += domainCount * 0.1;

    // Multiple operations increase complexity
    const operationCount = keywords.filter(k => k.startsWith('operation:')).length;
    score += operationCount * 0.08;

    return Math.min(score, 1.0);
  }

  /**
   * Identify relevant domains from keywords
   */
  private identifyDomains(keywords: string[]): string[] {
    const domains = new Set<string>();
    
    keywords.forEach(keyword => {
      if (keyword.startsWith('domain:')) {
        domains.add(keyword.replace('domain:', ''));
      }
    });

    return Array.from(domains);
  }

  /**
   * Classify operation types from keywords
   */
  private classifyOperations(keywords: string[]): string[] {
    const operations = new Set<string>();
    
    keywords.forEach(keyword => {
      if (keyword.startsWith('operation:')) {
        operations.add(keyword.replace('operation:', ''));
      }
    });

    return Array.from(operations);
  }

  /**
   * Calculate wave orchestration score
   */
  private calculateWaveScore(
    complexity: number,
    domains: string[],
    operations: string[],
    keywords: string[]
  ): number {
    let score = 0.0;

    // Complexity factor (0.2-0.4 weight)
    score += complexity * 0.4;

    // Scale factor (0.2-0.3 weight)
    const scaleIndicators = keywords.filter(k => k.startsWith('wave:')).length;
    score += Math.min(scaleIndicators * 0.1, 0.3);

    // Operations factor (0.2 weight)
    score += Math.min(operations.length * 0.05, 0.2);

    // Domains factor (0.1 weight)
    score += Math.min(domains.length * 0.03, 0.1);

    return Math.min(score, 1.0);
  }

  /**
   * Calculate delegation score for sub-agent activation
   */
  private calculateDelegationScore(
    complexity: number,
    domains: string[],
    operations: string[]
  ): number {
    let score = 0.0;

    // High complexity increases delegation need
    if (complexity > 0.6) score += 0.3;

    // Multiple domains suggest parallel work
    if (domains.length > 2) score += 0.4;

    // Multiple operations can be parallelized
    score += Math.min(operations.length / 5, 0.4);

    return Math.min(score, 1.0);
  }

  /**
   * Estimate token usage based on complexity and operations
   */
  private estimateTokenUsage(complexity: number, operations: string[]): number {
    let baseTokens = 5000; // Base estimate

    // Complexity multiplier
    baseTokens *= (1 + complexity);

    // Operation type multipliers
    const tokenMultipliers: Record<string, number> = {
      analysis: 1.5,
      creation: 1.2,
      implementation: 1.8,
      modification: 1.3,
      debugging: 1.6,
      iterative: 2.0
    };

    for (const operation of operations) {
      const multiplier = tokenMultipliers[operation] || 1.0;
      baseTokens *= multiplier;
    }

    return Math.round(baseTokens);
  }

  /**
   * Assess risk score for the operation
   */
  private assessRisk(complexity: number, operations: string[], tokenEstimate: number): number {
    let risk = 0.0;

    // Complexity risk
    risk += complexity * 0.4;

    // Token usage risk
    if (tokenEstimate > 30000) risk += 0.3;
    else if (tokenEstimate > 15000) risk += 0.2;
    else if (tokenEstimate > 10000) risk += 0.1;

    // Operation risk
    const highRiskOperations = ['debugging', 'implementation', 'modification'];
    const riskOperations = operations.filter(op => highRiskOperations.includes(op));
    risk += riskOperations.length * 0.1;

    return Math.min(risk, 1.0);
  }

  /**
   * Calculate confidence in the detection results
   */
  private calculateConfidence(keywords: string[], domains: string[], operations: string[]): number {
    let confidence = 0.5; // Base confidence

    // Keyword match strength (40%)
    confidence += Math.min(keywords.length / 10, 0.4);

    // Domain identification clarity (30%)
    if (domains.length > 0) confidence += 0.3;

    // Operation classification clarity (20%)
    if (operations.length > 0) confidence += 0.2;

    // Context completeness (10%)
    if (keywords.length > 5 && domains.length > 0 && operations.length > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Get current resource usage level
   */
  getCurrentResourceLevel(): keyof ResourceThresholds {
    // This would integrate with actual system monitoring
    // For now, return a mock value
    const usage = Math.random() * 100;
    
    if (usage <= this.resourceThresholds.green.max) return 'green';
    if (usage <= this.resourceThresholds.yellow.max) return 'yellow';
    if (usage <= this.resourceThresholds.orange.max) return 'orange';
    if (usage <= this.resourceThresholds.red.max) return 'red';
    return 'critical';
  }
}

/**
 * Pattern Database for domain and operation classification
 */
class PatternDatabase {
  private domainPatterns = {
    frontend: {
      keywords: ['UI', 'component', 'React', 'Vue', 'CSS', 'responsive', 'accessibility', 'implement component', 'build UI'],
      filePatterns: ['*.jsx', '*.tsx', '*.vue', '*.css', '*.scss'],
      operations: ['create', 'implement', 'style', 'optimize', 'test']
    },
    backend: {
      keywords: ['API', 'database', 'server', 'endpoint', 'authentication', 'performance', 'implement API', 'build service'],
      filePatterns: ['*.js', '*.ts', '*.py', '*.go', 'controllers/*', 'models/*'],
      operations: ['implement', 'optimize', 'secure', 'scale']
    },
    infrastructure: {
      keywords: ['deploy', 'Docker', 'CI/CD', 'monitoring', 'scaling', 'configuration'],
      filePatterns: ['Dockerfile', '*.yml', '*.yaml', '.github/*', 'terraform/*'],
      operations: ['setup', 'configure', 'automate', 'monitor']
    },
    security: {
      keywords: ['vulnerability', 'authentication', 'encryption', 'audit', 'compliance'],
      filePatterns: ['*auth*', '*security*', '*.pem', '*.key'],
      operations: ['scan', 'harden', 'audit', 'fix']
    },
    documentation: {
      keywords: ['document', 'README', 'wiki', 'guide', 'manual', 'instructions', 'commit', 'release', 'changelog'],
      filePatterns: ['*.md', '*.rst', '*.txt', 'docs/*', 'README*', 'CHANGELOG*'],
      operations: ['write', 'document', 'explain', 'translate', 'localize']
    }
  };

  private operationPatterns = {
    analysis: {
      verbs: ['analyze', 'review', 'explain', 'understand', 'investigate', 'troubleshoot'],
      outputs: ['insights', 'recommendations', 'reports'],
      tools: ['Grep', 'Read', 'Sequential']
    },
    creation: {
      verbs: ['create', 'build', 'implement', 'generate', 'design'],
      outputs: ['new files', 'features', 'components'],
      tools: ['Write', 'Magic', 'Context7']
    },
    implementation: {
      verbs: ['implement', 'develop', 'code', 'construct', 'realize'],
      outputs: ['working features', 'functional code', 'integrated components'],
      tools: ['Write', 'Edit', 'MultiEdit', 'Magic', 'Context7', 'Sequential']
    },
    modification: {
      verbs: ['update', 'refactor', 'improve', 'optimize', 'fix'],
      outputs: ['edited files', 'improvements'],
      tools: ['Edit', 'MultiEdit', 'Sequential']
    },
    debugging: {
      verbs: ['debug', 'fix', 'troubleshoot', 'resolve', 'investigate'],
      outputs: ['fixes', 'root causes', 'solutions'],
      tools: ['Grep', 'Sequential', 'Playwright']
    },
    iterative: {
      verbs: ['improve', 'refine', 'enhance', 'correct', 'polish', 'fix', 'iterate', 'loop'],
      outputs: ['progressive improvements', 'refined results', 'enhanced quality'],
      tools: ['Sequential', 'Read', 'Edit', 'MultiEdit', 'TodoWrite']
    }
  };

  getDomainPatterns() {
    return this.domainPatterns;
  }

  getOperationPatterns() {
    return this.operationPatterns;
  }
}