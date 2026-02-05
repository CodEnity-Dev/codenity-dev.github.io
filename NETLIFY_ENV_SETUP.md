# Netlify Environment Variables Setup

## ⚠️ CRITICAL: Required Configuration

Your CMS authentication is failing because **Netlify environment variables are not configured**.

## Steps to Fix:

### 1. Go to Netlify Dashboard

Visit: https://app.netlify.com/sites/codenity-admin/settings/deploys#environment

### 2. Add Environment Variables

Click **"Environment variables"** in the sidebar, then **"Add a variable"**

Add these **TWO** variables:

#### Variable 1: GITHUB_CLIENT_ID

```
Key:   GITHUB_CLIENT_ID
Value: [Your GitHub OAuth App Client ID]
```

#### Variable 2: GITHUB_CLIENT_SECRET

```
Key:   GITHUB_CLIENT_SECRET
Value: [Your GitHub OAuth App Client Secret]
```

### 3. Get Your GitHub OAuth App Credentials

1. Go to: https://github.com/settings/developers
2. Click on your OAuth App (or create one if you haven't)
3. Copy the **Client ID**
4. Click **"Generate a new client secret"** if you don't have one
5. Copy the **Client secret** (save it - you can only see it once!)

### 4. GitHub OAuth App Settings

Make sure your OAuth App has:

**Application name:** `CodEnity CMS` (or your preferred name)

**Homepage URL:** `https://codenity-dev.github.io`

**Authorization callback URL:** `https://codenity-dev.github.io/admin/callback.html`

### 5. Save and Redeploy

1. After adding both environment variables in Netlify
2. Go to **Deploys** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait 30 seconds for deployment
5. Try logging in again!

## Verification

After setup, the error message should change from:
❌ "the client_id and/or client_secret passed are incorrect"

To:
✅ "Authentication successful! Closing window..."

## Troubleshooting

### Still getting errors?

1. **Check variable names** - They must be EXACTLY:
   - `GITHUB_CLIENT_ID` (not client_id or CLIENT_ID)
   - `GITHUB_CLIENT_SECRET` (not client_secret or CLIENT_SECRET)

2. **Check for spaces** - No spaces before/after the values

3. **Redeploy** - Environment changes require a new deployment

4. **Check OAuth App** - Make sure the callback URL matches exactly:
   `https://codenity-dev.github.io/admin/callback.html`

5. **Check repo access** - Your GitHub account must have write access to:
   `codenity-dev/codenity-dev.github.io`

## Need Help?

If issues persist after following all steps:

1. Check Netlify function logs: https://app.netlify.com/sites/codenity-admin/logs/functions
2. Check browser console for detailed error messages
3. Verify GitHub OAuth app is active (not suspended)
