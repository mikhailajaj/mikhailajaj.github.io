// Button component migration mapping
// Maps old button components to Universal Button configurations

export const buttonMigrationMap = {
  // Basic buttons
  'Button': {
    component: 'UniversalButton',
    defaultProps: { variant: 'primary', size: 'md' }
  },
  'AccessibleButton': {
    component: 'UniversalButton', 
    defaultProps: { variant: 'primary', size: 'md' },
    features: ['Enhanced accessibility built-in']
  },
  
  // Interactive buttons
  'InteractiveMagicButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'magic', size: 'lg', animation: 'hover' }
  },
  'AnimatedButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'interactive', animation: 'hover' }
  },
  
  // Specialized buttons
  'TouchOptimizedButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'primary', size: 'lg' },
    notes: 'Touch optimization built into Universal Button'
  },
  'ShareButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'outline', size: 'sm' }
  },
  'CleanButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'ghost', size: 'md' }
  },
  
  // Theme buttons
  'EnhancedThemeButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'outline', size: 'md' },
    features: ['Domain color integration via domainColor prop']
  },
  
  // Magic buttons
  'MagicButton': {
    component: 'UniversalButton',
    defaultProps: { variant: 'magic', size: 'lg' }
  }
};

// Usage examples for migration
export const migrationExamples = {
  before: {
    InteractiveMagicButton: '<InteractiveMagicButton title="Get Started" icon={<FaRocket />} />',
    AccessibleButton: '<AccessibleButton variant="primary" ariaLabel="Submit form">Submit</AccessibleButton>',
    AnimatedButton: '<AnimatedButton>Click me</AnimatedButton>'
  },
  after: {
    InteractiveMagicButton: '<UniversalButton variant="magic" size="lg" animation="hover" rightIcon={<FaRocket />}>Get Started</UniversalButton>',
    AccessibleButton: '<UniversalButton variant="primary" ariaLabel="Submit form">Submit</UniversalButton>',
    AnimatedButton: '<UniversalButton variant="interactive" animation="hover">Click me</UniversalButton>'
  }
};
