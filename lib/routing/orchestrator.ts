/**
 * Main Orchestrator for Claude Code SuperClaude Framework
 * 
 * Central coordination system that integrates detection, routing, and wave orchestration
 * to provide intelligent command routing and execution strategies.
 */

import { DetectionEngine, DetectionResult } from './detection-engine';
import { RoutingIntelligence, RoutingDecision } from './routing-intelligence';
import { WaveOrchestrator, WaveOrchestrationPlan } from './wave-orchestrator';

export interface OrchestrationRequest {
  userInput: string;
  context?: any;
  flags?: string[];
  overrides?: {
    forceWave?: boolean;
    disableWave?: boolean;
    specificPersona?: string;
    specificTools?: string[];
  };
}

export interface OrchestrationResult {
  detection: DetectionResult;
  routing: RoutingDecision;
  waveOrchestration?: WaveOrchestrationPlan;
  executionPlan: ExecutionPlan;
  recommendations: string[];
  warnings: string[];
  estimatedResources: ResourceEstimate;
}

export interface ExecutionPlan {
  mode: 'traditional' | 'wave' | 'hybrid';
  steps: ExecutionStep[];
  totalEstimatedTime: number;
  totalEstimatedTokens: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  safetyMeasures: string[];
}

export interface ExecutionStep {
  id: string;
  name: string;
  type: 'detection' | 'routing' | 'wave' | 'execution' | 'validation';
  tools: string[];
  personas: string[];
  flags: string[];
  estimatedTokens: number;
  dependencies: string[];
  parallel: boolean;
}

export interface ResourceEstimate {
  tokenUsage: {
    detection: number;
    routing: number;
    execution: number;
    total: number;
  };
  timeEstimate: {
    detection: number;
    routing: number;
    execution: number;
    total: number;
  };
  resourceLevel: 'green' | 'yellow' | 'orange' | 'red' | 'critical';
  optimizations: string[];
}

