// Layout component migration mapping
// Maps old layout components to Universal Layout configurations

export const layoutMigrationMap = {
  'MainLayout': {
    component: 'UniversalLayout',
    defaultProps: { 
      layout: 'main',
      showNavigation: true,
      showFooter: true,
      maxWidth: 'full',
      padding: 'md'
    }
  },
  'ServiceLayout': {
    component: 'UniversalLayout',
    defaultProps: { 
      layout: 'service',
      showNavigation: true,
      showFooter: true,
      maxWidth: '2xl',
      padding: 'lg'
    }
  },
  'DocumentationLayout': {
    component: 'UniversalLayout',
    defaultProps: { 
      layout: 'documentation',
      showNavigation: true,
      showFooter: false,
      maxWidth: 'xl',
      padding: 'lg'
    }
  }
};

// Usage examples for migration
export const layoutMigrationExamples = {
  before: {
    MainLayout: '<MainLayout domain="full-stack">{children}</MainLayout>',
    ServiceLayout: '<ServiceLayout>{children}</ServiceLayout>',
    DocumentationLayout: '<DocumentationLayout>{children}</DocumentationLayout>'
  },
  after: {
    MainLayout: '<UniversalLayout layout="main" domain="full-stack">{children}</UniversalLayout>',
    ServiceLayout: '<UniversalLayout layout="service">{children}</UniversalLayout>',
    DocumentationLayout: '<UniversalLayout layout="documentation">{children}</UniversalLayout>'
  }
};
