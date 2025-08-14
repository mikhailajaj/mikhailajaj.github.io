/**
 * Theme Persistence System
 * 
 * Handles theme state persistence with localStorage and SSR compatibility.
 * Provides robust storage with error handling, migration, and cleanup.
 */

import {
  type ThemeMode,
  type ThemeState,
  type UserThemePreferences,
  type ThemeCustomizations,
} from '../core/types';
import { type Domain } from '@/lib/constants/domains';

/**
 * Persistence configuration interface
 */
interface PersistenceConfig {
  keyPrefix: string;
  version: string;
  enableCompression: boolean;
  enableEncryption: boolean;
  maxStorageSize: number; // in bytes
  enableMigration: boolean;
}

/**
 * Persisted theme data interface
 */
interface PersistedThemeData {
  version: string;
  timestamp: number;
  data: {
    mode: ThemeMode;
    domain: Domain;
    preferences: UserThemePreferences;
    customizations: ThemeCustomizations;
  };
  metadata: {
    userAgent: string;
    origin: string;
    sessionId: string;
  };
}

/**
 * Storage adapter interface
 */
interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  length: number;
  key(index: number): string | null;
}

/**
 * Theme Persistence Manager
 * 
 * Manages theme state persistence with:
 * - SSR compatibility
 * - Error handling and recovery
 * - Data migration
 * - Storage optimization
 * - Security considerations
 */
export class ThemePersistenceManager {
  private config: PersistenceConfig;
  private storage: StorageAdapter;
  private isAvailable = false;
  private sessionId: string;

