#!/bin/bash
set -e

BRANCH=$(git branch --show-current)

echo "Branch: $BRANCH"
echo ""

# Commit each modified/untracked file one by one
commit_file() {
  local file="$1"
  local msg="$2"
  git add "$file"
  git commit -m "$msg"
  echo "  committed: $file"
}

# .env.example
if git diff --name-only | grep -q "^\.env\.example$" || git ls-files --others --exclude-standard | grep -q "^\.env\.example$"; then
  commit_file ".env.example" "chore: update env example to use OPENROUTER_API_KEY"
fi

# constants.ts
if git diff --name-only | grep -q "src/utils/constants.ts"; then
  commit_file "src/utils/constants.ts" "chore: migrate AI model to nvidia/nemotron-3-super-120b-a12b:free via OpenRouter"
fi

# generate.ts
if git diff --name-only | grep -q "src/pages/api/generate.ts"; then
  commit_file "src/pages/api/generate.ts" "feat: migrate AI integration from OXLO to OpenRouter, strip <think> reasoning blocks"
fi

# health.ts
if git diff --name-only | grep -q "src/pages/api/health.ts"; then
  commit_file "src/pages/api/health.ts" "fix: update health endpoint to use OPENROUTER_API_KEY"
fi

# CLAUDE.md
if git ls-files --others --exclude-standard | grep -q "^CLAUDE\.md$" || git diff --name-only | grep -q "^CLAUDE\.md$"; then
  commit_file "CLAUDE.md" "docs: add CLAUDE.md with project architecture and dev guide"
fi

# Remaining untracked/modified files (catch-all)
REMAINING=$(git status --porcelain | grep -v "^?? push.sh" | awk '{print $2}')
if [ -n "$REMAINING" ]; then
  echo ""
  echo "Remaining changes:"
  echo "$REMAINING"
  read -p "Commit remaining files with message: " msg
  if [ -n "$msg" ]; then
    git add .
    git commit -m "$msg"
  fi
fi

echo ""
echo "Pushing to origin/$BRANCH..."
git push origin "$BRANCH"
echo "Done."
