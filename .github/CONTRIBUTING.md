# Contributing Guide

Thank you for your interest in contributing! We welcome all contributions, from bug fixes to new features.

## How to Contribute

### 1. Fork the Repository
Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes
- Write clean, well-documented code
- Follow the existing code style
- Add tests for new functionality
- Update documentation if needed

### 5. Test Your Changes
```bash
npm run lint
npm test
npm run build
```

### 6. Commit Your Changes
```bash
git add .
git commit -m "feat: add amazing feature"  # Use conventional commits
```

### 7. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request
Go to the original repository and click "New Pull Request".

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages (Conventional Commits)

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## Pull Request Guidelines

- Fill out the PR template completely
- Ensure all CI checks pass
- Keep PRs focused on a single change
- Update documentation for user-facing changes
- Add tests for new functionality

## Reporting Issues

Please use the issue templates provided:
- Bug Report: For unexpected behavior
- Feature Request: For new functionality
- Security Vulnerability: For security issues (report privately)

## Development Setup

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## Questions?

Feel free to open an issue or start a discussion if you have any questions!