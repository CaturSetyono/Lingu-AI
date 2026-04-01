#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Iterate over all modified/untracked files handling spaces safely
git status --porcelain | while read -r line; do
  file="${line:3}"
  if [ -n "$file" ]; then
    echo "Committing $file..."
    git add "$file"
    git commit -m "update: $file"
  fi
done

echo "Selesai! Semua file berhasil di-commit satu per satu."
