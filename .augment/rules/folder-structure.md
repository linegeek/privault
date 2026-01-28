---
type: 'manual'
---

# Rules

- src/types/common contains common types for main and renderer process. It's preferred to have a type file for each type. For example, if you have a type called Subscription, you should create a file called src/types/common/subscription.ts and put the type in that file.
- src/types/main contains types only used in main process. It's preferred to have a type file for each type. For example, if you have a type called Subscription, you should create a file called src/types/main/subscription.ts and put the type in that file.
- src/types/renderer contains types only used in renderer process. It's preferred to have a type file for each type. For example, if you have a type called Subscription, you should create a file called src/types/renderer/subscription.ts and put the type in that file.
- src/renderer/utils folder contains utility methods. It's preferred to have a util file for each type of utility method. For example, if you have a method to format a date, you should create a file called src/utils/date.ts and put the method in that file. The utility methods should be pure functions.
- src/renderer/hooks folder contains custom hooks.
- src/renderer/components folder contains components. The components should be grouped by type. For example, all button components should be in src/renderer/components/buttons folder. Each component file should contain only 1 component. If a component is used only in one screen, it's preferred to put the component in the screen folder.
- src/renderer/screens folder contains screen components. Each screen can be one component. If multiple components are needed, create a folder with the screen name and put the components in that folder.
- src/renderer/constants folder contains constants. It's preferred to have a constants file for each type of constants. For example, if you have constants related to subscriptions, you should create a file called src/renderer/constants/subscription.ts and put the constants in that file.
- src/renderer/services folder contains services. A service is a file that contains business logic. For example, a service to get all subscriptions from main process should be in src/renderer/services/subscription.ts. The service can have methods to communicate with main process or external APIs.
- src/main/services folder contains services. A service is a file that contains business logic. For example, a service to get all subscriptions from database should be in src/main/services/subscription.ts. The service can have methods to communicate with database or external APIs.
- src/main/ipc-handlers folder contains ipc handlers. An ipc handler is a file that contains methods to handle ipc requests. For example, a file to handle all subscription related ipc requests should be in src/main/ipc-handlers/subscription.ts.