# Contributing to EduEval

Thank you for considering contributing to EduEval! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility and apologize for mistakes

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting remarks
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker (for code execution features)
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/edueval.git
   cd edueval
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/edueval.git
   ```

### Setup Development Environment

```bash
# Install dependencies
npm run install:all

# Copy environment files
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local

# Configure environment variables
# Edit server/.env and client/.env.local with your settings

# Seed database
npm run seed:admin
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the feature branch
2. Follow coding standards (see below)
3. Test your changes thoroughly
4. Commit with descriptive messages

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase main
```

---

## Coding Standards

### JavaScript/Node.js Style Guide

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use async/await instead of callbacks
- Add JSDoc comments for functions

#### Example:

```javascript
/**
 * Creates a new exam
 * @param {Object} examData - The exam data
 * @param {string} examData.title - Exam title
 * @param {Date} examData.startTime - Start time
 * @returns {Promise<Object>} Created exam
 */
const createExam = async (examData) => {
  const { title, startTime } = examData;
  // Implementation
};
```

### File Organization

- One component/controller per file
- Use descriptive file names (camelCase for files, PascalCase for React components)
- Group related files in directories

### Naming Conventions

- **Variables/Functions:** camelCase (`getUserById`, `examData`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_URL`)
- **Classes/Components:** PascalCase (`ExamController`, `Button`)
- **Files:** Match the export name

### Error Handling

Always use try-catch blocks and proper error handling:

```javascript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Error in someAsyncOperation:', error);
  throw new Error('Failed to complete operation');
}
```

### React/Next.js Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking
- Keep components small and focused

```javascript
const ExamCard = ({ exam, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(exam.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // JSX
  );
};
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(exam): add support for essay questions

- Added essay question type to exam model
- Updated exam controller to handle essay grading
- Added UI components for essay questions

Closes #123
```

```
fix(auth): resolve token refresh loop

Fixed an issue where refresh tokens were causing an infinite loop
when expired. Now properly handles token expiration.

Fixes #456
```

---

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

2. **Update documentation** if needed

3. **Ensure your branch is up to date**
   ```bash
   git pull upstream main
   git rebase main
   ```

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your fork and branch

5. Fill in the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Issue**: Link related issues
   - **Screenshots**: If UI changes, include screenshots
   - **Testing**: Describe how you tested

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

---

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Test edge cases and error scenarios
- Use descriptive test names

```javascript
describe('Exam Controller', () => {
  describe('createExam', () => {
    it('should create an exam with valid data', async () => {
      const examData = {
        title: 'Test Exam',
        startTime: new Date(),
      };
      const result = await createExam(examData);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Exam');
    });

    it('should throw error with invalid data', async () => {
      const invalidData = { title: '' };
      await expect(createExam(invalidData)).rejects.toThrow();
    });
  });
});
```

---

## Areas for Contribution

### High Priority

- [ ] Improve test coverage
- [ ] Add accessibility features
- [ ] Performance optimizations
- [ ] Mobile responsiveness
- [ ] Documentation improvements

### Feature Requests

- [ ] OAuth integration (Google, Microsoft)
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Offline support

### Good First Issues

Look for issues labeled `good first issue` or `help wanted` on GitHub.

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community (if available)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

---

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to EduEval! 🎓