export class SuperClaudeOrchestrator {
  private detectionEngine: DetectionEngine;
  private routingIntelligence: RoutingIntelligence;
  private waveOrchestrator: WaveOrchestrator;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.detectionEngine = new DetectionEngine();
    this.routingIntelligence = new RoutingIntelligence();
    this.waveOrchestrator = new WaveOrchestrator();
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Main orchestration method - analyzes request and generates execution plan
   */
  async orchestrate(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const startTime = Date.now();
    
    try {
      // Step 1: Detection Phase
      console.log('🧠 Starting detection phase...');
      const detection = await this.detectionEngine.analyzeRequest(
        request.userInput,
        request.context
      );
      
      // Step 2: Routing Phase
      console.log('🚦 Starting routing phase...');
      const routing = await this.routingIntelligence.generateRoutingDecision(
        detection,
        request.context
      );
      
      // Apply user overrides
      this.applyUserOverrides(routing, request.overrides);
      
      // Step 3: Wave Orchestration (if applicable)
      let waveOrchestration: WaveOrchestrationPlan | undefined;
      if (routing.waveStrategy?.enabled && !request.overrides?.disableWave) {
        console.log('🌊 Starting wave orchestration...');
        waveOrchestration = await this.waveOrchestrator.createOrchestrationPlan(
          detection,
          routing,
          request.userInput
        );
      }
      
      // Step 4: Generate Execution Plan
      console.log('📋 Generating execution plan...');
      const executionPlan = this.generateExecutionPlan(detection, routing, waveOrchestration);
      
      // Step 5: Resource Estimation
      const estimatedResources = this.estimateResources(detection, routing, waveOrchestration);
      
      // Step 6: Generate Recommendations and Warnings
      const recommendations = this.generateRecommendations(detection, routing, estimatedResources);
      const warnings = this.generateWarnings(detection, routing, estimatedResources);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Orchestration completed in ${processingTime}ms`);
      
      return {
        detection,
        routing,
        waveOrchestration,
        executionPlan,
        recommendations,
        warnings,
        estimatedResources
      };
      
    } catch (error) {
      console.error('❌ Orchestration failed:', error);
      throw new Error(`Orchestration failed: ${error.message}`);
    }
  }

  /**
   * Apply user overrides to routing decision
   */
  private applyUserOverrides(routing: RoutingDecision, overrides?: OrchestrationRequest['overrides']): void {
    if (!overrides) return;

    if (overrides.forceWave && !routing.waveStrategy) {
      routing.waveStrategy = {
        enabled: true,
        type: 'systematic',
        waveCount: 3,
        checkpoints: false,
        validation: false
      };
    }

    if (overrides.disableWave) {
      routing.waveStrategy = undefined;
    }

    if (overrides.specificPersona) {
      routing.personas = [overrides.specificPersona];
    }

    if (overrides.specificTools) {
      routing.tools = overrides.specificTools;
    }
  }

  /**
   * Generate comprehensive execution plan
   */
  private generateExecutionPlan(
    detection: DetectionResult,
    routing: RoutingDecision,
    waveOrchestration?: WaveOrchestrationPlan
  ): ExecutionPlan {
    const steps: ExecutionStep[] = [];
    let totalTime = 0;
    let totalTokens = 0;

    // Determine execution mode
    const mode = waveOrchestration ? 'wave' : 'traditional';

    if (mode === 'wave' && waveOrchestration) {
      // Wave-based execution plan
      waveOrchestration.waves.forEach((wave, index) => {
        wave.operations.forEach(operation => {
          steps.push({
            id: operation.id,
            name: operation.name,
            type: 'wave',
            tools: operation.tools,
            personas: operation.personas,
            flags: operation.flags,
            estimatedTokens: operation.estimatedTokens,
            dependencies: operation.dependencies,
            parallel: false
          });
          totalTokens += operation.estimatedTokens;
        });
      });
      totalTime = waveOrchestration.estimatedDuration;
    } else {
      // Traditional execution plan
      steps.push({
        id: 'traditional-execution',
        name: 'Traditional Execution',
        type: 'execution',
        tools: routing.tools,
        personas: routing.personas,
        flags: routing.flags,
        estimatedTokens: detection.tokenEstimate,
        dependencies: [],
        parallel: false
      });
      totalTokens = detection.tokenEstimate;
      totalTime = this.estimateTraditionalExecutionTime(detection);
    }

    // Determine risk level
    const riskLevel = this.calculateRiskLevel(detection, totalTokens);
    
    // Generate safety measures
    const safetyMeasures = this.generateSafetyMeasures(detection, riskLevel);

    return {
      mode,
      steps,
      totalEstimatedTime: totalTime,
      totalEstimatedTokens: totalTokens,
      riskLevel,
      safetyMeasures
    };
  }

  /**
   * Estimate resource requirements
   */
  private estimateResources(
    detection: DetectionResult,
    routing: RoutingDecision,
    waveOrchestration?: WaveOrchestrationPlan
  ): ResourceEstimate {
    const detectionTokens = 1500; // Fixed cost for detection
    const routingTokens = 800; // Fixed cost for routing
    const executionTokens = waveOrchestration?.estimatedTokens || detection.tokenEstimate;

    const detectionTime = 2; // 2 seconds
    const routingTime = 1; // 1 second
    const executionTime = waveOrchestration?.estimatedDuration || this.estimateTraditionalExecutionTime(detection);

    const totalTokens = detectionTokens + routingTokens + executionTokens;
    const totalTime = detectionTime + routingTime + executionTime;

    // Determine resource level
    const resourceLevel = this.determineResourceLevel(totalTokens, totalTime);
    
    // Generate optimizations
    const optimizations = this.generateOptimizations(totalTokens, resourceLevel);

    return {
      tokenUsage: {
        detection: detectionTokens,
        routing: routingTokens,
        execution: executionTokens,
        total: totalTokens
      },
      timeEstimate: {
        detection: detectionTime,
        routing: routingTime,
        execution: executionTime,
        total: totalTime
      },
      resourceLevel,
      optimizations
    };
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    detection: DetectionResult,
    routing: RoutingDecision,
    resources: ResourceEstimate
  ): string[] {
    const recommendations: string[] = [];

    // Complexity-based recommendations
    if (detection.complexity > 0.8) {
      recommendations.push('Consider breaking down this complex task into smaller, manageable pieces');
      recommendations.push('Enable wave mode for better progress tracking and error recovery');
    }

    // Resource-based recommendations
    if (resources.resourceLevel === 'red' || resources.resourceLevel === 'critical') {
      recommendations.push('Consider using --uc flag to reduce token usage');
      recommendations.push('Enable delegation to distribute workload across sub-agents');
    }

    // Wave-specific recommendations
    if (routing.waveStrategy?.enabled) {
      recommendations.push(`Using ${routing.waveStrategy.type} wave strategy for optimal results`);
      if (routing.waveStrategy.checkpoints) {
        recommendations.push('Checkpoints enabled - progress will be saved at each wave');
      }
    }

    // Domain-specific recommendations
    if (detection.domain.includes('security')) {
      recommendations.push('Security domain detected - validation and safe mode recommended');
    }

    if (detection.domain.includes('frontend')) {
      recommendations.push('Frontend domain detected - consider using Magic tool for UI components');
    }

    return recommendations;
  }

  /**
   * Generate warnings based on analysis
   */
  private generateWarnings(
    detection: DetectionResult,
    routing: RoutingDecision,
    resources: ResourceEstimate
  ): string[] {
    const warnings: string[] = [];

    // Risk-based warnings
    if (detection.riskScore > 0.8) {
      warnings.push('High risk operation detected - proceed with caution');
      warnings.push('Consider enabling safe mode and validation');
    }

    // Resource warnings
    if (resources.resourceLevel === 'critical') {
      warnings.push('Critical resource usage detected - operation may fail');
      warnings.push('Consider reducing scope or enabling compression');
    }

    // Token warnings
    if (resources.tokenUsage.total > 30000) {
      warnings.push('Very high token usage estimated - consider delegation or compression');
    }

    // Time warnings
    if (resources.timeEstimate.total > 1800) { // 30 minutes
      warnings.push('Long execution time estimated - consider wave mode for better progress tracking');
    }

    // Confidence warnings
    if (routing.confidence < 0.7) {
      warnings.push('Low confidence in routing decision - manual review recommended');
    }

    return warnings;
  }

  /**
   * Calculate risk level based on detection and resources
   */
  private calculateRiskLevel(detection: DetectionResult, totalTokens: number): ExecutionPlan['riskLevel'] {
    let riskScore = detection.riskScore;

    // Adjust for token usage
    if (totalTokens > 30000) riskScore += 0.2;
    else if (totalTokens > 20000) riskScore += 0.1;

    // Adjust for complexity
    if (detection.complexity > 0.9) riskScore += 0.1;

    if (riskScore > 0.8) return 'critical';
    if (riskScore > 0.6) return 'high';
    if (riskScore > 0.4) return 'medium';
    return 'low';
  }

  /**
   * Generate safety measures based on risk level
   */
  private generateSafetyMeasures(detection: DetectionResult, riskLevel: ExecutionPlan['riskLevel']): string[] {
    const measures: string[] = [];

    switch (riskLevel) {
      case 'critical':
        measures.push('Enable safe mode');
        measures.push('Enable comprehensive validation');
        measures.push('Create backup before execution');
        measures.push('Enable rollback capability');
        break;
      case 'high':
        measures.push('Enable validation');
        measures.push('Enable checkpoints');
        measures.push('Monitor resource usage');
        break;
      case 'medium':
        measures.push('Enable basic validation');
        measures.push('Monitor progress');
        break;
      case 'low':
        measures.push('Standard execution monitoring');
        break;
    }

    return measures;
  }

  /**
   * Estimate traditional execution time
   */
  private estimateTraditionalExecutionTime(detection: DetectionResult): number {
    // Base time estimate in seconds
    let baseTime = 60; // 1 minute base

    // Complexity multiplier
    baseTime *= (1 + detection.complexity);

    // Operation type multipliers
    const operationMultipliers: Record<string, number> = {
      analysis: 1.2,
      creation: 1.5,
      implementation: 2.0,
      modification: 1.3,
      debugging: 1.8,
      iterative: 2.5
    };

    for (const operation of detection.operationType) {
      const multiplier = operationMultipliers[operation] || 1.0;
      baseTime *= multiplier;
    }

    return Math.round(baseTime);
  }

  /**
   * Determine resource level based on usage
   */
  private determineResourceLevel(totalTokens: number, totalTime: number): ResourceEstimate['resourceLevel'] {
    // Token-based thresholds
    if (totalTokens > 40000) return 'critical';
    if (totalTokens > 30000) return 'red';
    if (totalTokens > 20000) return 'orange';
    if (totalTokens > 10000) return 'yellow';
    return 'green';
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizations(totalTokens: number, resourceLevel: ResourceEstimate['resourceLevel']): string[] {
    const optimizations: string[] = [];

    if (resourceLevel === 'critical' || resourceLevel === 'red') {
      optimizations.push('Enable ultra-compressed mode (--uc)');
      optimizations.push('Use delegation to distribute workload');
      optimizations.push('Consider breaking task into smaller pieces');
    }

    if (resourceLevel === 'orange') {
      optimizations.push('Consider enabling compression');
      optimizations.push('Monitor resource usage during execution');
    }

    if (totalTokens > 25000) {
      optimizations.push('Enable caching for repeated operations');
      optimizations.push('Use batch processing where possible');
    }

    return optimizations;
  }

  /**
   * Execute the orchestrated plan
   */
  async execute(result: OrchestrationResult): Promise<void> {
    console.log('🚀 Starting execution...');
    
    try {
      if (result.executionPlan.mode === 'wave' && result.waveOrchestration) {
        await this.waveOrchestrator.executeOrchestrationPlan(result.waveOrchestration);
      } else {
        await this.executeTraditionalPlan(result.executionPlan);
      }
      
      console.log('✅ Execution completed successfully');
    } catch (error) {
      console.error('❌ Execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute traditional (non-wave) plan
   */
  private async executeTraditionalPlan(plan: ExecutionPlan): Promise<void> {
    for (const step of plan.steps) {
      console.log(`Executing step: ${step.name}`);
      // This would integrate with the actual tool execution system
      // Execute step with specified tools, personas, and flags
    }
  }

  /**
   * Get orchestrator status and metrics
   */
  getStatus(): any {
    return {
      detectionEngine: 'active',
      routingIntelligence: 'active',
      waveOrchestrator: 'active',
      performanceMonitor: this.performanceMonitor.getMetrics(),
      resourceLevel: this.detectionEngine.getCurrentResourceLevel()
    };
  }
}

/**
 * Performance monitoring for the orchestrator
 */
class PerformanceMonitor {
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageDetectionTime: 0,
    averageRoutingTime: 0,
    averageExecutionTime: 0,
    resourceUsage: {
      current: 0,
      peak: 0,
      average: 0
    }
  };

  recordRequest(success: boolean, detectionTime: number, routingTime: number, executionTime: number): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update averages
    this.updateAverage('averageDetectionTime', detectionTime);
    this.updateAverage('averageRoutingTime', routingTime);
    this.updateAverage('averageExecutionTime', executionTime);
  }

  private updateAverage(metric: keyof typeof this.metrics, newValue: number): void {
    const currentAverage = this.metrics[metric] as number;
    const totalRequests = this.metrics.totalRequests;
    
    this.metrics[metric] = ((currentAverage * (totalRequests - 1)) + newValue) / totalRequests;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.successfulRequests / this.metrics.totalRequests;
  }
}

// Export singleton instance
export const orchestrator = new SuperClaudeOrchestrator();