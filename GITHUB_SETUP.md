# GitHub Setup Instructions

Follow these steps to push your code to GitHub:

## Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd "D:\WORKING WEBSITES\PORTFOLIO MERN"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - MERN Portfolio with Admin Dashboard"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it (e.g., "portfolio-mern")
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 3: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Verify

Check your GitHub repository - all files should be there!

## Future Updates

When you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Important Notes

- Never commit `.env` files (they're in .gitignore)
- Never commit `node_modules` (they're in .gitignore)
- The frontend build folder is also ignored (will be built on Render)

