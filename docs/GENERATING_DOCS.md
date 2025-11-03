# Documentation Generation Guide

This guide explains how to generate and view documentation for the Porkate-Valid8 project.

## 📚 Available Documentation

### 1. Package READMEs
Each package has its own README with usage examples:
- [`packages/core/README.md`](../packages/core/README.md) - Core verification framework
- [`packages/identitypass/README.md`](../packages/identitypass/README.md) - IdentityPass adapter
- [`packages/nest/README.md`](../packages/nest/README.md) - NestJS integration
- [`packages/dashboard/README.md`](../packages/dashboard/README.md) - Monitoring dashboard

### 2. HTML API Documentation (JSDoc)
Interactive, browsable API documentation generated from TypeScript source code.

**Location**: `docs/html/index.html` (after generation)

### 3. Tutorials
Step-by-step guides in `docs/tutorials/`:
- [Installation and Setup](./tutorials/01-installation.md)
- [Basic Verification](./tutorials/02-basic-verification.md)

### 4. Architecture Documentation
Comprehensive architecture overview in [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)

## 🚀 Quick Start - Generating Documentation

### Prerequisites

```bash
# Ensure dependencies are installed
pnpm install
```

### Generate HTML Documentation

```bash
# Using npm script (recommended)
pnpm run docs:html

# Or using the script directly
./scripts/generate-docs-simple.sh
```

This will:
1. Clean the `docs/html/` directory
2. Generate JSDoc HTML documentation
3. Output to `docs/html/index.html`

### View Documentation

After generation, you can view the documentation in several ways:

#### Option 1: Using Python HTTP Server (Recommended)

```bash
# Serve documentation on http://localhost:8080
pnpm run docs:serve

# Or manually
cd docs/html && python3 -m http.server 8080
```

Then open your browser to: http://localhost:8080

#### Option 2: Using Node.js http-server

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Serve documentation
cd docs/html && http-server -p 8080
```

#### Option 3: Open Directly in Browser

```bash
# On Linux
xdg-open docs/html/index.html

# On macOS
open docs/html/index.html

# On Windows
start docs/html/index.html
```

## 🔧 Available Commands

Add these to your workflow:

```bash
# Generate HTML documentation
pnpm run docs:html

# Serve documentation locally
pnpm run docs:serve

# Clean generated documentation
pnpm run docs:clean
```

## 📁 Documentation Structure

```
docs/
├── README.md                    # Main documentation index
├── DOCS_README.md              # This file - Documentation guide
├── ARCHITECTURE.md             # Architecture documentation
├── html/                       # Generated HTML docs (gitignored)
│   └── index.html             # JSDoc HTML entry point
├── markdown/                   # Generated markdown (gitignored)
│   └── *.md                   # API documentation in markdown
├── tutorials/                  # Step-by-step guides
│   ├── 01-installation.md
│   ├── 02-basic-verification.md
│   └── ...
└── assets/                     # Documentation assets
    └── (images, diagrams, etc.)
