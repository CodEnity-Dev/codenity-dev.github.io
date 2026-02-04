# 🔧 Quick Setup Guide - CodEnity CMS Authentication

## ⚡ Fast Track Setup (5 minutes)

### 1️⃣ GitHub OAuth App

```
URL: https://github.com/settings/developers
Action: New OAuth App

Settings:
├─ Name: CodEnity CMS
├─ Homepage: https://codenity-dev.github.io
└─ Callback: https://codenity-dev.github.io/admin/callback.html

Copy: Client ID + Client Secret
```

### 2️⃣ Deploy to Netlify

```bash
# Go to: https://app.netlify.com/

1. "Add new site" > "Import existing project"
2. Connect to: codenity-dev/codenity-dev.github.io
3. Build settings:
   - Command: bundle install && bundle exec jekyll build
   - Directory: _site
4. Deploy site
```

### 3️⃣ Set Environment Variables

```
Netlify Dashboard > Site settings > Environment variables

Add these 3 variables:
┌────────────────────────────┬──────────────────────────────┐
│ GITHUB_CLIENT_ID           │ [from step 1]                │
│ GITHUB_CLIENT_SECRET       │ [from step 1]                │
│ ORIGIN                     │ https://codenity-dev.github.io│
└────────────────────────────┴──────────────────────────────┘
```

### 4️⃣ Update Config Files

**Copy your Netlify URL:** `https://YOUR-SITE-NAME.netlify.app`

**Replace in 3 files:**

#### File 1: `admin/config.yml` (Line 9)

```yaml
base_url: https://YOUR-SITE-NAME.netlify.app
```

#### File 2: `admin/callback.html` (Line ~118)

```javascript
authBaseUrl = "https://YOUR-SITE-NAME.netlify.app";
```

#### File 3: `admin/auth.html` (Line ~76)

```javascript
authBaseUrl = "https://YOUR-SITE-NAME.netlify.app";
```

### 5️⃣ Deploy & Test

```bash
git add .
git commit -m "fix: configure OAuth authentication"
git push origin main

# Wait 2-3 minutes for GitHub Pages deployment

# Test at: https://codenity-dev.github.io/admin/
```

## ✅ Verification Checklist

- [ ] GitHub OAuth App created
- [ ] Callback URL matches exactly
- [ ] Netlify site deployed
- [ ] All 3 environment variables set
- [ ] Config files updated with Netlify URL
- [ ] Changes committed and pushed
- [ ] GitHub Pages deployed
- [ ] Authentication tested successfully

## 🚨 Common Issues

| Error                        | Fix                                    |
| ---------------------------- | -------------------------------------- |
| "client_id/secret incorrect" | Check environment variables in Netlify |
| "CORS error"                 | Verify Netlify URL in config files     |
| Popup closes immediately     | Check GitHub OAuth callback URL        |
| "Configuration error"        | Ensure all env vars are set            |

## 📊 Quick Status Check

### Netlify Function Logs

```
Netlify Dashboard > Functions > auth > Logs

Should see:
✅ "Exchanging authorization code..."
✅ "Successfully obtained access token"

Should NOT see:
❌ "Missing GitHub OAuth credentials"
❌ "GITHUB_CLIENT_ID environment variable is not set"
```

### GitHub Pages Status

```
GitHub Repo > Actions tab

Should see:
✅ Green checkmark on latest commit
✅ "pages build and deployment" workflow succeeded
```

## 🎯 Expected Flow

```mermaid
User clicks "Login"
    ↓
Redirects to GitHub
    ↓
User authorizes
    ↓
GitHub redirects to callback.html
    ↓
Callback exchanges code via Netlify function
    ↓
Function returns access token
    ↓
CMS authenticates
    ↓
✅ Dashboard loads
```

## 📞 Still Having Issues?

1. Open browser console (F12)
2. Go to Network tab
3. Try logging in
4. Check for failed requests
5. Look at Netlify function logs
6. Review [AUTHENTICATION_FIX.md](AUTHENTICATION_FIX.md) for detailed troubleshooting

---

**Total Setup Time:** ~5-10 minutes  
**Difficulty:** Beginner  
**Prerequisites:** GitHub account, Netlify account
