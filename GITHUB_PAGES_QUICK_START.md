# 🚀 Quick Deploy to GitHub Pages

## 3 Simple Steps

### 1️⃣ Enable GitHub Pages (IMPORTANT!)
**You MUST do this first manually:**

1. Go to: https://github.com/jeremiah-olisa/PorkAte-Valid8/settings/pages
2. Under **"Build and deployment"**:
   - **Source**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
3. Click **Save**

![Select GitHub Actions as source](https://docs.github.com/assets/cb-49559/mw-1440/images/help/pages/pages-settings-source.webp)

### 2️⃣ Push the Code
```bash
git add .
git commit -m "docs: Add GitHub Pages deployment"
git push origin main
```

### 3️⃣ Wait & View
- Check **Actions** tab for deployment progress
- View at: `https://jeremiah-olisa.github.io/PorkAte-Valid8/`

---

## That's It! 🎉

The workflow will automatically:
- ✅ Build your documentation
- ✅ Convert Markdown to HTML
- ✅ Create a beautiful landing page
- ✅ Deploy to GitHub Pages

**Auto-updates on every push to `docs/` or package READMEs!**

---

## ⚠️ Important Notes

- **Step 1 is REQUIRED**: You must enable GitHub Pages in settings before the workflow can deploy
- **Select "GitHub Actions"**: Don't select "Deploy from a branch" - it won't work
- **Wait for first deployment**: The first deployment takes 2-3 minutes

---

For detailed instructions, see [DEPLOYING_TO_GITHUB_PAGES.md](./docs/DEPLOYING_TO_GITHUB_PAGES.md)