```

## 📝 JSDoc Configuration

The HTML documentation is generated using JSDoc with the following configuration:

### `jsdoc.json`

```json
{
  "source": {
    "include": [
      "packages/core",
      "packages/identitypass", 
      "packages/nest",
      "packages/dashboard"
    ],
    "includePattern": ".+\\.ts(x)?$",
    "excludePattern": "(node_modules|dist|__tests__|test)"
  },
  "opts": {
    "template": "node_modules/better-docs",
    "destination": "./docs/html/",
    "recurse": true,
    "readme": "./README.md"
  }
}
```

### Customizing JSDoc Output

You can customize the documentation by:

1. **Editing `jsdoc.json`** - Change template, add plugins, modify output directory
2. **Using different templates**:
   - `better-docs` (default) - Modern, feature-rich template
   - `docdash` - Clean, responsive template
   - Default JSDoc template

Example of switching templates:

```json
{
  "opts": {
    "template": "node_modules/docdash"
  }
}
```

## 📖 Writing Documentation

### Adding JSDoc Comments

Document your TypeScript code with JSDoc comments:

```typescript
/**
 * Verifies a Nigerian National Identification Number (NIN)
 * 
 * @param {NINVerificationRequest} data - The verification request data
 * @param {string} data.nin - The 11-digit NIN to verify
 * @param {string} data.firstName - The first name to match
 * @param {string} data.lastName - The last name to match
 * @param {string} [data.dateOfBirth] - Optional date of birth (YYYY-MM-DD)
 * 
 * @returns {Promise<VerificationResponse>} The verification result
 * 
 * @throws {VerificationException} If verification service is unavailable
 * @throws {Error} If request fails or times out
 * 
 * @example
 * const result = await ninService.verifyNIN({
 *   nin: '12345678901',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '1990-01-01'
 * });
 * 
 * if (result.success) {
 *   console.log('Verified:', result.data);
 * }
 * 
 * @see {@link https://myidentitypass.com/docs|IdentityPass API Docs}
 */
async verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse> {
  // Implementation
}
```

### JSDoc Tags Reference

Common JSDoc tags:

- `@param` - Document parameters
- `@returns` / `@return` - Document return value
- `@throws` - Document exceptions
- `@example` - Provide usage examples
- `@see` - Link to related documentation
- `@deprecated` - Mark deprecated code
- `@since` - Document version introduced
- `@type` - Specify type
- `@typedef` - Define custom types
- `@interface` - Define interfaces

## 🐛 Troubleshooting

### Documentation Won't Generate

**Issue**: "jsdoc: command not found"

```bash
# Solution: Install dependencies
pnpm install -w -D jsdoc better-docs
```

**Issue**: "Permission denied" when running scripts

```bash
# Solution: Make scripts executable
chmod +x scripts/*.sh
```

### No Files Processed

**Issue**: JSDoc reports "There are no input files to process"

Check:
1. `jsdoc.json` source paths are correct
2. TypeScript files exist in specified directories
3. File patterns match your files

### Template Errors

**Issue**: "Cannot find module 'better-docs'"

```bash
# Solution: Reinstall template
pnpm install -w -D better-docs
```

## 🎨 Customization

### Custom CSS

Add custom styling to generated docs:

1. Create `docs/assets/custom.css`
2. Add to `jsdoc.json`:

```json
{
  "templates": {
    "default": {
      "staticFiles": {
        "include": ["./docs/assets"]
      }
    }
  }
}
```

### Custom Logo

Add your logo to the documentation:

1. Place logo in `docs/assets/logo.png`
2. Configure in `jsdoc.json` (template-specific)

## 📊 Documentation Coverage

To check documentation coverage:

```bash
# Generate docs with verbose output
npx jsdoc -c jsdoc.json -v

# Look for warnings about undocumented code
```

## 🤝 Contributing Documentation

When contributing:

1. **Document all public APIs** - Add JSDoc comments to exported functions/classes
2. **Include examples** - Show how to use the API
3. **Update tutorials** - Add new tutorials for major features
4. **Test generation** - Ensure docs generate without errors
5. **Update README** - Keep package READMEs up to date

### Documentation Checklist

- [ ] JSDoc comments on all public APIs
- [ ] At least one `@example` per function
- [ ] Parameter and return types documented
- [ ] Exceptions documented with `@throws`
- [ ] Package README updated
- [ ] Tutorial added (if needed)
- [ ] Documentation generates without errors

## 📞 Support

- **Documentation Issues**: [GitHub Issues](https://github.com/jeremiah-olisa/PorkAte-Valid8/issues)
- **API Questions**: [GitHub Discussions](https://github.com/jeremiah-olisa/PorkAte-Valid8/discussions)

## 📄 License

Documentation is licensed under MIT, same as the project.

---

**Last Updated**: 2025-11-03
