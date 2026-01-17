# Development guidelines

- If not needed, don't recreate docker, because it's slow

## Important rules for Code Style

- Make isolates specialized services 1 to 10 in servicies folder in backend. They should maximize taking inputs as params 
- Make simple CLI scripts to run and test those services

- Python: Use type hints, follow mypy strict rules

- Tests: Prefer parameterized tests. Think carefully about input/output so tests exercise the system and explain the code to future readers. In Python, use the `parameterized` library

- Error handling: Prefer explicit error handling with typed errors

- Naming: Use descriptive names; camelCase for JS/TS, snake_case for Python (see detailed conventions in Typescript and React section)

- Comments: should not duplicate the code below, don't tell me "this finds the shortest username" tell me _why_ that is important, if it isn't important don't add a comment, almost never add a comment

- Separation of concerns: Keep different responsibilities in different places (data/logic/presentation, safety checks/policies, etc.)
- Reduce nesting: Use early returns, guard clauses, and helper methods to avoid deeply nested code

### Core Principles

- Start simple, iterate: Build minimal solution first, add complexity only when demanded
- Prioritize maintainability over development speed
- Write clear, understandable code
- Prefer iteration and modularization over code duplication
- Think data first, implement views second
- Always remember that there is a tension between having the fewest parts to code (a simple system) and having the most understandable code (a maintainable system). structure code to balance these two things
- Avoid over-engineering: Don't apply design patterns just because you know them

## Typescript and React

- IMPORTANT: Use Context7 for code generation, setup or configuration steps, or library/API documentation. Automatically use the Context7 MCP tools to resolve library IDs and get library docs without waiting for explicit requests.

### TypeScript
- TypeScript strict mode required
- Single quotes, no semicolons
- Explicit return types for functions
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)

### Architecture
- Two-layer system: (data/state) -> React (view/template)
- Always implement data layer in logic; avoid React state
- Don't use `useState` or `useEffect` to store local state. Take the extra 3 minutes and change it to a `logic` early on in development
- Logics still have a tiny initialization cost. Hence this rule doesn't apply to library components in the `lib/` folder. Still feel free to write a logic for a complicated `lib/` component when needed
- Structure files logically: logic, component, types, styles

### Naming Conventions
- Use clear, yet functional names (`searchResults` vs `data`)
- Logics are camelCase (`dashboardLogic`)
- React components are PascalCase (`DashboardMenu`)
- Props for both logics and components are PascalCase and end with `Props` (`DashboardLogicProps` & `DashboardMenuProps`)
- Name the `.ts` file according to its main export: `DashboardMenu.tsx` or `dashboardLogic.ts`. Pay attention to the case
- Avoid `index.ts`, `styles.css`, and other generic names, even if this is the only file in a directory

### UI and Styling
- Use Tailwind CSS with utility classes (not inline styles)
- Use shadcn/ui for components if available
- Use Emotion for custom styled-components when needed
- Components should be in their own directories

### Testing
- Logic tests for all logic files
- React Testing Library tests for interactive lib/ components
- Jest tests: prefer a single top-level describe block in a file
- Add presentational elements to Storybook (`pnpm storybook`)

## Design

- Prefer style of Notion, Linear

## General

- Use American English spelling
- When mentioning names, the product names should use Sentence casing, not Title Casing. For example, 'Product analytics', not 'Product Analytics'. Any other buttons, tab text, tooltips, etc should also all use Sentence casing. For example, 'Save as view' instead of 'Save As View'.

## React Patterns and Examples

### Core Rules
- **Functional components only** (no classes)
- **Named exports only** (no default exports)
- **Event handlers over useEffect** for state updates
- **Types over interfaces** (except for extending third-party)
- **String literals over enums**
- **No 'any' type allowed**
- **Zustand** for global state management

### Component Structure
```typescript
// ✅ Correct
export const UserProfile = ({ user, onEdit }: UserProfileProps) => {
  const handleEdit = () => onEdit(user.id);
  
  return (
    <StyledContainer>
      <h1>{user.name}</h1>
      <Button onClick={handleEdit}>Edit</Button>
    </StyledContainer>
  );
};
```

### Props & Event Handlers
```typescript
// ✅ Correct - Destructure props
const Button = ({ onClick, isDisabled, children }: ButtonProps) => (
  <button onClick={onClick} disabled={isDisabled}>
    {children}
  </button>
);

// ✅ Correct - Event handlers over useEffect
const UserForm = ({ onSubmit }: UserFormProps) => {
  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
    // Direct event handling, not useEffect
  };

  return <Form onSubmit={handleSubmit} />;
};
```

### Component Design
- **Small, focused components** - Single responsibility
- **Composition over inheritance** - Combine simple components
- **Extract complex logic** into custom hooks

```typescript
// ✅ Good - Composed from smaller components
const UserCard = ({ user }: UserCardProps) => (
  <StyledCard>
    <UserAvatar user={user} />
    <UserInfo user={user} />
    <UserActions user={user} />
  </StyledCard>
);
```

