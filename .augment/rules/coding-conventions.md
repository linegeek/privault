---
type: 'manual'
---

# Overview

The component file should contain only 1 component.
The functions to communicate with main process should be grouped into a service.
The files in utils folder should contain only utility methods. The utility methods should be pure functions.
Constants should be under constants folder.
All types should be in src/types folder. It's preferred to defined a type in a file. src/types folder has common, main, renderer folders.
src/types/common contains common types for main and renderer process.
src/types/main contains types only used in main process.
src/types/renderer contains types only used in renderer process.