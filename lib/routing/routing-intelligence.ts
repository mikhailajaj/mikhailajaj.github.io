/**
 * Routing Intelligence for Claude Code SuperClaude Framework
 * 
 * Dynamic decision trees that map detected patterns to optimal tool combinations,
 * persona activation, and orchestration strategies with wave capabilities.
 */

import { DetectionResult } from './detection-engine';

export interface RoutingDecision {
  tools: string[];
  personas: string[];
  flags: string[];
  waveStrategy?: WaveStrategy;
  delegationStrategy?: DelegationStrategy;
  confidence: number;
  reasoning: string[];
}

export interface WaveStrategy {
  enabled: boolean;
  type: 'progressive' | 'systematic' | 'adaptive' | 'enterprise' | 'validation';
  waveCount: number;
  checkpoints: boolean;
  validation: boolean;
}

export interface DelegationStrategy {
  enabled: boolean;
  type: 'parallel_dirs' | 'parallel_focus' | 'adaptive' | 'focus_agents';
  subAgents: number;
  specializations: string[];
}

export class RoutingIntelligence {
  private routingTable: RoutingTable;
  private personaMatrix: PersonaMatrix;
  private flagMatrix: FlagMatrix;

  constructor() {
    this.routingTable = new RoutingTable();
    this.personaMatrix = new PersonaMatrix();
    this.flagMatrix = new FlagMatrix();
  }

  /**
   * Generate routing decision based on detection results
   */
  async generateRoutingDecision(detection: DetectionResult, context?: any): Promise<RoutingDecision> {
    const reasoning: string[] = [];
    
    // Base tool selection
    const tools = this.selectTools(detection, reasoning);
    
    // Persona activation
    const personas = this.selectPersonas(detection, reasoning);
    
    // Flag auto-activation
    const flags = this.selectFlags(detection, reasoning);
    
    // Wave strategy evaluation
    const waveStrategy = this.evaluateWaveStrategy(detection, reasoning);
    
    // Delegation strategy evaluation
    const delegationStrategy = this.evaluateDelegationStrategy(detection, reasoning);
    
    // Calculate overall confidence
    const confidence = this.calculateRoutingConfidence(detection, tools, personas, flags);

    return {
      tools,
      personas,
      flags,
      waveStrategy,
      delegationStrategy,
      confidence,
      reasoning
    };
  }

  /**
   * Select optimal tools based on detection results
   */
  private selectTools(detection: DetectionResult, reasoning: string[]): string[] {
    const tools: string[] = [];

    // Base tool selection logic
    if (detection.complexity > 0.7) {
      tools.push('Sequential');
      reasoning.push('High complexity detected - using Sequential for multi-step reasoning');
    }

    // Domain-specific tool selection
    for (const domain of detection.domain) {
      switch (domain) {
        case 'frontend':
          tools.push('Magic');
          reasoning.push(`Frontend domain detected - adding Magic for UI components`);
          break;
        case 'backend':
          tools.push('Context7');
          reasoning.push(`Backend domain detected - adding Context7 for API patterns`);
          break;
        case 'documentation':
          tools.push('Context7');
          reasoning.push(`Documentation domain detected - adding Context7 for writing patterns`);
          break;
        case 'security':
          tools.push('Sequential', 'Grep');
          reasoning.push(`Security domain detected - adding Sequential and Grep for analysis`);
          break;
      }
    }

    // Operation-specific tool selection
    for (const operation of detection.operationType) {
      switch (operation) {
        case 'analysis':
          if (!tools.includes('Sequential')) tools.push('Sequential');
          if (!tools.includes('Grep')) tools.push('Grep');
          reasoning.push(`Analysis operation - ensuring Sequential and Grep are available`);
          break;
        case 'creation':
          if (!tools.includes('Magic')) tools.push('Magic');
          if (!tools.includes('Context7')) tools.push('Context7');
          reasoning.push(`Creation operation - adding Magic and Context7 for generation`);
          break;
        case 'debugging':
          if (!tools.includes('Sequential')) tools.push('Sequential');
          if (!tools.includes('Playwright')) tools.push('Playwright');
          reasoning.push(`Debugging operation - adding Sequential and Playwright for testing`);
          break;
        case 'iterative':
          if (!tools.includes('Sequential')) tools.push('Sequential');
          reasoning.push(`Iterative operation - ensuring Sequential for loop coordination`);
          break;
      }
    }

    // Wave coordination
    if (detection.waveScore > 0.7) {
      if (!tools.includes('Sequential')) tools.push('Sequential');
      if (!tools.includes('Task')) tools.push('Task');
      reasoning.push(`High wave score - adding Sequential and Task for wave coordination`);
    }

    // Delegation coordination
    if (detection.delegationScore > 0.6) {
      if (!tools.includes('Task')) tools.push('Task');
      reasoning.push(`High delegation score - adding Task for sub-agent coordination`);
    }

    return [...new Set(tools)]; // Remove duplicates
  }

