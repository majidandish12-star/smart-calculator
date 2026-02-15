# Contributing to Smart Calculator

Thank you for considering contributing to this project! Please follow these guidelines to ensure a smooth workflow.

## Branch Strategy
- `main`: Production-ready code only. All development merges into `main` via PR.
- `dev`: Active development branch (all feature and bugfix branches merge here first).
- Feature branches: `feature/<short-description>`
- Bugfix branches: `bugfix/<short-description>`

## Pull Request Workflow
1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** for your feature or bugfix off `dev`: `git checkout -b feature/your-feature`
3. Write clear, self-contained commits. Follow conventional commit message style (see below).
4. Rebase your branch onto latest `dev` if needed.
5. **Write or update tests** and ensure all checks pass (CI, lint, test, build).
6. **Submit a pull request** against `dev`. Provide a clear description, link issues if relevant, and add proper context/screenshots.
7. Await review & make necessary changes.
8. Once approved & CI passes, your PR will be merged by a maintainer.

## Commit Message Convention
Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new features
- `fix:` — bug fixes
- `docs:` — documentation only
- `style:` — formatting, missing semi colons, etc
- `refactor:` — code improvements without functional changes
- `test:` — adding or fixing tests
- `chore:` — build process or tooling

Example:
```
feat(math): add matrix determinant calculation
```

## Code Quality
- Ensure code is well-commented and passes all linters.
- All PRs must have at least one reviewer and CI status green.

## Reporting Issues
Please use the provided issue templates for bugs, features, or custom reports.