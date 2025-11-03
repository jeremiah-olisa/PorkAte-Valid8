#!/bin/bash

# Version bump script for monorepo packages
# Usage: ./scripts/bump-version.sh [major|minor|patch] [package-name]

set -e

VERSION_TYPE=${1:-patch}
PACKAGE_NAME=${2:-all}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Bumping version: $VERSION_TYPE${NC}"

if [ "$PACKAGE_NAME" = "all" ]; then
  echo -e "${YELLOW}Bumping all packages...${NC}"
  
  # Bump all packages
  for dir in packages/*/; do
    if [ -f "${dir}package.json" ]; then
      echo -e "${GREEN}Bumping version in $dir${NC}"
      cd "$dir"
      npm version "$VERSION_TYPE" --no-git-tag-version
      cd - > /dev/null
    fi
  done
  
  # Update root package.json if exists
  if [ -f "package.json" ]; then
    echo -e "${GREEN}Bumping root package version${NC}"
    npm version "$VERSION_TYPE" --no-git-tag-version
  fi
else
  # Bump specific package
  PACKAGE_DIR="packages/$PACKAGE_NAME"
  
  if [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}Error: Package $PACKAGE_NAME not found${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Bumping version in $PACKAGE_DIR${NC}"
  cd "$PACKAGE_DIR"
  npm version "$VERSION_TYPE" --no-git-tag-version
  cd - > /dev/null
fi

echo -e "${GREEN}✅ Version bump complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the changes: git diff"
echo "2. Commit the changes: git add . && git commit -m 'chore: bump version to X.X.X'"
echo "3. Push to main: git push origin main"
echo "4. The CI/CD will automatically publish to npm"
