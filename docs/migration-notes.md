# Migration Notes & Best Practices

Guidelines and considerations for migrating Feelio to React.

---

- Do not push `node_modules/` to the repository — use a proper `.gitignore`.
- **Prettier** is used for code formatting (integrated via `eslint-plugin-prettier`).
- **ESLint 9** is used for linting (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-no-relative-import-paths`).
