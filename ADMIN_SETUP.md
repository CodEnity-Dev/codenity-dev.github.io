# Quick Setup Guide - Admin Panel Authentication

## 🚀 Quick Start (5 minutes)

Follow these steps to fix the admin panel login:

### 1️⃣ Create GitHub OAuth App (2 min)

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   ```
   Application name: CodEnity CMS
   Homepage URL: https://codenity-dev.github.io
   Callback URL: https://codenity-dev.github.io/admin/callback.html
   ```
4. Save the **Client ID** and **Client Secret**

### 2️⃣ Deploy to Netlify (2 min)

1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub and select: `codenity-dev/codenity-dev.github.io`
4. Configure:
   ```
   Build command: bundle install && bundle exec jekyll build
   Publish directory: _site
   ```
5. In **"Advanced"**, add environment variables:
   ```
   GITHUB_CLIENT_ID = (paste your client ID)
   GITHUB_CLIENT_SECRET = (paste your client secret)
   ORIGIN = https://codenity-dev.github.io
   ```
6. Click **"Deploy site"**

### 3️⃣ Update Config (1 min)

1. After deployment, copy your Netlify URL (e.g., `https://codenity-cms-abc123.netlify.app`)
2. Edit `admin/config.yml` line 6:
   ```yaml
   base_url: https://your-netlify-url.netlify.app
   ```
3. Commit and push:
   ```powershell
   git add admin/config.yml
   git commit -m "fix: Update OAuth backend URL"
   git push
   ```

### 4️⃣ Test (30 sec)

1. Visit: https://codenity-dev.github.io/admin/
2. Click **"Login with GitHub"**
3. Authorize the app
4. ✅ You're in!

## 🔍 Verification Checklist

- [ ] GitHub OAuth App created
- [ ] Netlify site deployed successfully
- [ ] Environment variables set in Netlify
- [ ] `base_url` updated in config.yml
- [ ] Changes pushed to GitHub
- [ ] Login works at `/admin/`

## ❌ Still Not Working?

### Check These Common Issues:

1. **"Page not found" on OAuth redirect**
   - Make sure `base_url` in config.yml matches your Netlify URL exactly

2. **"Authentication failed"**
   - Verify environment variables in Netlify Dashboard
   - Check that callback URL in GitHub OAuth App is exact: `https://codenity-dev.github.io/admin/callback.html`

3. **"Unauthorized"**
   - Go to GitHub Settings → Applications
   - Authorize the OAuth app for the `codenity-dev` organization

4. **Still stuck?**
   - Check Netlify function logs: Functions → `auth` → View logs
   - Check browser console (F12) for errors

## 📖 Full Documentation

For detailed documentation, see [OAuth-Proxy-Setup.md](OAuth-Proxy-Setup.md)

## 🆘 Need Help?

Common commands:

```powershell
# View Netlify logs
netlify logs

# Test locally
netlify dev

# Rebuild and deploy
netlify deploy --prod
```

---

**Quick tip**: Bookmark `https://your-netlify-site.netlify.app` to access the admin panel directly from there too!
