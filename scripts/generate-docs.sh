#!/usr/bin/env bash

# Porkate-Valid8 Documentation Generator
# Generates both HTML and Markdown documentation using JSDoc

set -e

echo "🚀 Generating Porkate-Valid8 Documentation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if jsdoc is installed
if ! command -v jsdoc &> /dev/null; then
    echo -e "${RED}❌ JSDoc is not installed${NC}"
    echo "Installing JSDoc..."
    pnpm install -D jsdoc better-docs docdash jsdoc-plugin-typescript jsdoc-to-markdown
fi

# Clean previous documentation
echo -e "${YELLOW}🧹 Cleaning previous documentation...${NC}"
rm -rf docs/html docs/markdown
mkdir -p docs/html docs/markdown

# Generate HTML documentation
echo -e "${YELLOW}📄 Generating HTML documentation...${NC}"
jsdoc -c jsdoc.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ HTML documentation generated successfully${NC}"
    echo -e "   Location: docs/html/index.html"
else
    echo -e "${RED}❌ HTML documentation generation failed${NC}"
    exit 1
fi

# Generate Markdown documentation
echo -e "${YELLOW}📝 Generating Markdown documentation...${NC}"

# Generate markdown for each package
packages=("core" "identitypass" "nest" "dashboard")

for package in "${packages[@]}"; do
    echo -e "   Processing ${package}..."
    
    # Find all TypeScript files in the package
    files=$(find "packages/${package}" -name "*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__tests__/*" -not -path "*/test/*")
    
    if [ -n "$files" ]; then
        # Create package-specific markdown
        echo "# ${package^} API Documentation" > "docs/markdown/${package}.md"
        echo "" >> "docs/markdown/${package}.md"
        echo "Generated on $(date)" >> "docs/markdown/${package}.md"
        echo "" >> "docs/markdown/${package}.md"
        
        # Process each file
        for file in $files; do
            echo "## $(basename $file)" >> "docs/markdown/${package}.md"
            echo "" >> "docs/markdown/${package}.md"
            echo "\`\`\`typescript" >> "docs/markdown/${package}.md"
            head -50 "$file" >> "docs/markdown/${package}.md"
            echo "\`\`\`" >> "docs/markdown/${package}.md"
            echo "" >> "docs/markdown/${package}.md"
        done
    fi
done

echo -e "${GREEN}✅ Markdown documentation generated successfully${NC}"
echo -e "   Location: docs/markdown/"

# Generate index file
echo -e "${YELLOW}📋 Generating documentation index...${NC}"

cat > docs/markdown/INDEX.md << 'EOF'
# Porkate-Valid8 API Documentation

## Packages

- [Core](./core.md) - Core verification manager and interfaces
- [IdentityPass](./identitypass.md) - IdentityPass adapter implementation
- [NestJS](./nest.md) - NestJS integration module
- [Dashboard](./dashboard.md) - Monitoring dashboard

## Quick Links

- [HTML Documentation](../html/index.html)
- [GitHub Repository](https://github.com/jeremiah-olisa/PorkAte-Valid8)
- [Main README](../../README.md)

## Tutorials

- [Installation and Setup](../tutorials/01-installation.md)
- [Basic Verification](../tutorials/02-basic-verification.md)

---

Generated on $(date)
EOF

echo -e "${GREEN}✅ Documentation index generated${NC}"

# Print summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Documentation generation completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📁 Generated files:"
echo "   • HTML Documentation: docs/html/index.html"
echo "   • Markdown Documentation: docs/markdown/"
echo ""
echo "🌐 To view HTML documentation locally:"
echo "   cd docs/html && python3 -m http.server 8080"
echo "   Then open: http://localhost:8080"
echo ""
echo "📖 To view Markdown documentation:"
echo "   cat docs/markdown/INDEX.md"
echo ""
