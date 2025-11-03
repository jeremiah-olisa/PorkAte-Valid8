#!/usr/bin/env bash

# Simple JSDoc HTML documentation generator
# This script generates HTML documentation using JSDoc

set -e

echo "📄 Generating HTML documentation with JSDoc..."

# Clean previous HTML documentation
rm -rf docs/html
mkdir -p docs/html

# Generate HTML documentation
npx jsdoc -c jsdoc.json

if [ $? -eq 0 ]; then
    echo "✅ HTML documentation generated successfully!"
    echo "   Location: docs/html/index.html"
    echo ""
    echo "To view locally, run:"
    echo "   cd docs/html && python3 -m http.server 8080"
    echo "   Then open http://localhost:8080"
else
    echo "❌ Documentation generation failed"
    exit 1
fi