  /**
   * Select appropriate personas based on detection results
   */
  private selectPersonas(detection: DetectionResult, reasoning: string[]): string[] {
    const personas: string[] = [];

    // Domain-based persona selection
    for (const domain of detection.domain) {
      const persona = this.personaMatrix.getDomainPersona(domain);
      if (persona) {
        personas.push(persona);
        reasoning.push(`${domain} domain detected - activating ${persona} persona`);
      }
    }

    // Operation-based persona selection
    for (const operation of detection.operationType) {
      const persona = this.personaMatrix.getOperationPersona(operation);
      if (persona && !personas.includes(persona)) {
        personas.push(persona);
        reasoning.push(`${operation} operation detected - activating ${persona} persona`);
      }
    }

    // Complexity-based persona selection
    if (detection.complexity > 0.8) {
      if (!personas.includes('architect')) {
        personas.push('architect');
        reasoning.push('High complexity - activating architect persona for system-level thinking');
      }
    }

    // Default to intelligent persona if none selected
    if (personas.length === 0) {
      personas.push('intelligent');
      reasoning.push('No specific persona detected - using intelligent persona as default');
    }

    return personas;
  }

  /**
   * Select auto-activation flags based on detection results
   */
  private selectFlags(detection: DetectionResult, reasoning: string[]): string[] {
    const flags: string[] = [];

    // Thinking depth flags
    if (detection.complexity > 0.8) {
      flags.push('--ultrathink');
      reasoning.push('Very high complexity - enabling ultrathink mode');
    } else if (detection.complexity > 0.6) {
      flags.push('--think-hard');
      reasoning.push('High complexity - enabling think-hard mode');
    } else if (detection.complexity > 0.4) {
      flags.push('--think');
      reasoning.push('Moderate complexity - enabling think mode');
    }

    // Context optimization
    if (detection.tokenEstimate > 20000) {
      flags.push('--uc');
      reasoning.push('High token estimate - enabling ultra-compressed mode');
    }

    // Validation flags
    if (detection.riskScore > 0.7) {
      flags.push('--validate');
      reasoning.push('High risk score - enabling validation mode');
    }

    // Safety flags
    if (detection.domain.includes('security') || detection.riskScore > 0.8) {
      flags.push('--safe-mode');
      reasoning.push('Security domain or high risk - enabling safe mode');
    }

    // Performance flags
    if (detection.domain.includes('infrastructure') || detection.operationType.includes('debugging')) {
      flags.push('--focus', 'performance');
      reasoning.push('Infrastructure/debugging detected - focusing on performance');
    }

    return flags;
  }

  /**
   * Evaluate wave strategy based on detection results
   */
  private evaluateWaveStrategy(detection: DetectionResult, reasoning: string[]): WaveStrategy | undefined {
    if (detection.waveScore < 0.7) {
      return undefined;
    }

    let type: WaveStrategy['type'] = 'systematic';
    let waveCount = 3;
    let checkpoints = false;
    let validation = false;

    // Determine wave strategy type
    if (detection.domain.includes('security')) {
      type = 'validation';
      validation = true;
      checkpoints = true;
      reasoning.push('Security domain - using validation wave strategy with checkpoints');
    } else if (detection.complexity > 0.8 && detection.domain.length > 2) {
      type = 'enterprise';
      waveCount = 5;
      checkpoints = true;
      reasoning.push('High complexity + multiple domains - using enterprise wave strategy');
    } else if (detection.operationType.includes('iterative')) {
      type = 'progressive';
      reasoning.push('Iterative operations - using progressive wave strategy');
    } else if (detection.operationType.length > 2) {
      type = 'adaptive';
      reasoning.push('Multiple operation types - using adaptive wave strategy');
    }

    // Adjust wave count based on complexity
    if (detection.complexity > 0.9) {
      waveCount = Math.max(waveCount, 5);
    } else if (detection.complexity > 0.8) {
      waveCount = Math.max(waveCount, 4);
    }

    reasoning.push(`Wave strategy enabled: ${type} with ${waveCount} waves`);

    return {
      enabled: true,
      type,
      waveCount,
      checkpoints,
      validation
    };
  }

  /**
   * Evaluate delegation strategy based on detection results
   */
  private evaluateDelegationStrategy(detection: DetectionResult, reasoning: string[]): DelegationStrategy | undefined {
    if (detection.delegationScore < 0.6) {
      return undefined;
    }

    let type: DelegationStrategy['type'] = 'adaptive';
    let subAgents = 2;
    const specializations: string[] = [];

    // Determine delegation type
    if (detection.domain.length > 3) {
      type = 'parallel_focus';
      subAgents = Math.min(detection.domain.length, 5);
      specializations.push(...detection.domain);
      reasoning.push(`Multiple domains (${detection.domain.length}) - using parallel focus delegation`);
    } else if (detection.complexity > 0.8) {
      type = 'focus_agents';
      subAgents = 3;
      specializations.push('quality', 'security', 'performance');
      reasoning.push('High complexity - using focus agents for specialized analysis');
    } else if (detection.tokenEstimate > 20000) {
      type = 'parallel_dirs';
      subAgents = 4;
      reasoning.push('High token estimate - using parallel directory processing');
    }

    reasoning.push(`Delegation strategy enabled: ${type} with ${subAgents} sub-agents`);

    return {
      enabled: true,
      type,
      subAgents,
      specializations
    };
  }

