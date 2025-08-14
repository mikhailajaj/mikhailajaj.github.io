// Navigation component migration mapping
// Maps old navigation components to Universal Navigation configurations

export const navigationMigrationMap = {
  'DomainAwareNavigation': {
    component: 'UniversalNavigation',
    defaultProps: { 
      variant: 'header',
      showLogo: true,
      showDomainSwitcher: true,
      background: 'blur',
      position: 'sticky'
    }
  },
  'MobileBottomNav': {
    component: 'UniversalNavigation',
    defaultProps: { 
      variant: 'mobile',
      showMobileMenu: true,
      position: 'fixed'
    }
  },
  'Breadcrumbs': {
    component: 'UniversalNavigation',
    defaultProps: { 
      variant: 'breadcrumb',
      showLogo: false,
      showDomainSwitcher: false
    }
  },
  'MegaMenu': {
    component: 'UniversalNavigation',
    defaultProps: { 
      variant: 'header',
      showDomainSwitcher: true,
      background: 'solid'
    }
  }
};

// Usage examples for migration
export const navigationMigrationExamples = {
  before: {
    DomainAwareNavigation: '<DomainAwareNavigation domain="full-stack" />',
    MobileBottomNav: '<MobileBottomNav />',
    Breadcrumbs: '<Breadcrumbs />',
    MegaMenu: '<MegaMenu items={menuItems} />'
  },
  after: {
    DomainAwareNavigation: '<UniversalNavigation variant="header" domain="full-stack" showDomainSwitcher={true} />',
    MobileBottomNav: '<UniversalNavigation variant="mobile" position="fixed" />',
    Breadcrumbs: '<UniversalNavigation variant="breadcrumb" showLogo={false} />',
    MegaMenu: '<UniversalNavigation variant="header" items={menuItems} background="solid" />'
  }
};
