# Documentation

This folder contains comprehensive documentation for the Porkate-Valid8 verification framework.

## 📚 Documentation Types

### HTML Documentation
Interactive, browsable API documentation generated with JSDoc.

**Location**: `docs/html/index.html`

**To Generate**:
```bash
pnpm run docs:html
```

**To View**:
```bash
pnpm run docs:serve
# Open http://localhost:8080 in your browser
```

### Markdown Documentation
Markdown-formatted API reference and guides.

**Location**: `docs/markdown/`

**To Generate**:
```bash
pnpm run docs:markdown
```

### Tutorials
Step-by-step guides for getting started and advanced usage.

**Location**: `docs/tutorials/`

**Available Tutorials**:
1. [Installation and Setup](./tutorials/01-installation.md)
2. [Basic Verification](./tutorials/02-basic-verification.md)
3. Advanced Verification (coming soon)
4. NestJS Integration (coming soon)
5. Event System (coming soon)
6. Metrics Collection (coming soon)
7. Error Handling (coming soon)
8. Creating Custom Adapters (coming soon)

## 🚀 Quick Commands

```bash
# Generate all documentation
pnpm run docs:generate

# Generate HTML documentation only
pnpm run docs:html

# Generate Markdown documentation only
pnpm run docs:markdown

# Serve HTML documentation locally
pnpm run docs:serve

# Clean generated documentation
pnpm run docs:clean
```

## 📖 Reading Documentation

### For Developers
1. Start with [tutorials](./tutorials/) for guided learning
2. Reference [HTML documentation](./html/index.html) for API details
3. Check [package READMEs](../packages/) for package-specific info

### For API Reference
- Browse HTML documentation for interactive exploration
- Use Markdown documentation for quick reference
- Check source code comments for implementation details

## 🏗️ Documentation Structure

```
docs/
├── README.md                    # This file
├── html/                        # Generated HTML documentation
│   └── index.html              # Main entry point
├── markdown/                    # Generated Markdown docs
│   ├── INDEX.md                # Markdown index
│   ├── core.md                 # Core package docs
│   ├── identitypass.md         # IdentityPass adapter docs
│   ├── nest.md                 # NestJS integration docs
│   └── dashboard.md            # Dashboard docs
├── tutorials/                   # Step-by-step guides
│   ├── 01-installation.md
│   ├── 02-basic-verification.md
│   └── ...
└── assets/                      # Documentation assets
    └── (images, diagrams, etc.)
```

## 🔧 Customizing Documentation

### JSDoc Configuration

Edit `jsdoc.json` in the project root to customize HTML documentation:

```json
{
  "opts": {
    "template": "node_modules/better-docs",
    "destination": "./docs/html/",
    "recurse": true
  }
}
```

### Markdown Configuration

Edit `jsdoc-markdown.json` to customize Markdown generation.

## 📝 Contributing to Documentation

### Adding Tutorials

1. Create a new `.md` file in `docs/tutorials/`
2. Follow the naming convention: `##-topic-name.md`
3. Update the tutorial list in this README
4. Link from related documentation

### Improving API Documentation

1. Add JSDoc comments to source code:
   ```typescript
   /**
    * Verifies a Nigerian National Identification Number (NIN)
    * @param {NINVerificationRequest} data - The verification request data
    * @returns {Promise<VerificationResponse>} The verification result
    * @example
    * const result = await service.verifyNIN({
    *   nin: '12345678901',
    *   firstName: 'John',
    *   lastName: 'Doe'
    * });
    */
   async verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse> {
     // ...
   }
   ```

2. Regenerate documentation:
   ```bash
   pnpm run docs:generate
   ```

### Documentation Standards

- Use clear, concise language
- Provide code examples for all features
- Include error handling examples
- Link to related documentation
- Keep examples up-to-date with API changes

## 🐛 Troubleshooting

### Documentation Won't Generate

**Issue**: JSDoc not found
```bash
# Solution: Install dependencies
pnpm install
```

**Issue**: Permission denied on scripts
```bash
# Solution: Make script executable
chmod +x scripts/generate-docs.sh
```

### Documentation Server Won't Start

**Issue**: Port 8080 already in use
```bash
# Solution: Use a different port
cd docs/html && python3 -m http.server 8081
```

## 📞 Support

- Report documentation issues on [GitHub Issues](https://github.com/jeremiah-olisa/PorkAte-Valid8/issues)
- Suggest improvements via Pull Requests
- Ask questions in [GitHub Discussions](https://github.com/jeremiah-olisa/PorkAte-Valid8/discussions)

## 📄 License

Documentation is licensed under MIT, same as the project.
