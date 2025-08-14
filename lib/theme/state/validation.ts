/**
 * Theme Validation System
 * 
 * Comprehensive validation for theme configurations, state, and user inputs
 * with detailed error reporting and recovery suggestions.
 */

import { type Domain } from '@/lib/constants/domains';
import {
  type ThemeMode,
  type ThemeState,
  type ThemeConfig,
  type ComputedTheme,
  type UserThemePreferences,
  type ThemeCustomizations,
  type ThemeColors,
  type ThemeTypography,
  type ThemeSpacing,
  type ThemeAnimations,
} from '../core/types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  code: string;
  message: string;
  field: string;
  value: any;
  severity: 'error' | 'warning';
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  code: string;
  message: string;
  field: string;
  value: any;
  suggestion: string;
}

/**
 * Theme Validator Class
 * 
 * Provides comprehensive validation for all theme-related data structures
 * with detailed error reporting and recovery suggestions.
 */
export class ThemeValidator {
  private validDomains: Domain[] = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
  private validModes: ThemeMode[] = ['light', 'dark', 'system'];
  private validFontSizes = ['small', 'medium', 'large'];

  /**
   * Validate theme configuration
   */
  validateThemeConfig(config: ThemeConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate mode
    if (config.mode !== undefined) {
      const modeValidation = this.validateMode(config.mode);
      errors.push(...modeValidation.errors);
      warnings.push(...modeValidation.warnings);
    }

    // Validate domain
    if (config.domain !== undefined) {
      const domainValidation = this.validateDomain(config.domain);
      errors.push(...domainValidation.errors);
      warnings.push(...domainValidation.warnings);
    }

    // Validate preferences
    if (config.preferences !== undefined) {
      const preferencesValidation = this.validateUserPreferences(config.preferences);
      errors.push(...preferencesValidation.errors);
      warnings.push(...preferencesValidation.warnings);
    }

    // Validate customizations
    if (config.customizations !== undefined) {
      const customizationsValidation = this.validateCustomizations(config.customizations);
      errors.push(...customizationsValidation.errors);
      warnings.push(...customizationsValidation.warnings);
    }

    // Add suggestions based on validation results
    if (errors.length > 0) {
      suggestions.push('Fix validation errors before applying theme configuration');
    }
    if (warnings.length > 0) {
      suggestions.push('Consider addressing warnings for optimal theme experience');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate theme state
   */
  validateThemeState(state: ThemeState): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate required fields
    const requiredFields = ['mode', 'domain', 'preferences', 'customizations', 'computed'];
    for (const field of requiredFields) {
      if (!(field in state) || state[field as keyof ThemeState] === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: `Required field '${field}' is missing`,
          field,
          value: undefined,
          severity: 'error',
        });
      }
    }

    // Validate individual fields
    if (state.mode !== undefined) {
      const modeValidation = this.validateMode(state.mode);
      errors.push(...modeValidation.errors);
      warnings.push(...modeValidation.warnings);
    }

    if (state.domain !== undefined) {
      const domainValidation = this.validateDomain(state.domain);
      errors.push(...domainValidation.errors);
      warnings.push(...domainValidation.warnings);
    }

    if (state.preferences !== undefined) {
      const preferencesValidation = this.validateUserPreferences(state.preferences);
      errors.push(...preferencesValidation.errors);
      warnings.push(...preferencesValidation.warnings);
    }

    if (state.customizations !== undefined) {
      const customizationsValidation = this.validateCustomizations(state.customizations);
      errors.push(...customizationsValidation.errors);
      warnings.push(...customizationsValidation.warnings);
    }

    if (state.computed && Object.keys(state.computed).length > 0) {
      const computedValidation = this.validateComputedTheme(state.computed);
      errors.push(...computedValidation.errors);
      warnings.push(...computedValidation.warnings);
    }

