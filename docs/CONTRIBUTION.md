# Contribution guide

### Git Branches

- start your work with latest 'dev' branch
- create new branch based on type of work you do:

format: {prefix}/short-name-separated-by-dash

#### prefixes:

- feat/ - new feature
- fix/ - fixing a bug
- perf/ - changes to boost performance
- refactor/ - refactoring
- release/ - release

example: feat/new-dashboard, fix/broken-menu-button

### Commits

Make a descriptive commit name in imperative mode starting by capital letter. Example:

```
Add new menu button

Fix missing prop in MyComponent
```

### Changelog

Add new entry to CHANGELOG.md using rules described here: https://keepachangelog.com/en/1.0.0/
We need this to create tagged releases with attached changelog to each release.

### Pull Requests

Make a pull request targeting dev branch. You can ping any developer personaly to check your PR or write to common dev channel in Planner. After approval do not merge. Only current RELEASE OPERATOR can pick your PR to future release.

## Code conventions

### Hooks

Each component should have it's own directory with index.tsx with dumb logic. In the same folder create hook.ts if any logic is needed.

hook.ts is a custom hook for our component where you can put click logic and provide/persist external data.
To access redux data create another file: dataHoooks.ts.
Put there useDataProvider hook with selectors and useDataPersister with dispatches.

Provide TypeScript Interfaces to each of this hooks DataProviderHookInterface, DataPersisterHookInterface, MyComponentHookInterface.

Remember to wrap dispatches with useCallback to avoid recreating those arrow functions.

If your child component is huge and CPU expensive - review all functions in your custom hook and wrap them with useCallback if needed.

![hook preview](https://tc3-img-dev.s3.eu-central-1.amazonaws.com/13fc75e655d5eac549f0ca933bada2d587d71299425cf8f93752b1bb5a771bb4)

If you encounter a component with replaceable dataHooks logic, create a dataProviderHookFactory that will return dataHooks based on some type.

![hook factory](https://tc3-img-dev.s3.eu-central-1.amazonaws.com/7b7f97823f98a8fba98b4423a3dcb4a33aac9063ff6b9cda9585ce41be49f280)

### Function naming

We do not use onClick -> handleClick convention. We use the same function names with _on_ prefix which is much faster to find in modern IDEs.

### TypeScript

1. Interfaces

- components: MyComponentInterface
- custom component hooks: MyComponentHookInterface
- DataHooksFactory: DataHooksInterface
- DataProviderHook: DataProviderHookInterface
- DataPersisterHook: DataPersisterHookInterface

2. Generic types

```
export class MyClass<TInputData, TOutputData>
```

### Styles

We use css-modules approach to style our components with addition of postcss extensions. You can use full sass funcitonalities.

Our basic unit of measure is `gridCellSize` (5px currently).
If you want to describe a height, don't hardcode it. Use `calc(gridCellSize * x)`. You need to use `import common.css` beforehand.

Don't hardcode colors, use our common colors:
`import colors.css`

### Translations

Planner is using i18n to translate strings.

If you added a new string, wrap it with t() function to translate it. Example:

![translate](https://tc3-img-dev.s3.eu-central-1.amazonaws.com/7a23ef49631d8574b1f8f186cebe00a6cb984f03c9212d58be4e0cae81c776d9)

Run `yarn generate_translations` to update resource.json for each language. Update your translations in those files and push changes.

Planner is using weblate to enable translation contribution.
https://translate.heyspace.info/
