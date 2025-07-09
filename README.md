## 🚀 Git Workflow & Code Push Guidelines

We follow a structured Git workflow to ensure code quality, consistent releases, and safe collaboration. Please read and follow these guidelines before contributing.

---

### 🌿 Branching Strategy

We use a **progressive branch flow**:

```
main ← staging ← dev ← feature/*
```

| Branch     | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| `main`     | Production-ready code only. Merged from `staging`.                      |
| `staging`  | Pre-production. QA & integration testing happens here.                 |
| `dev`      | Active development. Feature branches are merged here.                   |
| `feature/*` / `fix/*` / `hotfix/*` | Temporary branches for individual changes.       |

---

### 🔁 Push & Merge Flow

1. **Create a feature/fix/hotfix branch** from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/short-description
   ```

2. **Make commits, pull latest changes, then push your branch**:
   ```bash
   git add .
   git commit -m "feat(scope): your message"

   # 🔁 Always pull before you push
   git pull origin dev 

   # ✅ Then push your branch
   git push -u origin feat/short-description
   ```

3. **Open a Pull Request (PR)** from your branch to `dev`.
4. Ideally the below steps are not followed instead we might create PR in github and merge there which will not occur often.

5. Once merged into `dev`, the code will be **thoroughly tested in `staging`**:
   - Merge `dev` into `staging` when needed:
     ```bash
     git checkout staging
     git pull origin staging
     git merge dev
     git push origin staging
     ```

6. After successful testing, **merge `staging` into `main`** for production:
   ```bash
   git checkout main
   git pull origin main
   git merge staging
   git push origin main
   ```

---

### 🌲 Trunk-Based Development

We follow a lightweight version of **trunk-based development**:
- `dev` acts as our integration branch (the "trunk").
- All feature/fix/hotfix branches are short-lived and merged back quickly.
- Regular merges to `staging` and `main` keep the codebase deployable.

---

### 🏷️ Branch Naming Convention

Use clear prefixes to indicate the purpose of a branch:

| Prefix     | Use For                        | Example                    |
|------------|--------------------------------|----------------------------|
| `feat/`    | New features                   | `feat/user-onboarding`     |
| `fix/`     | Bug fixes                      | `fix/login-validation`     |
| `hotfix/`  | Urgent production patches      | `hotfix/critical-crash`    |
| `chore/`   | Maintenance, cleanup           | `chore/update-deps`        |
| `docs/`    | Documentation changes          | `docs/readme-guidelines`   |

---

### ✍️ Commit Message Guidelines

Use **Conventional Commits** style:

```
<type>(<scope>): <message>
```

#### Valid types:
- `feat`: New feature
- `fix`: Bug fix
- `hotfix`: Critical fix
- `refactor`: Code refactoring
- `chore`: Build process, tooling, etc.
- `docs`: Documentation only changes
- `test`: Adding or updating tests
- `style`: Formatting, missing semicolons, etc.

#### Examples:
- `fix(auth): handle expired token error`
- `feat(profile): add profile picture upload`
- `docs(readme): add API usage section`

> ✅ Keep messages short, meaningful, and in present tense.

---

### 🛡️ Branch Protection Rules (Recommended)

Enable these on GitHub:
- Require PR reviews before merging to `dev`, `staging`, or `main`
- Require status checks (tests, linter) to pass before merge
- Prevent force pushes and deletions

---

By following these rules, we keep our codebase clean, stable, and deployable at all times. Happy committing! 🚀
