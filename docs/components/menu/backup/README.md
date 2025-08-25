# Menu Backup Directory

This directory stores backups of unused or legacy menu-related files during the cleanup and improvement process. Each move should be recorded in `move-records.json` with the following fields:

- filename: the file name
- previouslocation: the original path relative to project root (./)

Example entries:
[
  { "filename": "UniversalNavigation.tsx", "previouslocation": "./components/ui/navigation/UniversalNavigation.tsx" },
  { "filename": "navigation-unified.tsx", "previouslocation": "./data/navigation-unified.tsx" },
  { "filename": "MegaMenu.tsx", "previouslocation": "./components/ui/navigation/MegaMenu.tsx" }
]
