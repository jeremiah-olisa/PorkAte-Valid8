# 🚀 Deploying Documentation to GitHub Pages

This guide will help you deploy your Porkate-Valid8 documentation to GitHub Pages.

## Prerequisites

- GitHub repository with push access
- Documentation files in the `docs/` folder
- GitHub Actions enabled in your repository

## Quick Setup (5 Minutes)

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/jeremiah-olisa/PorkAte-Valid8
2. Click on **Settings** (top right)
3. Scroll down to **Pages** in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - (This allows the workflow to deploy)

![GitHub Pages Settings](https://docs.github.com/assets/cb-49559/mw-1440/images/help/pages/pages-settings-source.webp)

### Step 2: Commit and Push

The workflow file is already created at `.github/workflows/deploy-docs.yml`. Just push it:

```bash
# Add all documentation files
git add .github/workflows/deploy-docs.yml
git add docs/
git add packages/*/README.md

# Commit
git commit -m "docs: Add GitHub Pages deployment workflow"

# Push to main branch
git push origin main
```

### Step 3: Wait for Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see a workflow running: "Deploy Documentation to GitHub Pages"
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, your docs will be live!

### Step 4: Access Your Documentation

Your documentation will be available at:

```
https://jeremiah-olisa.github.io/PorkAte-Valid8/
```

Or check the deployment URL in the Actions workflow output.

## What Gets Deployed

The workflow automatically deploys:

- ✅ All files from `docs/` folder
- ✅ All package READMEs (converted to HTML)
- ✅ Tutorials
- ✅ Architecture documentation
- ✅ A beautiful landing page

## Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab
2. Select "Deploy Documentation to GitHub Pages"
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

## Automatic Updates

The documentation will automatically update when you:

- Push changes to `docs/**`
- Update any `packages/*/README.md`
- Modify the workflow file

## Workflow Details

The deployment workflow:

1. **Checks out** your code
2. **Installs dependencies** with pnpm
3. **Builds packages** (if needed)
4. **Creates site structure**:
   - Copies all documentation
   - Converts Markdown to HTML
   - Creates a landing page
5. **Deploys** to GitHub Pages

## Customization

### Landing Page

Edit the HTML in `.github/workflows/deploy-docs.yml` (around line 74) to customize the landing page.

### Styling

The workflow uses:
- GitHub Markdown CSS for document styling
- Custom CSS for the landing page
- Responsive design for mobile/desktop

### Domain

To use a custom domain:

1. Go to **Settings** > **Pages**
2. Under **Custom domain**, enter your domain
3. Add a `CNAME` file to `docs/` folder:
   ```bash
   echo "docs.yourdomain.com" > docs/CNAME
   ```

## Troubleshooting

### Deployment Failed

**Check the workflow logs**:
1. Go to **Actions** tab
2. Click on the failed workflow
3. Click on the failed job
4. Review the error messages

**Common issues**:

1. **Permission denied**:
   - Go to **Settings** > **Actions** > **General**
   - Scroll to "Workflow permissions"
   - Select "Read and write permissions"
   - Save

2. **Pages not enabled**:
   - Go to **Settings** > **Pages**
   - Ensure Source is set to "GitHub Actions"

3. **404 Not Found**:
   - Wait a few minutes after deployment
   - Clear browser cache
   - Check if the workflow completed successfully

### Site Not Updating

1. Check if the workflow ran:
   - Go to **Actions** tab
   - Verify the latest workflow succeeded

2. Clear cache:
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache

3. Force rebuild:
   - Make a small change to any doc file
   - Commit and push

### Custom Workflow Trigger

Add to `.github/workflows/deploy-docs.yml`:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:  # Allows manual trigger
```

## Viewing Locally

Before pushing, test locally:

```bash
# Build the site
mkdir -p _site
cp -r docs/* _site/

# Serve with Python
cd _site && python3 -m http.server 8080

# Or with Node.js
npx http-server _site -p 8080

# Open: http://localhost:8080
```

## Advanced Configuration

### Environment Variables

Add secrets for sensitive data:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add secrets (e.g., API keys for analytics)

### Analytics

Add Google Analytics to the landing page:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Search

Add search functionality using [Docsify](https://docsify.js.org/) or [DocSearch](https://docsearch.algolia.com/).

## Best Practices

1. **Keep docs in sync**: Update docs when code changes
2. **Version docs**: Consider versioned documentation for releases
3. **Test locally**: Always test before pushing
4. **Use branches**: Use PRs for documentation changes
5. **Monitor**: Check workflow runs regularly

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Markdown Guide](https://www.markdownguide.org/)

## Need Help?

- Check [GitHub Pages Status](https://www.githubstatus.com/)
- Review [workflow logs](#troubleshooting)
- Open an issue in the repository

---

**Ready to deploy?** Just follow Steps 1-4 above! 🚀

Your documentation will be live at:
### 🌐 https://jeremiah-olisa.github.io/PorkAte-Valid8/
