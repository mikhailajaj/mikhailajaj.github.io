#!/bin/bash

# Migrate Service Components Script
# Updates domain pages to use consolidated ServiceGrid component

set -e

echo "🔄 Migrating domain pages to use ServiceGrid component..."

# Update Full-Stack Services page
echo "📝 Updating full-stack services..."
if [ -f "app/services/full-stack/page.tsx" ]; then
    # Add ServiceGrid import and update component usage
    sed -i.bak 's/import { FullStackServices }/import { ServiceGrid } from "@\/components\/ui\/ServiceGrid";\nimport { DOMAIN_CONFIGS } from "@\/lib\/constants\/domains";\nimport { domainServices } from "@\/lib\/data\/serviceData";\n\/\/ import { FullStackServices }/g' app/services/full-stack/page.tsx
    
    # Replace component usage
    sed -i.bak 's/<FullStackServices/<ServiceGrid domain={DOMAIN_CONFIGS["full-stack"]} services={domainServices["full-stack"]}/g' app/services/full-stack/page.tsx
    sed -i.bak 's/<\/FullStackServices>/<\/ServiceGrid>/g' app/services/full-stack/page.tsx
fi

# Update Cloud Services page
echo "📝 Updating cloud services..."
if [ -f "app/services/cloud/page.tsx" ]; then
    sed -i.bak 's/import { CloudServices }/import { ServiceGrid } from "@\/components\/ui\/ServiceGrid";\nimport { DOMAIN_CONFIGS } from "@\/lib\/constants\/domains";\nimport { domainServices } from "@\/lib\/data\/serviceData";\n\/\/ import { CloudServices }/g' app/services/cloud/page.tsx
    
    sed -i.bak 's/<CloudServices/<ServiceGrid domain={DOMAIN_CONFIGS["cloud"]} services={domainServices["cloud"]}/g' app/services/cloud/page.tsx
    sed -i.bak 's/<\/CloudServices>/<\/ServiceGrid>/g' app/services/cloud/page.tsx
fi

# Update Data Services page
echo "📝 Updating data services..."
if [ -f "app/services/data/page.tsx" ]; then
    sed -i.bak 's/import { DataServices }/import { ServiceGrid } from "@\/components\/ui\/ServiceGrid";\nimport { DOMAIN_CONFIGS } from "@\/lib\/constants\/domains";\nimport { domainServices } from "@\/lib\/data\/serviceData";\n\/\/ import { DataServices }/g' app/services/data/page.tsx
    
    sed -i.bak 's/<DataServices/<ServiceGrid domain={DOMAIN_CONFIGS["data"]} services={domainServices["data"]}/g' app/services/data/page.tsx
    sed -i.bak 's/<\/DataServices>/<\/ServiceGrid>/g' app/services/data/page.tsx
fi

# Update UX/UI Services page
echo "📝 Updating ux-ui services..."
if [ -f "app/services/ux-ui/page.tsx" ]; then
    sed -i.bak 's/import { UXUIServices }/import { ServiceGrid } from "@\/components\/ui\/ServiceGrid";\nimport { DOMAIN_CONFIGS } from "@\/lib\/constants\/domains";\nimport { domainServices } from "@\/lib\/data\/serviceData";\n\/\/ import { UXUIServices }/g' app/services/ux-ui/page.tsx
    
    sed -i.bak 's/<UXUIServices/<ServiceGrid domain={DOMAIN_CONFIGS["ux-ui"]} services={domainServices["ux-ui"]}/g' app/services/ux-ui/page.tsx
    sed -i.bak 's/<\/UXUIServices>/<\/ServiceGrid>/g' app/services/ux-ui/page.tsx
fi

# Update Consulting Services page
echo "📝 Updating consulting services..."
if [ -f "app/services/consulting/page.tsx" ]; then
    sed -i.bak 's/import { ConsultingServices }/import { ServiceGrid } from "@\/components\/ui\/ServiceGrid";\nimport { DOMAIN_CONFIGS } from "@\/lib\/constants\/domains";\nimport { domainServices } from "@\/lib\/data\/serviceData";\n\/\/ import { ConsultingServices }/g' app/services/consulting/page.tsx
    
    sed -i.bak 's/<ConsultingServices/<ServiceGrid domain={DOMAIN_CONFIGS["consulting"]} services={domainServices["consulting"]}/g' app/services/consulting/page.tsx
    sed -i.bak 's/<\/ConsultingServices>/<\/ServiceGrid>/g' app/services/consulting/page.tsx
fi

# Also update domain pages that might use service components
echo "📝 Updating domain pages..."

# Update domain pages to use ServiceGrid in their service sections
for domain_page in app/full-stack/page.tsx app/cloud-engineering/page.tsx app/data-analytics/page.tsx app/ux-ui-design/page.tsx app/technical-consulting/page.tsx; do
    if [ -f "$domain_page" ]; then
        domain_name=$(basename $(dirname "$domain_page"))
        echo "📝 Updating $domain_name domain page..."
        
        # Map domain page names to service keys
        case "$domain_name" in
            "full-stack") service_key="full-stack" ;;
            "cloud-engineering") service_key="cloud" ;;
            "data-analytics") service_key="data" ;;
            "ux-ui-design") service_key="ux-ui" ;;
            "technical-consulting") service_key="consulting" ;;
        esac
        
        # Add ServiceGrid import if not present
        if ! grep -q "ServiceGrid" "$domain_page"; then
            sed -i.bak '/import { domainAchievements, domainTechnologies }/a\
import { ServiceGrid } from "@/components/ui/ServiceGrid";\
import { domainServices } from "@/lib/data/serviceData";' "$domain_page"
        fi
        
        # Replace service component usage
        sed -i.bak "s/<${service_key^}Services/<ServiceGrid domain={DOMAIN_CONFIGS['$service_key']} services={domainServices['$service_key']}/g" "$domain_page"
        sed -i.bak "s/<\/${service_key^}Services>/<\/ServiceGrid>/g" "$domain_page"
    fi
done

echo ""
echo "✅ Service component migration complete!"
echo ""
echo "📋 Migration summary:"
echo "• Updated service pages to use ServiceGrid"
echo "• Updated domain pages to use ServiceGrid"
echo "• Added proper imports for ServiceGrid and service data"
echo "• Created backup files (.bak) for safety"
echo ""
echo "🧪 Next steps:"
echo "1. Test all service pages: /services/full-stack, /services/cloud, etc."
echo "2. Test domain pages with service sections"
echo "3. Verify ServiceGrid displays correctly with domain theming"
echo "4. Remove old service components after testing"
echo ""
echo "🎯 Ready for testing!"