# UBPod Development Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm test -- -t "test name"` - Run single test by name pattern

## Code Style
- **Architecture**: Component-based with React 18, TypeScript, Vite, and Tailwind CSS
- **Components**: Functional with hooks, < 250 lines, TypeScript interfaces for props
- **File Structure**: Organize by function (ui, layout, audio) in appropriate folders
- **Imports**: Group by external, internal, then types; maintain existing patterns
- **Styling**: Use Tailwind for layout, custom design classes for typography
- **Error Handling**: Implement robust error handling with user-friendly messages and fallbacks

## Change Management Guidelines
- Make minimal, targeted changes; never modify existing functions unless instructed
- Match existing code patterns, naming conventions, and styling
- Use existing utilities instead of creating new ones
- Test thoroughly with actual data paths before submitting changes
- For UI elements, follow the project's styling and component patterns exactly

## Testing Guidelines
- Test across multiple browsers (Chrome, Firefox, Safari)
- Verify mobile responsiveness
- Test keyboard navigation for accessibility
- Check error states by intentionally breaking functionality