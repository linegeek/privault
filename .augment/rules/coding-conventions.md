---
type: 'manual'
---

# Rules

## Naming

- All files except component files should be named with kebab-case. But all component files should be same as the component name.
- All component names should be PascalCase.
- All interface names should be PascalCase.
- All function names should be camelCase.

## Import

- Each folder should have an index.ts file which exports all the files in that folder.
- The index.ts file should be used for importing from that folder. For example, if you want to import a component, you need to import from src/renderer/components instead of importing from src/renderer/components/ComponentName.tsx.
- All imports should be relative. For example, if you want to import a file from src/renderer/components, you should import from '../components' instead of importing from 'src/renderer/components'.
