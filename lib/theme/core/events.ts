/**
 * Theme Event System
 * 
 * Provides event-driven theme updates with performance optimization
 * and type-safe event handling for the unified theme system.
 */

import {
  type ThemeEvent,
  type ThemeEventType,
  type ThemeChangeCallback,
  type UnsubscribeFunction,
} from './types';

/**
 * Theme Event Emitter
 * 
 * Centralized event system for theme changes with:
 * - Type-safe event handling
 * - Performance optimization
 * - Event batching and debouncing
 * - Error handling and recovery
 */
export class ThemeEventEmitter {
  private listeners: Map<ThemeEventType, Set<ThemeChangeCallback>> = new Map();
  private globalListeners: Set<ThemeChangeCallback> = new Set();
  private eventQueue: ThemeEvent[] = [];
  private isProcessingEvents = false;
  private batchTimeout: NodeJS.Timeout | null = null;
  private debugMode = false;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
    
    // Initialize event type maps
    const eventTypes: ThemeEventType[] = ['theme-changed', 'domain-changed', 'mode-changed', 'preferences-changed'];
    eventTypes.forEach(type => {
      this.listeners.set(type, new Set());
    });
  }

  /**
   * Subscribe to specific theme event type
   */
  on(eventType: ThemeEventType, callback: ThemeChangeCallback): UnsubscribeFunction {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.add(callback);
    }

    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Subscribe to all theme events
   */
  onAll(callback: ThemeChangeCallback): UnsubscribeFunction {
    this.globalListeners.add(callback);

    return () => {
      this.globalListeners.delete(callback);
    };
  }

  /**
   * Subscribe to specific event type once
   */
  once(eventType: ThemeEventType, callback: ThemeChangeCallback): UnsubscribeFunction {
    const wrappedCallback: ThemeChangeCallback = (event) => {
      callback(event);
      unsubscribe();
    };

    const unsubscribe = this.on(eventType, wrappedCallback);
    return unsubscribe;
  }

  /**
   * Emit theme event
   */
  emit(event: ThemeEvent): void {
    if (this.debugMode) {
      console.log('[ThemeEventEmitter] Emitting event:', event);
    }

    // Add to queue for batched processing
    this.eventQueue.push(event);

    // Process events with debouncing
    this.scheduleEventProcessing();
  }

  /**
   * Emit multiple events in batch
   */
  emitBatch(events: ThemeEvent[]): void {
    this.eventQueue.push(...events);
    this.scheduleEventProcessing();
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.forEach(listeners => listeners.clear());
    this.globalListeners.clear();
    this.eventQueue.length = 0;
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  /**
   * Get listener count for debugging
   */
  getListenerCount(eventType?: ThemeEventType): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size || 0;
    }
    
    let total = this.globalListeners.size;
    this.listeners.forEach(listeners => {
      total += listeners.size;
    });
    
    return total;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Schedule event processing with debouncing
   */
  private scheduleEventProcessing(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processEventQueue();
    }, 16); // ~60fps debouncing
  }

  /**
   * Process queued events
   */
  private processEventQueue(): void {
    if (this.isProcessingEvents || this.eventQueue.length === 0) return;

    this.isProcessingEvents = true;
    const events = [...this.eventQueue];
    this.eventQueue.length = 0;

    try {
      // Group events by type for optimization
      const eventsByType = this.groupEventsByType(events);

      // Process each event type
      for (const [eventType, typeEvents] of eventsByType.entries()) {
        this.processEventType(eventType, typeEvents);
      }

      // Process global listeners with the latest event of each type
      if (this.globalListeners.size > 0) {
        const latestEvents = this.getLatestEventsByType(events);
        latestEvents.forEach(event => {
          this.notifyGlobalListeners(event);
        });
      }
    } catch (error) {
      console.error('[ThemeEventEmitter] Error processing events:', error);
    } finally {
      this.isProcessingEvents = false;
      this.batchTimeout = null;
    }
  }

  /**
   * Group events by type
   */
  private groupEventsByType(events: ThemeEvent[]): Map<ThemeEventType, ThemeEvent[]> {
    const grouped = new Map<ThemeEventType, ThemeEvent[]>();

    events.forEach(event => {
      if (!grouped.has(event.type)) {
        grouped.set(event.type, []);
      }
      grouped.get(event.type)!.push(event);
    });

    return grouped;
  }

  /**
   * Get latest event for each type
   */
  private getLatestEventsByType(events: ThemeEvent[]): ThemeEvent[] {
    const latestByType = new Map<ThemeEventType, ThemeEvent>();

    events.forEach(event => {
      const existing = latestByType.get(event.type);
      if (!existing || event.payload.metadata!.timestamp > existing.payload.metadata!.timestamp) {
        latestByType.set(event.type, event);
      }
    });

    return Array.from(latestByType.values());
  }

  /**
   * Process events for specific type
   */
  private processEventType(eventType: ThemeEventType, events: ThemeEvent[]): void {
    const listeners = this.listeners.get(eventType);
    if (!listeners || listeners.size === 0) return;

    // For performance, only notify with the latest event of this type
    const latestEvent = events[events.length - 1];

    this.notifyListeners(listeners, latestEvent);
  }

  /**
   * Notify specific listeners
   */
  private notifyListeners(listeners: Set<ThemeChangeCallback>, event: ThemeEvent): void {
    listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('[ThemeEventEmitter] Listener error:', error);
        
        // Remove problematic listener to prevent future errors
        listeners.delete(callback);
      }
    });
  }

  /**
   * Notify global listeners
   */
  private notifyGlobalListeners(event: ThemeEvent): void {
    this.notifyListeners(this.globalListeners, event);
  }
}