  /**
   * Calculate confidence in routing decision
   */
  private calculateRoutingConfidence(
    detection: DetectionResult,
    tools: string[],
    personas: string[],
    flags: string[]
  ): number {
    let confidence = detection.confidence * 0.4; // Base from detection confidence

    // Tool selection confidence
    if (tools.length > 0) confidence += 0.2;
    if (tools.length > 2) confidence += 0.1; // Multiple tools suggest comprehensive approach

    // Persona selection confidence
    if (personas.length > 0) confidence += 0.2;

    // Flag selection confidence
    if (flags.length > 0) confidence += 0.1;

    // Pattern match confidence
    const routingPattern = this.routingTable.findMatchingPattern(detection);
    if (routingPattern) {
      confidence += routingPattern.confidence * 0.1;
    }

    return Math.min(confidence, 1.0);
  }
}

/**
 * Routing table with predefined patterns and their optimal configurations
 */
class RoutingTable {
  private patterns = [
    {
      pattern: 'analyze architecture',
      complexity: { min: 0.7, max: 1.0 },
      domains: ['infrastructure'],
      tools: ['Sequential', 'Context7'],
      personas: ['architect'],
      flags: ['--ultrathink'],
      confidence: 0.95
    },
    {
      pattern: 'create component',
      complexity: { min: 0.0, max: 0.4 },
      domains: ['frontend'],
      tools: ['Magic', 'Context7'],
      personas: ['frontend'],
      flags: ['--uc'],
      confidence: 0.90
    },
    {
      pattern: 'implement feature',
      complexity: { min: 0.4, max: 0.8 },
      domains: ['any'],
      tools: ['Sequential', 'Context7'],
      personas: ['intelligent'],
      flags: ['--think'],
      confidence: 0.88
    },
    {
      pattern: 'security audit',
      complexity: { min: 0.7, max: 1.0 },
      domains: ['security'],
      tools: ['Sequential', 'Grep'],
      personas: ['security'],
      flags: ['--ultrathink', '--validate'],
      confidence: 0.95
    },
    {
      pattern: 'write documentation',
      complexity: { min: 0.3, max: 0.7 },
      domains: ['documentation'],
      tools: ['Context7'],
      personas: ['scribe'],
      flags: ['--persona-scribe=en'],
      confidence: 0.95
    }
  ];

  findMatchingPattern(detection: DetectionResult) {
    return this.patterns.find(pattern => {
      const complexityMatch = detection.complexity >= pattern.complexity.min && 
                             detection.complexity <= pattern.complexity.max;
      const domainMatch = pattern.domains.includes('any') || 
                         pattern.domains.some(d => detection.domain.includes(d));
      
      return complexityMatch && domainMatch;
    });
  }
}

/**
 * Persona selection matrix
 */
class PersonaMatrix {
  private domainPersonas = {
    frontend: 'frontend',
    backend: 'backend',
    infrastructure: 'devops',
    security: 'security',
    documentation: 'scribe'
  };

  private operationPersonas = {
    analysis: 'analyzer',
    creation: 'intelligent',
    implementation: 'intelligent',
    modification: 'refactorer',
    debugging: 'analyzer',
    iterative: 'intelligent'
  };

  getDomainPersona(domain: string): string | undefined {
    return this.domainPersonas[domain as keyof typeof this.domainPersonas];
  }

  getOperationPersona(operation: string): string | undefined {
    return this.operationPersonas[operation as keyof typeof this.operationPersonas];
  }
}

/**
 * Flag selection matrix
 */
class FlagMatrix {
  private complexityFlags = {
    high: ['--ultrathink', '--validate'],
    medium: ['--think-hard'],
    low: ['--think']
  };

  private domainFlags = {
    security: ['--safe-mode', '--validate'],
    performance: ['--focus', 'performance'],
    frontend: ['--magic'],
    documentation: ['--persona-scribe=en']
  };

  getComplexityFlags(complexity: number): string[] {
    if (complexity > 0.8) return this.complexityFlags.high;
    if (complexity > 0.6) return this.complexityFlags.medium;
    if (complexity > 0.4) return this.complexityFlags.low;
    return [];
  }

  getDomainFlags(domain: string): string[] {
    return this.domainFlags[domain as keyof typeof this.domainFlags] || [];
  }
}