# OAuth Authentication Setup for Decap CMS

Complete guide to set up GitHub OAuth authentication for the Decap CMS admin panel.

## 🎯 Overview

This project uses **Decap CMS** (formerly Netlify CMS) with GitHub as the content backend. Since GitHub Pages is a static host, we need a serverless OAuth provider to handle authentication.

## 🏗️ Architecture

```
User → Admin Panel → GitHub OAuth → Netlify Function → GitHub API → Access Token → CMS
```

## 📋 Prerequisites

1. GitHub account with repository access
2. Netlify account (free tier works)
3. GitHub OAuth App credentials

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `CodEnity CMS OAuth`
   - **Homepage URL**: `https://codenity-dev.github.io`
   - **Authorization callback URL**: `https://codenity-dev.github.io/admin/callback.html`
4. Click "Register application"
5. **Save** the `Client ID` and generate a `Client Secret`

### Step 2: Deploy OAuth Backend to Netlify

#### Option A: Manual Deployment

1. Create a new site on Netlify
2. Link to your GitHub repository: `codenity-dev/codenity-dev.github.io`
3. Configure build settings:
   - **Build command**: `bundle install && bundle exec jekyll build`
   - **Publish directory**: `_site`
4. Go to Site settings → Environment variables
5. Add these environment variables:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ORIGIN=https://codenity-dev.github.io
   ```
6. Deploy the site

#### Option B: Deploy Button (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/codenity-dev/codenity-dev.github.io)

1. Click the button above
2. Connect your GitHub account
3. Configure the required environment variables when prompted
4. Deploy

### Step 3: Update CMS Configuration

After deploying to Netlify, you'll get a URL like: `https://your-site-name.netlify.app`

1. Open [admin/config.yml](admin/config.yml)
2. Update the `base_url` line:
   ```yaml
   backend:
     name: github
     repo: codenity-dev/codenity-dev.github.io
     branch: main
     base_url: https://your-site-name.netlify.app # ← Update this
     auth_endpoint: /.netlify/functions/auth
   ```
3. Commit and push the changes

### Step 4: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Set source to: **Deploy from a branch**
3. Select branch: `gh-pages` / `root`
4. Enable **Enforce HTTPS**

### Step 5: Test Authentication

1. Visit `https://codenity-dev.github.io/admin/`
2. Click "Login with GitHub"
3. Authorize the OAuth app
4. You should be redirected to the CMS dashboard

## 🔒 Security Best Practices

### Environment Variables

Never commit these secrets to your repository:

- `GITHUB_CLIENT_SECRET`
- Any API keys or tokens

Always set them in Netlify's environment variables interface.

### OAuth Scopes

The OAuth app requests minimal scopes:

- `repo` - Required to read/write repository content
- `user` - Required to identify the authenticated user

### CORS Configuration

The serverless function includes proper CORS headers to prevent unauthorized access:

```javascript
'Access-Control-Allow-Origin': process.env.ORIGIN || '*'
```

In production, `ORIGIN` should be set to your exact domain.

## 🧪 Testing Locally

### Local Backend Development

For local testing without OAuth:

1. Open [admin/config.yml](admin/config.yml)
2. Uncomment the test backend:
   ```yaml
   backend:
     name: test-repo
   ```
3. Comment out the GitHub backend
4. Run `bundle exec jekyll serve`
5. Visit `http://localhost:4000/admin/`

### Testing Netlify Functions Locally

Install Netlify CLI:

```powershell
npm install -g netlify-cli
```

Run locally:

```powershell
netlify dev
```

## 🐛 Troubleshooting

### "Page not found" Error

**Problem**: OAuth redirect goes to `decap-oauth.netlify.app` which doesn't exist.

**Solution**: Update `base_url` in [admin/config.yml](admin/config.yml) to your Netlify deployment URL.

### "Authentication Failed" Error

**Causes**:

1. **Invalid credentials**: Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
2. **Wrong callback URL**: Must match the one in GitHub OAuth App settings
3. **CORS issues**: Ensure `ORIGIN` environment variable is set correctly

**Debug steps**:

```powershell
# Check Netlify function logs
netlify functions:log auth

# Test function locally
netlify functions:invoke auth --payload '{"code":"test_code"}'
```

### "Unauthorized" Error

**Problem**: GitHub OAuth app not authorized for the repository.

**Solution**:

1. Go to GitHub Settings → Applications → Authorized OAuth Apps
2. Find your OAuth app
3. Grant access to the `codenity-dev` organization
4. Try logging in again

### Function Returns 500 Error

**Check**:

1. Environment variables are set in Netlify
2. `node-fetch` dependency is installed
3. Function deployment succeeded

**View logs**:

```powershell
netlify logs:function auth
```

## 📁 File Structure

```
codenity-dev.github.io/
├── admin/
│   ├── config.yml           # CMS configuration
│   ├── index.html           # Admin panel entry point
│   ├── callback.html        # OAuth callback handler
│   └── auth.html            # Auth initiation page
├── netlify/
│   └── functions/
│       └── auth.js          # Serverless OAuth handler
├── netlify.toml             # Netlify configuration
├── package.json             # Node dependencies
└── OAuth-Proxy-Setup.md     # This file
```

## 🔄 OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Login with GitHub" in admin panel          │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Redirected to GitHub OAuth authorization page           │
│    https://github.com/login/oauth/authorize                │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User approves, GitHub redirects to callback with code   │
│    /admin/callback.html?code=xyz123                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Callback sends code to Netlify Function                 │
│    POST /.netlify/functions/auth                           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Function exchanges code for access token with GitHub    │
│    POST https://github.com/login/oauth/access_token        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Function returns token to CMS                           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. CMS uses token to access GitHub API and manage content  │
└─────────────────────────────────────────────────────────────┘
```

## 🆘 Support

If you encounter issues:

1. Check Netlify function logs: `netlify logs`
2. Review GitHub OAuth app settings
3. Verify all environment variables are set
4. Test with local backend first
5. Check browser console for JavaScript errors

## 📚 Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)

## ✅ Deployment Checklist

- [ ] GitHub OAuth App created
- [ ] Client ID and Secret saved securely
- [ ] Netlify site deployed
- [ ] Environment variables configured
- [ ] `base_url` updated in config.yml
- [ ] GitHub Pages enabled
- [ ] OAuth callback URL matches
- [ ] Test login successful

---

**Last Updated**: February 2026
**Maintained by**: CodEnity Team