/**
 * Theme Event Utilities
 */
export class ThemeEventUtils {
  /**
   * Create theme changed event
   */
  static createThemeChangedEvent(
    previous: any,
    current: any,
    source = 'unknown'
  ): ThemeEvent {
    return {
      type: 'theme-changed',
      payload: {
        previous,
        current,
        metadata: {
          source,
          timestamp: Date.now(),
        },
      },
    };
  }

  /**
   * Create domain changed event
   */
  static createDomainChangedEvent(
    previousDomain: string,
    currentDomain: string,
    source = 'unknown'
  ): ThemeEvent {
    return {
      type: 'domain-changed',
      payload: {
        previous: { domain: previousDomain },
        current: { domain: currentDomain },
        metadata: {
          source,
          timestamp: Date.now(),
        },
      },
    };
  }

  /**
   * Create mode changed event
   */
  static createModeChangedEvent(
    previousMode: string,
    currentMode: string,
    source = 'unknown'
  ): ThemeEvent {
    return {
      type: 'mode-changed',
      payload: {
        previous: { mode: previousMode },
        current: { mode: currentMode },
        metadata: {
          source,
          timestamp: Date.now(),
        },
      },
    };
  }

  /**
   * Create preferences changed event
   */
  static createPreferencesChangedEvent(
    previousPreferences: any,
    currentPreferences: any,
    source = 'unknown'
  ): ThemeEvent {
    return {
      type: 'preferences-changed',
      payload: {
        previous: { preferences: previousPreferences },
        current: { preferences: currentPreferences },
        metadata: {
          source,
          timestamp: Date.now(),
        },
      },
    };
  }

  /**
   * Check if event is of specific type
   */
  static isEventType(event: ThemeEvent, type: ThemeEventType): boolean {
    return event.type === type;
  }

  /**
   * Extract event metadata
   */
  static getEventMetadata(event: ThemeEvent) {
    return event.payload.metadata || {
      source: 'unknown',
      timestamp: Date.now(),
    };
  }

  /**
   * Check if event is recent (within last second)
   */
  static isRecentEvent(event: ThemeEvent, maxAge = 1000): boolean {
    const metadata = this.getEventMetadata(event);
    return Date.now() - metadata.timestamp < maxAge;
  }

  /**
   * Merge multiple events of same type
   */
  static mergeEvents(events: ThemeEvent[]): ThemeEvent | null {
    if (events.length === 0) return null;
    if (events.length === 1) return events[0];

    // Use the latest event as base
    const latest = events[events.length - 1];
    
    // Merge payloads
    const mergedPayload = {
      ...latest.payload,
      metadata: {
        ...latest.payload.metadata,
        source: 'merged',
        mergedCount: events.length,
      },
    };

    return {
      ...latest,
      payload: mergedPayload,
    };
  }
}

/**
 * Performance monitoring for theme events
 */
export class ThemeEventPerformanceMonitor {
  private eventCounts: Map<ThemeEventType, number> = new Map();
  private eventTimes: Map<ThemeEventType, number[]> = new Map();
  private startTime = Date.now();

  /**
   * Record event for performance tracking
   */
  recordEvent(event: ThemeEvent): void {
    const type = event.type;
    const timestamp = event.payload.metadata?.timestamp || Date.now();

    // Update count
    this.eventCounts.set(type, (this.eventCounts.get(type) || 0) + 1);

    // Update times
    if (!this.eventTimes.has(type)) {
      this.eventTimes.set(type, []);
    }
    this.eventTimes.get(type)!.push(timestamp);

    // Keep only recent times (last 100 events)
    const times = this.eventTimes.get(type)!;
    if (times.length > 100) {
      times.splice(0, times.length - 100);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const metrics: Record<string, any> = {};

    this.eventCounts.forEach((count, type) => {
      const times = this.eventTimes.get(type) || [];
      const recentTimes = times.filter(time => Date.now() - time < 60000); // Last minute

      metrics[type] = {
        totalCount: count,
        recentCount: recentTimes.length,
        averageFrequency: recentTimes.length / 60, // Events per second
        lastEventTime: times[times.length - 1] || 0,
      };
    });

    return {
      uptime: Date.now() - this.startTime,
      eventTypes: metrics,
      totalEvents: Array.from(this.eventCounts.values()).reduce((sum, count) => sum + count, 0),
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.eventCounts.clear();
    this.eventTimes.clear();
    this.startTime = Date.now();
  }
}

// Export singleton instances
export const themeEventEmitter = new ThemeEventEmitter();
export const themeEventPerformanceMonitor = new ThemeEventPerformanceMonitor();