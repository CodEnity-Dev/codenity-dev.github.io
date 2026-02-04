# 🎯 Netlify Project Selection Guide

## Your Current Situation

You have **2 Netlify projects**:

1. **codenity-admin**
2. **grand-stardust-714a33**

## ✅ RECOMMENDED: Use "codenity-admin"

Your code is now configured to use: `https://codenity-admin.netlify.app`

### Why "codenity-admin" is better:

- ✅ Has a meaningful, memorable name
- ✅ Easier to identify and manage
- ✅ Professional naming convention
- ✅ Already configured in your code

## 📋 Steps to Verify & Configure

### Step 1: Verify "codenity-admin" Setup

1. **Open Netlify Dashboard** → Click on **"codenity-admin"** project

2. **Check Functions:**
   - Click **"Functions"** in left sidebar
   - You should see: `auth` (JavaScript function)
   - Status should be: ✅ Active

3. **Set Environment Variables:**
   - Click **"Site settings"** → **"Environment variables"**
   - Add these 3 variables if not already set:

   ```
   Variable Name             Value
   ─────────────────────────────────────────────────────
   GITHUB_CLIENT_ID          [Your GitHub OAuth Client ID]
   GITHUB_CLIENT_SECRET      [Your GitHub OAuth Client Secret]
   ORIGIN                    https://codenity-dev.github.io
   ```

4. **Verify Build Settings:**
   - Go to **"Site settings"** → **"Build & deploy"** → **"Build settings"**
   - Should show:
     - Build command: `bundle install && bundle exec jekyll build`
     - Publish directory: `_site`

5. **Check Deployment Status:**
   - Go to **"Deploys"** tab
   - Latest deploy should be: ✅ Published

### Step 2: Get Your GitHub OAuth Credentials

If you don't have them yet:

1. Go to: https://github.com/settings/developers
2. Click on your OAuth App or create new one
3. **Settings must be:**
   - Homepage URL: `https://codenity-dev.github.io`
   - Callback URL: `https://codenity-dev.github.io/admin/callback.html`
4. Copy your **Client ID** and **Client Secret**

### Step 3: Test the OAuth Function

Open this URL in browser:

```
https://codenity-admin.netlify.app/.netlify/functions/auth
```

**Expected result:** Should redirect to GitHub OAuth authorization page

**If you get error:** Check environment variables and function deployment

### Step 4: Delete the Other Project (Optional)

Once "codenity-admin" is working:

1. Go to **"grand-stardust-714a33"** project
2. Click **"Site settings"**
3. Scroll down to **"Delete site"**
4. Click and confirm deletion

## ✅ Configuration Summary

Your files are NOW configured with these URLs:

| File                | Line | URL                                |
| ------------------- | ---- | ---------------------------------- |
| admin/config.yml    | 9    | https://codenity-admin.netlify.app |
| admin/callback.html | 121  | https://codenity-admin.netlify.app |
| admin/auth.html     | 99   | https://codenity-admin.netlify.app |

## 🧪 Testing Checklist

After setting environment variables:

1. ✅ Open: https://codenity-admin.netlify.app/.netlify/functions/auth
2. ✅ Should redirect to GitHub
3. ✅ Open: https://codenity-dev.github.io/admin/
4. ✅ Click "Login with GitHub"
5. ✅ Should authenticate successfully
6. ✅ CMS dashboard should load

## 🔍 Quick Comparison Table

| Feature            | codenity-admin   | grand-stardust-714a33 |
| ------------------ | ---------------- | --------------------- |
| **Name**           | ✅ Meaningful    | ❌ Random generated   |
| **Memorable**      | ✅ Easy          | ❌ Difficult          |
| **Professional**   | ✅ Yes           | ❌ No                 |
| **In Your Code**   | ✅ Configured    | ❌ Not used           |
| **Recommendation** | ✅ **KEEP THIS** | ⚠️ Can delete         |

## 🚨 Important Notes

1. **Only ONE project needed** - Both do the same thing
2. **Environment variables MUST be set** in the project you keep
3. **After setting env vars**, trigger a new deploy (or wait for auto-deploy)
4. **Test before deleting** the other project

## 💡 Pro Tips

- **Bookmark** your Netlify project: https://app.netlify.com/sites/codenity-admin
- **Monitor** function logs when testing authentication
- **Use** the same project for all future OAuth needs
- **Rename** if you want: Site settings → Site details → Change site name

## 🆘 If Something Goes Wrong

1. Check Netlify function logs: **Functions** → **auth** → **Logs**
2. Verify all 3 environment variables are set
3. Ensure GitHub OAuth callback URL matches exactly
4. Check browser console (F12) for errors
5. Review [AUTHENTICATION_FIX.md](AUTHENTICATION_FIX.md) for troubleshooting

---

**Next Step:** Set the 3 environment variables in "codenity-admin" and test!
