# GitHub Actions CI/CD Setup & Lefthook Pre-Commit Hooks

This project uses GitHub Actions for automated code quality checks, building, and deployment. It also uses Lefthook for local pre-commit validation.

## Lefthook Pre-Commit Hooks

Lefthook runs automatic checks before each commit to catch issues early.
This runs the `prepare` script which installs Lefthook hooks locally.

### What Runs Before Each Commit

1. **Type Check** - TypeScript validation
2. **Prettier** - Code formatting (auto-fixes if needed)
3. **ESLint** - Linting (auto-fixes if needed)

### Skipping Hooks

If you need to skip hooks (not recommended), use:

```bash
git commit --no-verify
```

Or bypass specific hooks during merges/rebases:

```bash
git rebase --continue
```

### Lefthook Configuration

Lefthook is configured in `lefthook.yml` with:
- Type checking for `.ts` and `.tsx` files
- Prettier formatting for code and config files
- ESLint linting for TypeScript files
- Auto-fixing enabled for Prettier and ESLint
- Skipped during merge/rebase operations

## Workflows

### 1. Code Quality Checks (`.github/workflows/code-quality.yml`)
Runs on every push and pull request to ensure code quality standards.

**Runs:**
- ✅ Prettier formatting check
- ✅ ESLint linting
- ✅ npm audit security check

**Triggers:** Every push and PR on `main`, `dev`, and feature branches

**What to do if it fails:**
```bash
pnpm prettier:fix    # Fix formatting
pnpm lint:fix        # Fix linting issues
pnpm audit fix       # Fix vulnerabilities
git add .
git commit -m "fix: code quality issues"
git push
```

### 2. Build & Store Artifacts (`.github/workflows/build.yml`)
Builds the project and stores artifacts for deployment.

**Runs:**
- Builds with TypeScript and Vite
- Stores `dist/` artifacts for 30 days (main) or 7 days (dev)

**Triggers:** Every push and PR on `main` and `dev`

**Artifacts:**
- `build-artifacts` - Main branch (30 days retention)
- `build-artifacts-dev` - Dev branch (7 days retention)

### 3. Deploy to Vercel (`.github/workflows/deploy-vercel.yml`)
Automatically deploys to production when code is pushed to `main`.

**Runs:**
- Builds the project
- Deploys to Vercel production

**Triggers:** Only on push to `main` branch

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## Setting Up GitHub Secrets

To enable Vercel deployment, add these secrets to your GitHub repository:

1. Go to `Settings` → `Secrets and variables` → `Actions`
2. Add the following secrets:

### VERCEL_TOKEN
Get from: https://vercel.com/account/tokens
```
Click "Create" → Name it "GitHub CI/CD" → Copy the token
```

### VERCEL_ORG_ID
Get from: Your Vercel dashboard URL
```
Example: https://vercel.com/your-org-name
The org name in the URL is your VERCEL_ORG_ID
```

### VERCEL_PROJECT_ID
Get from: Your Vercel project settings
```
Project Settings → ID (copy the ID shown)
```

## Local Development Scripts

```bash
# Type checking
pnpm type-check    # Check TypeScript types
pnpm build         # Build with type checking (includes tsc -b)

# Code Quality
pnpm lint            # Run ESLint check
pnpm lint:fix        # Fix ESLint issues
pnpm prettier:check  # Check Prettier formatting
pnpm prettier:fix    # Fix formatting issues

# Development
pnpm dev             # Start dev server

# Preview
pnpm preview         # Preview production build
```

## Workflow Status

Check the status of your workflows in the GitHub Actions tab:
- Click on "Actions" in your repository
- View workflow runs and their status
- Click on a run to see detailed logs

## Best Practices

1. **Always run checks locally before pushing:**
   ```bash
   npm run prettier:fix
   npm run lint:fix
   npm run build
   ```

2. **Keep commits clean:** Make commits small and focused

3. **Use meaningful commit messages:** Helps track changes through history

4. **Test before pushing:** Run `npm run build` locally to catch errors early

5. **Review Actions logs:** Check failed workflows to fix issues quickly

## Troubleshooting

### Build fails with "TypeScript error"
```bash
npm run build  # Run locally to see the error
# Fix the error and commit
```

### Prettier fails on push
```bash
npm run prettier:fix
git add .
git commit --amend --no-edit
git push --force-with-lease
```

### ESLint fails
```bash
npm run lint:fix
git add .
git commit --amend --no-edit
git push --force-with-lease
```

### Vercel deployment fails
Check the Vercel deployment logs in the GitHub Actions workflow and Vercel dashboard.
