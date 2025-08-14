#!/bin/bash

# Migrate domain hero imports to use consolidated component

echo "🔄 Migrating domain hero imports..."

# Update full-stack page
if [ -f "app/full-stack/page.tsx" ]; then
  sed -i.bak 's/import.*FullStackHero.*from.*domain-specific\/full-stack\/FullStackHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/full-stack/page.tsx
  sed -i.bak 's/<FullStackHero/<DomainHero domain={DOMAINS.FULL_STACK} achievements={fullStackAchievements} technologies={fullStackTechnologies}/g' app/full-stack/page.tsx
fi

# Update cloud engineering page
if [ -f "app/cloud-engineering/page.tsx" ]; then
  sed -i.bak 's/import.*CloudHero.*from.*domain-specific\/cloud\/CloudHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/cloud-engineering/page.tsx
  sed -i.bak 's/<CloudHero/<DomainHero domain={DOMAINS.CLOUD_ENGINEERING} achievements={cloudAchievements} technologies={cloudTechnologies}/g' app/cloud-engineering/page.tsx
fi

# Update data analytics page
if [ -f "app/data-analytics/page.tsx" ]; then
  sed -i.bak 's/import.*DataHero.*from.*domain-specific\/data\/DataHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/data-analytics/page.tsx
  sed -i.bak 's/<DataHero/<DomainHero domain={DOMAINS.DATA_ANALYTICS} achievements={dataAchievements} technologies={dataTechnologies}/g' app/data-analytics/page.tsx
fi

# Update UX/UI design page
if [ -f "app/ux-ui-design/page.tsx" ]; then
  sed -i.bak 's/import.*UXUIHero.*from.*domain-specific\/ux-ui\/UXUIHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/ux-ui-design/page.tsx
  sed -i.bak 's/<UXUIHero/<DomainHero domain={DOMAINS.UX_UI_DESIGN} achievements={uxuiAchievements} technologies={uxuiTechnologies}/g' app/ux-ui-design/page.tsx
fi

# Update technical consulting page
if [ -f "app/technical-consulting/page.tsx" ]; then
  sed -i.bak 's/import.*ConsultingHero.*from.*domain-specific\/consulting\/ConsultingHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/technical-consulting/page.tsx
  sed -i.bak 's/<ConsultingHero/<DomainHero domain={DOMAINS.TECHNICAL_CONSULTING} achievements={consultingAchievements} technologies={consultingTechnologies}/g' app/technical-consulting/page.tsx
fi

echo "✅ Migration complete! Please review the changes and test functionality."
echo "💡 Backup files created with .bak extension"
