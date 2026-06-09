# Contributing to VentureLens AI

First off, thank you for considering contributing to VentureLens AI! It's people like you that make it such a great tool.

## Development Workflow

1. **Fork & Clone**: Fork the repository and clone your fork locally.
2. **Setup**: Run `docker-compose up -d --build` to launch the local stack.
3. **Branch**: Create a branch for your feature (`git checkout -b feature/amazing-feature`).
4. **Code & Test**: Ensure you add tests for your feature. Run `pytest backend/tests/` to verify.
5. **Linting**: We enforce strict linting. Run `ruff check backend/app/` and `mypy backend/app/`.
6. **Submit PR**: Open a Pull Request against the `main` branch.

## Pull Request Process

- Ensure your code adheres to standard Python PEP-8 guidelines.
- Your PR must pass all CI/CD checks (Trivy, Semgrep, Ruff, Pytest).
- Require at least 1 approval from a core maintainer before merging.

## Bugs & Feature Requests
Please use the GitHub Issue Tracker to report bugs or request new features.