  constructor(config?: Partial<PersistenceConfig>, storage?: StorageAdapter) {
    this.config = {
      keyPrefix: 'theme-engine',
      version: '1.0.0',
      enableCompression: false,
      enableEncryption: false,
      maxStorageSize: 1024 * 1024, // 1MB
      enableMigration: true,
      ...config,
    };

    this.storage = storage || this.createStorageAdapter();
    this.sessionId = this.generateSessionId();
    this.isAvailable = this.checkStorageAvailability();

    if (this.isAvailable && this.config.enableMigration) {
      this.migrateOldData();
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Check if persistence is available
   */
  isStorageAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Save theme state to storage
   */
  async saveThemeState(state: Partial<ThemeState>): Promise<void> {
    if (!this.isAvailable) {
      console.warn('[ThemePersistence] Storage not available, skipping save');
      return;
    }

    try {
      const persistedData: PersistedThemeData = {
        version: this.config.version,
        timestamp: Date.now(),
        data: {
          mode: state.mode || 'system',
          domain: state.domain || 'full-stack',
          preferences: state.preferences || this.getDefaultPreferences(),
          customizations: state.customizations || {},
        },
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          sessionId: this.sessionId,
        },
      };

      const serialized = await this.serialize(persistedData);
      const key = this.getStorageKey('state');

      // Check storage size limit
      if (serialized.length > this.config.maxStorageSize) {
        throw new Error('Data exceeds maximum storage size');
      }

      this.storage.setItem(key, serialized);

      // Save individual components for faster access
      await this.saveIndividualComponents(persistedData.data);

    } catch (error) {
      console.error('[ThemePersistence] Failed to save theme state:', error);
      throw error;
    }
  }

  /**
   * Load theme state from storage
   */
  async loadThemeState(): Promise<Partial<ThemeState> | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const key = this.getStorageKey('state');
      const serialized = this.storage.getItem(key);

      if (!serialized) {
        return null;
      }

      const persistedData = await this.deserialize(serialized) as PersistedThemeData;

      // Validate version and migrate if necessary
      if (this.config.enableMigration && persistedData.version !== this.config.version) {
        const migrated = await this.migrateData(persistedData);
        if (migrated) {
          await this.saveThemeState(migrated);
          return migrated;
        }
      }

      // Validate data integrity
      if (!this.validatePersistedData(persistedData)) {
        console.warn('[ThemePersistence] Invalid persisted data, removing');
        this.removeThemeState();
        return null;
      }

      return persistedData.data;

    } catch (error) {
      console.error('[ThemePersistence] Failed to load theme state:', error);
      // Clean up corrupted data
      this.removeThemeState();
      return null;
    }
  }

  /**
   * Save theme mode only
   */
  async saveMode(mode: ThemeMode): Promise<void> {
    if (!this.isAvailable) return;

    try {
      const key = this.getStorageKey('mode');
      this.storage.setItem(key, mode);
    } catch (error) {
      console.error('[ThemePersistence] Failed to save mode:', error);
    }
  }

  /**
   * Load theme mode only
   */
  loadMode(): ThemeMode | null {
    if (!this.isAvailable) return null;

    try {
      const key = this.getStorageKey('mode');
      const mode = this.storage.getItem(key) as ThemeMode;
      
      if (mode && ['light', 'dark', 'system'].includes(mode)) {
        return mode;
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to load mode:', error);
    }

    return null;
  }

  /**
   * Save domain only
   */
  async saveDomain(domain: Domain): Promise<void> {
    if (!this.isAvailable) return;

    try {
      const key = this.getStorageKey('domain');
      this.storage.setItem(key, domain);
    } catch (error) {
      console.error('[ThemePersistence] Failed to save domain:', error);
    }
  }

  /**
   * Load domain only
   */
  loadDomain(): Domain | null {
    if (!this.isAvailable) return null;

    try {
      const key = this.getStorageKey('domain');
      const domain = this.storage.getItem(key) as Domain;
      
      const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
      if (domain && validDomains.includes(domain)) {
        return domain;
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to load domain:', error);
    }

    return null;
  }

  /**
   * Save user preferences only
   */
  async savePreferences(preferences: UserThemePreferences): Promise<void> {
    if (!this.isAvailable) return;

    try {
      const key = this.getStorageKey('preferences');
      const serialized = await this.serialize(preferences);
      this.storage.setItem(key, serialized);
    } catch (error) {
      console.error('[ThemePersistence] Failed to save preferences:', error);
    }
  }

  /**
   * Load user preferences only
   */
  async loadPreferences(): Promise<UserThemePreferences | null> {
    if (!this.isAvailable) return null;

    try {
      const key = this.getStorageKey('preferences');
      const serialized = this.storage.getItem(key);
      
      if (serialized) {
        return await this.deserialize(serialized) as UserThemePreferences;
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to load preferences:', error);
    }

    return null;
  }

  /**
   * Save customizations only
   */
  async saveCustomizations(customizations: ThemeCustomizations): Promise<void> {
    if (!this.isAvailable) return;

    try {
      const key = this.getStorageKey('customizations');
      const serialized = await this.serialize(customizations);
      this.storage.setItem(key, serialized);
    } catch (error) {
      console.error('[ThemePersistence] Failed to save customizations:', error);
    }
  }

  /**
   * Load customizations only
   */
  async loadCustomizations(): Promise<ThemeCustomizations | null> {
    if (!this.isAvailable) return null;

    try {
      const key = this.getStorageKey('customizations');
      const serialized = this.storage.getItem(key);
      
      if (serialized) {
        return await this.deserialize(serialized) as ThemeCustomizations;
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to load customizations:', error);
    }

    return null;
  }

  /**
   * Remove theme state from storage
   */
  removeThemeState(): void {
    if (!this.isAvailable) return;

    try {
      const keys = ['state', 'mode', 'domain', 'preferences', 'customizations'];
      keys.forEach(key => {
        this.storage.removeItem(this.getStorageKey(key));
      });
    } catch (error) {
      console.error('[ThemePersistence] Failed to remove theme state:', error);
    }
  }

  /**
   * Clear all theme-related storage
   */
  clearStorage(): void {
    if (!this.isAvailable) return;

    try {
      // Remove all keys with our prefix
      for (let i = this.storage.length - 1; i >= 0; i--) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.config.keyPrefix)) {
          this.storage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to clear storage:', error);
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo() {
    if (!this.isAvailable) {
      return {
        available: false,
        totalSize: 0,
        usedSize: 0,
        itemCount: 0,
      };
    }

    let totalSize = 0;
    let itemCount = 0;

    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.config.keyPrefix)) {
          const value = this.storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
            itemCount++;
          }
        }
      }
    } catch (error) {
      console.error('[ThemePersistence] Failed to get storage info:', error);
    }

    return {
      available: true,
      totalSize,
      usedSize: totalSize,
      itemCount,
      maxSize: this.config.maxStorageSize,
      utilization: (totalSize / this.config.maxStorageSize) * 100,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Create storage adapter
   */
  private createStorageAdapter(): StorageAdapter {
    // Try localStorage first
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }

    // Fallback to memory storage for SSR
    return new MemoryStorageAdapter();
  }

  /**
   * Check if storage is available
   */
  private checkStorageAvailability(): boolean {
    try {
      const testKey = `${this.config.keyPrefix}-test`;
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate storage key
   */
  private getStorageKey(suffix: string): string {
    return `${this.config.keyPrefix}-${suffix}`;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Serialize data
   */
  private async serialize(data: any): Promise<string> {
    let serialized = JSON.stringify(data);

    // Apply compression if enabled
    if (this.config.enableCompression) {
      serialized = await this.compress(serialized);
    }

    // Apply encryption if enabled
    if (this.config.enableEncryption) {
      serialized = await this.encrypt(serialized);
    }

    return serialized;
  }

  /**
   * Deserialize data
   */
  private async deserialize(serialized: string): Promise<any> {
    let data = serialized;

    // Apply decryption if enabled
    if (this.config.enableEncryption) {
      data = await this.decrypt(data);
    }

    // Apply decompression if enabled
    if (this.config.enableCompression) {
      data = await this.decompress(data);
    }

    return JSON.parse(data);
  }

  /**
   * Compress data (placeholder implementation)
   */
  private async compress(data: string): Promise<string> {
    // In a real implementation, you would use a compression library
    return data;
  }

  /**
   * Decompress data (placeholder implementation)
   */
  private async decompress(data: string): Promise<string> {
    // In a real implementation, you would use a compression library
    return data;
  }

  /**
   * Encrypt data (placeholder implementation)
   */
  private async encrypt(data: string): Promise<string> {
    // In a real implementation, you would use proper encryption
    return btoa(data);
  }

  /**
   * Decrypt data (placeholder implementation)
   */
  private async decrypt(data: string): Promise<string> {
    // In a real implementation, you would use proper decryption
    return atob(data);
  }

  /**
   * Save individual components for faster access
   */
  private async saveIndividualComponents(data: PersistedThemeData['data']): Promise<void> {
    await Promise.all([
      this.saveMode(data.mode),
      this.saveDomain(data.domain),
      this.savePreferences(data.preferences),
      this.saveCustomizations(data.customizations),
    ]);
  }

  /**
   * Validate persisted data
   */
  private validatePersistedData(data: PersistedThemeData): boolean {
    try {
      // Check required fields
      if (!data.version || !data.timestamp || !data.data) {
        return false;
      }

      // Check data structure
      const { mode, domain, preferences, customizations } = data.data;
      
      if (!mode || !domain || !preferences || customizations === undefined) {
        return false;
      }

      // Validate values
      const validModes = ['light', 'dark', 'system'];
      const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];

      if (!validModes.includes(mode) || !validDomains.includes(domain)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserThemePreferences {
    return {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      customizations: {},
      autoDetectPreferences: true,
    };
  }

  /**
   * Migrate old data format
   */
  private async migrateData(data: PersistedThemeData): Promise<Partial<ThemeState> | null> {
    try {
      // Migration logic would go here
      // For now, just return the data as-is
      return data.data;
    } catch (error) {
      console.error('[ThemePersistence] Failed to migrate data:', error);
      return null;
    }
  }

  /**
   * Migrate old data from previous versions
   */
  private migrateOldData(): void {
    try {
      // Check for old theme data and migrate
      const oldKeys = ['theme-mode', 'domain-theme', 'user-preferences'];
      
      oldKeys.forEach(oldKey => {
        const oldValue = this.storage.getItem(oldKey);
        if (oldValue) {
          // Migration logic would go here
          this.storage.removeItem(oldKey);
        }
      });
    } catch (error) {
      console.error('[ThemePersistence] Failed to migrate old data:', error);
    }
  }
}

/**
 * Memory Storage Adapter for SSR compatibility
 */
class MemoryStorageAdapter implements StorageAdapter {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] || null;
  }
}

// Export singleton instance
export const themePersistenceManager = new ThemePersistenceManager();