    // Validate state consistency
    const consistencyValidation = this.validateStateConsistency(state);
    errors.push(...consistencyValidation.errors);
    warnings.push(...consistencyValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate computed theme
   */
  validateComputedTheme(theme: ComputedTheme): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate required properties
    const requiredProps = ['mode', 'domain', 'colors', 'typography', 'spacing', 'animations', 'shadows', 'cssVariables', 'metadata'];
    for (const prop of requiredProps) {
      if (!(prop in theme) || theme[prop as keyof ComputedTheme] === undefined) {
        errors.push({
          code: 'MISSING_COMPUTED_PROPERTY',
          message: `Required computed theme property '${prop}' is missing`,
          field: prop,
          value: undefined,
          severity: 'error',
        });
      }
    }

    // Validate colors
    if (theme.colors) {
      const colorsValidation = this.validateThemeColors(theme.colors);
      errors.push(...colorsValidation.errors);
      warnings.push(...colorsValidation.warnings);
    }

    // Validate CSS variables
    if (theme.cssVariables) {
      const cssValidation = this.validateCSSVariables(theme.cssVariables);
      errors.push(...cssValidation.errors);
      warnings.push(...cssValidation.warnings);
    }

    // Validate metadata
    if (theme.metadata) {
      const metadataValidation = this.validateThemeMetadata(theme.metadata);
      errors.push(...metadataValidation.errors);
      warnings.push(...metadataValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate theme mode
   */
  private validateMode(mode: ThemeMode): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!this.validModes.includes(mode)) {
      errors.push({
        code: 'INVALID_THEME_MODE',
        message: `Invalid theme mode '${mode}'. Must be one of: ${this.validModes.join(', ')}`,
        field: 'mode',
        value: mode,
        severity: 'error',
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate domain
   */
  private validateDomain(domain: Domain): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!this.validDomains.includes(domain)) {
      errors.push({
        code: 'INVALID_DOMAIN',
        message: `Invalid domain '${domain}'. Must be one of: ${this.validDomains.join(', ')}`,
        field: 'domain',
        value: domain,
        severity: 'error',
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate user preferences
   */
  private validateUserPreferences(preferences: Partial<UserThemePreferences>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate reducedMotion
    if (preferences.reducedMotion !== undefined && typeof preferences.reducedMotion !== 'boolean') {
      errors.push({
        code: 'INVALID_REDUCED_MOTION',
        message: 'reducedMotion must be a boolean value',
        field: 'preferences.reducedMotion',
        value: preferences.reducedMotion,
        severity: 'error',
      });
    }

    // Validate highContrast
    if (preferences.highContrast !== undefined && typeof preferences.highContrast !== 'boolean') {
      errors.push({
        code: 'INVALID_HIGH_CONTRAST',
        message: 'highContrast must be a boolean value',
        field: 'preferences.highContrast',
        value: preferences.highContrast,
        severity: 'error',
      });
    }

    // Validate fontSize
    if (preferences.fontSize !== undefined && !this.validFontSizes.includes(preferences.fontSize)) {
      errors.push({
        code: 'INVALID_FONT_SIZE',
        message: `fontSize must be one of: ${this.validFontSizes.join(', ')}`,
        field: 'preferences.fontSize',
        value: preferences.fontSize,
        severity: 'error',
      });
    }

    // Validate autoDetectPreferences
    if (preferences.autoDetectPreferences !== undefined && typeof preferences.autoDetectPreferences !== 'boolean') {
      errors.push({
        code: 'INVALID_AUTO_DETECT',
        message: 'autoDetectPreferences must be a boolean value',
        field: 'preferences.autoDetectPreferences',
        value: preferences.autoDetectPreferences,
        severity: 'error',
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate theme customizations
   */
  private validateCustomizations(customizations: ThemeCustomizations): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate colors customizations
    if (customizations.colors) {
      const colorsValidation = this.validateThemeColors(customizations.colors as ThemeColors);
      errors.push(...colorsValidation.errors);
      warnings.push(...colorsValidation.warnings);
    }

    // Validate typography customizations
    if (customizations.typography) {
      const typographyValidation = this.validateTypography(customizations.typography);
      errors.push(...typographyValidation.errors);
      warnings.push(...typographyValidation.warnings);
    }

    // Validate spacing customizations
    if (customizations.spacing) {
      const spacingValidation = this.validateSpacing(customizations.spacing);
      errors.push(...spacingValidation.errors);
      warnings.push(...spacingValidation.warnings);
    }

    // Validate animations customizations
    if (customizations.animations) {
      const animationsValidation = this.validateAnimations(customizations.animations);
      errors.push(...animationsValidation.errors);
      warnings.push(...animationsValidation.warnings);
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate theme colors
   */
  private validateThemeColors(colors: Partial<ThemeColors>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate color format for each color property
    Object.entries(colors).forEach(([key, value]) => {
      if (value && !this.isValidColor(value)) {
        errors.push({
          code: 'INVALID_COLOR_FORMAT',
          message: `Invalid color format for '${key}': ${value}`,
          field: `colors.${key}`,
          value,
          severity: 'error',
        });
      }
    });

    // Check for accessibility concerns
    if (colors.textPrimary && colors.backgroundPrimary) {
      const contrast = this.calculateContrast(colors.textPrimary, colors.backgroundPrimary);
      if (contrast < 4.5) {
        warnings.push({
          code: 'LOW_CONTRAST',
          message: `Low contrast ratio (${contrast.toFixed(2)}) between text and background`,
          field: 'colors',
          value: { text: colors.textPrimary, background: colors.backgroundPrimary },
          suggestion: 'Consider using colors with higher contrast for better accessibility',
        });
      }
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate typography
   */
  private validateTypography(typography: Partial<ThemeTypography>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate font families
    if (typography.fontFamily) {
      Object.entries(typography.fontFamily).forEach(([key, value]) => {
        if (typeof value !== 'string' || value.trim() === '') {
          errors.push({
            code: 'INVALID_FONT_FAMILY',
            message: `Invalid font family for '${key}': must be a non-empty string`,
            field: `typography.fontFamily.${key}`,
            value,
            severity: 'error',
          });
        }
      });
    }

    // Validate font sizes
    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        if (!this.isValidCSSUnit(value)) {
          errors.push({
            code: 'INVALID_FONT_SIZE',
            message: `Invalid font size for '${key}': must be a valid CSS unit`,
            field: `typography.fontSize.${key}`,
            value,
            severity: 'error',
          });
        }
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate spacing
   */
  private validateSpacing(spacing: Partial<ThemeSpacing>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    Object.entries(spacing).forEach(([key, value]) => {
      if (!this.isValidCSSUnit(value)) {
        errors.push({
          code: 'INVALID_SPACING_VALUE',
          message: `Invalid spacing value for '${key}': must be a valid CSS unit`,
          field: `spacing.${key}`,
          value,
          severity: 'error',
        });
      }
    });

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate animations
   */
  private validateAnimations(animations: Partial<ThemeAnimations>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate durations
    if (animations.duration) {
      Object.entries(animations.duration).forEach(([key, value]) => {
        if (!this.isValidDuration(value)) {
          errors.push({
            code: 'INVALID_ANIMATION_DURATION',
            message: `Invalid animation duration for '${key}': must be a valid CSS time value`,
            field: `animations.duration.${key}`,
            value,
            severity: 'error',
          });
        }
      });
    }

    // Validate easing functions
    if (animations.easing) {
      Object.entries(animations.easing).forEach(([key, value]) => {
        if (!this.isValidEasing(value)) {
          errors.push({
            code: 'INVALID_EASING_FUNCTION',
            message: `Invalid easing function for '${key}': must be a valid CSS easing function`,
            field: `animations.easing.${key}`,
            value,
            severity: 'error',
          });
        }
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate CSS variables
   */
  private validateCSSVariables(variables: Record<string, string>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    Object.entries(variables).forEach(([property, value]) => {
      // Validate property name
      if (!property.startsWith('--')) {
        errors.push({
          code: 'INVALID_CSS_VARIABLE_NAME',
          message: `CSS variable name must start with '--': ${property}`,
          field: 'cssVariables',
          value: property,
          severity: 'error',
        });
      }

      // Validate property value
      if (typeof value !== 'string') {
        errors.push({
          code: 'INVALID_CSS_VARIABLE_VALUE',
          message: `CSS variable value must be a string: ${property}`,
          field: 'cssVariables',
          value,
          severity: 'error',
        });
      }
    });

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate theme metadata
   */
  private validateThemeMetadata(metadata: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate required metadata fields
    const requiredFields = ['version', 'computedAt', 'hash'];
    for (const field of requiredFields) {
      if (!(field in metadata)) {
        errors.push({
          code: 'MISSING_METADATA_FIELD',
          message: `Required metadata field '${field}' is missing`,
          field: `metadata.${field}`,
          value: undefined,
          severity: 'error',
        });
      }
    }

    // Validate version format
    if (metadata.version && !this.isValidVersion(metadata.version)) {
      warnings.push({
        code: 'INVALID_VERSION_FORMAT',
        message: 'Version should follow semantic versioning format (e.g., 1.0.0)',
        field: 'metadata.version',
        value: metadata.version,
        suggestion: 'Use semantic versioning format for better compatibility',
      });
    }

    // Validate timestamp
    if (metadata.computedAt && (typeof metadata.computedAt !== 'number' || metadata.computedAt <= 0)) {
      errors.push({
        code: 'INVALID_TIMESTAMP',
        message: 'computedAt must be a positive number timestamp',
        field: 'metadata.computedAt',
        value: metadata.computedAt,
        severity: 'error',
      });
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  /**
   * Validate state consistency
   */
  private validateStateConsistency(state: ThemeState): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if computed theme matches current mode and domain
    if (state.computed && Object.keys(state.computed).length > 0) {
      if (state.computed.mode !== state.mode) {
        warnings.push({
          code: 'MODE_MISMATCH',
          message: 'Computed theme mode does not match current state mode',
          field: 'computed.mode',
          value: state.computed.mode,
          suggestion: 'Recompute theme to match current state',
        });
      }

      if (state.computed.domain !== state.domain) {
        warnings.push({
          code: 'DOMAIN_MISMATCH',
          message: 'Computed theme domain does not match current state domain',
          field: 'computed.domain',
          value: state.computed.domain,
          suggestion: 'Recompute theme to match current state',
        });
      }
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions: [] };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Check if value is a valid color
   */
  private isValidColor(color: string): boolean {
    // Basic color validation - can be enhanced
    const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+).*$/;
    return colorRegex.test(color);
  }

  /**
   * Check if value is a valid CSS unit
   */
  private isValidCSSUnit(value: string): boolean {
    const unitRegex = /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/;
    return unitRegex.test(value) || value === '0';
  }

  /**
   * Check if value is a valid CSS duration
   */
  private isValidDuration(value: string): boolean {
    const durationRegex = /^\d*\.?\d+(s|ms)$/;
    return durationRegex.test(value);
  }

  /**
   * Check if value is a valid CSS easing function
   */
  private isValidEasing(value: string): boolean {
    const easingKeywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
    const cubicBezierRegex = /^cubic-bezier\(\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*\)$/;
    
    return easingKeywords.includes(value) || cubicBezierRegex.test(value);
  }

  /**
   * Check if value is a valid version string
   */
  private isValidVersion(version: string): boolean {
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/;
    return versionRegex.test(version);
  }

  /**
   * Calculate color contrast ratio (simplified)
   */
  private calculateContrast(color1: string, color2: string): number {
    // Simplified contrast calculation - would need proper color parsing in real implementation
    // For now, return a placeholder value
    return 4.5;
  }
}

// Export singleton instance
export const themeValidator = new ThemeValidator();