### Error Handling
```typescript
// ✅ Proper error types and meaningful messages
try {
  const user = await userService.findById(userId);
  if (!user) {
    throw new UserNotFoundError(`User with ID ${userId} not found`);
  }
  return user;
} catch (error) {
  logger.error('Failed to fetch user', { userId, error });
  throw error;
}
```

### Performance
```typescript
// ✅ Use memo for expensive components only
const ExpensiveChart = memo(({ data }: ChartProps) => {
  // Complex rendering logic
  return <ComplexChart data={data} />;
});

// ✅ Memoize callbacks when needed
const UserList = ({ users, onUserSelect }: UserListProps) => {
  const handleUserSelect = useCallback((user: User) => {
    onUserSelect(user);
  }, [onUserSelect]);

  return (
    <div>
      {users.map(user => (
        <UserItem key={user.id} user={user} onSelect={handleUserSelect} />
      ))}
    </div>
  );
};
```

## React State Management

### Local State Guidelines
```typescript
// ✅ Multiple useState for unrelated state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<User[]>([]);

// ✅ useReducer for complex state logic
type FormAction = 
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'RESET' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
};
```

### Data Flow Rules
- **Props down, events up** - Unidirectional data flow
- **Avoid bidirectional binding** - Use callback functions
- **Normalize complex data** - Use lookup tables over nested objects

```typescript
// ✅ Normalized state structure
type UsersState = {
  byId: Record<string, User>;
  allIds: string[];
};

// ✅ Functional state updates
const increment = useCallback(() => {
  setCount(prev => prev + 1);
}, []);
```

### Performance Tips
- Use atom families for dynamic data collections
- Implement proper selector caching
- Avoid heavy computations in selectors
- Batch state updates when possible

## Feedback Incorporation Guidelines

### Post-Interaction Reflection

After each coding session or significant interaction, the AI should:

#### 1. Reflect on User Feedback
- **Identify patterns** in user corrections or suggestions
- **Note recurring issues** that could be prevented with better rules
- **Recognize gaps** in current cursor rules or guidelines

#### 2. Suggest Rule Improvements
When user provides feedback that reveals a pattern or preference:

```typescript
// Example feedback patterns to watch for:
// - "We don't use useEffect, handle state changes in event callbacks"
// - "We don't use JSDoc blocks, prefer // comments"
// - "Always use named exports, never default exports"
// - "We prefer functional components over class components"
// - "Use event handlers over useEffect for state updates"
```

#### 3. Proactive Rule Suggestions
At the end of interactions, suggest:

```markdown
### 💡 Suggested Cursor Rule Updates

Based on your feedback today, I recommend adding/updating these rules:

**Code Style Rule Update:**
- Add preference for // comments over JSDoc blocks
- Enforce named exports only (no default exports)

**React Guidelines Update:**
- Document preference for event handlers over useEffect
- Add functional components only rule

Would you like me to help incorporate these into your cursor rules?
```

### Implementation Process

#### When to Suggest Updates
- User corrects the same type of mistake multiple times
- User explains a codebase-specific preference
- User points out missing functionality or incomplete implementations
- User provides context about existing patterns not captured in rules

#### How to Present Suggestions
1. **Summarize the pattern** observed from feedback
2. **Propose specific rule language** that would prevent the issue
3. **Explain the benefit** of codifying this knowledge
4. **Ask for confirmation** before implementing

#### Rule Categories to Consider
- **Code Style**: Formatting, naming, comment styles, export patterns
- **React Patterns**: Hook usage, component structure, state management
- **Architecture**: File organization, import patterns, component composition
- **Testing**: Test structure, naming, coverage expectations
- **Performance**: Optimization patterns, anti-patterns to avoid

### Example Feedback Integration

```markdown
### Today's Learning: React State Management Patterns

**User Feedback Received:**
- "We don't use useEffect, handle state changes in event callbacks"
- "We don't use JSDoc blocks, prefer // comments"
- "Always use named exports, never default exports"

**Proposed Rule Additions:**
```typescript
// ✅ React State Updates - Use event handlers, not useEffect
const handleButtonClick = () => {
  setData(newData); // Direct state update in event handler
};

// ❌ Avoid useEffect for state updates
// useEffect(() => { setData(newData); }, [trigger]);

// ✅ Named exports only
export const UserComponent = () => {};
export const useUserData = () => {};
```

**Benefits:**
- Prevents useEffect overuse and related bugs
- Ensures consistent export patterns across codebase
- Documents preferred React patterns for the team

This approach helps the AI learn from each interaction and continuously improve the development experience.

## Commits and Pull Requests

Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages and PR titles.

### Commit types

- `feat`: New feature or functionality (touches production code)
- `fix`: Bug fix (touches production code)
- `chore`: Non-production changes (docs, tests, config, CI, refactoring agents instructions, etc.)

### Format

```text
<type>(<scope>): <description>
```

Examples:

- `feat(insights): add retention graph export`
- `fix(cohorts): handle empty cohort in query builder`
- `chore(ci): update GitHub Actions workflow`
- `chore: update AGENTS.md instructions`

### Rules

- Scope is optional but encouraged when the change is specific to a feature area
- Description should be lowercase and not end with a period
- Keep the first line under 72 characters

