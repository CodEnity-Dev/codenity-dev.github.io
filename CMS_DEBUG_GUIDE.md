# 🐛 CMS Authentication Debug Guide

## Issues Fixed

### ✅ Critical Fixes Applied:

1. **Fixed postMessage Origin** - Callback now sends to correct origin (GitHub Pages)
2. **Added Window Validation** - Checks if parent window exists and is not closed
3. **Enhanced Logging** - Comprehensive console logging for debugging
4. **CMS Initialization Monitor** - Tracks if Decap CMS loads properly
5. **Better Error Handling** - Clear error messages and recovery options

## 🧪 Testing Steps

### Step 1: Open Browser Console (F12)

Before testing, open DevTools Console to see debug messages:

- **Chrome/Edge:** Press `F12` → Console tab
- **Firefox:** Press `F12` → Console tab

### Step 2: Test Authentication Flow

1. Go to: `https://codenity-dev.github.io/admin/`
2. Watch console for these messages:

   ```
   🚀 Page loaded, initializing CMS...
   ✅ Decap CMS loaded successfully
   ✨ CMS interface ready
   ```

3. Click "Login with GitHub" button
4. Authorize on GitHub
5. **In the callback popup**, watch for:

   ```
   ✅ Token received successfully
   📤 Sending authentication to parent window...
   🎯 Target origin: https://codenity-dev.github.io
   ✉️ Message sent to parent window
   ⏳ Waiting for CMS to process authentication...
   Authentication successful! Closing window...
   ```

6. **Back in admin window**, look for:

   ```
   📩 Received message: authorization:github:success:{"provider":"github","token":"..."}
   📍 Message origin: https://codenity-dev.github.io
   ```

7. CMS dashboard should load with your repository content

## 🔍 Common Issues & Solutions

### Issue 1: "Parent window not found"

**Symptoms:**

- Error in callback popup
- Says "Parent window not found"

**Cause:** Admin window was closed before callback completed

**Solution:**

1. Keep admin window open during authentication
2. Don't close any windows during the OAuth flow
3. Try again and don't touch anything until complete

### Issue 2: CMS Shows Loading Screen Forever

**Symptoms:**

- Loading spinner doesn't stop
- No error messages
- Console shows "CMS loaded" but interface doesn't appear

**Possible Causes:**

1. **Config.yml not found**
2. **Authentication not completing**
3. **Network issues**

**Solutions:**

**A. Verify config.yml exists:**

```
Check: https://codenity-dev.github.io/admin/config.yml
Should load without 404 error
```

**B. Check authentication:**

- Look for postMessage in console
- Should see "Received message: authorization:github:success:..."
- If missing, authentication didn't complete

**C. Check Network tab (F12 → Network):**

- Look for failed requests
- Check if GitHub API calls are succeeding

### Issue 3: Authentication Succeeds But CMS Empty

**Symptoms:**

- Callback says "Authentication successful"
- Admin window receives message
- But CMS shows no posts/collections

**Possible Causes:**

1. **Wrong repository in config.yml**
2. **Insufficient GitHub permissions**
3. **Branch doesn't exist**

**Solutions:**

**A. Verify config.yml settings:**

```yaml
backend:
  repo: codenity-dev/codenity-dev.github.io # ← Correct?
  branch: main # ← Does this branch exist?
```

**B. Check GitHub token permissions:**

- Open browser console
- Look for GitHub API errors
- Token should have `repo` scope

**C. Verify repository access:**

- Can you push to this repo?
- Is the repo private? (needs proper permissions)
- Does the `main` branch exist?

### Issue 4: CORS Errors

**Symptoms:**

- Console shows CORS errors
- "blocked by CORS policy" messages

**Cause:** Netlify function CORS configuration

**Solution:**

1. Check Netlify function logs
2. Verify environment variables are set
3. Check function is deployed and accessible

### Issue 5: Callback Popup Closes Immediately

**Symptoms:**

- Popup opens and closes instantly
- No error message
- No authentication

**Possible Causes:**

1. **GitHub OAuth callback URL mismatch**
2. **Code parameter missing**
3. **State validation failing**

**Solutions:**

**A. Verify GitHub OAuth App settings:**

```
Go to: https://github.com/settings/developers
Check: Authorization callback URL
Must be: https://codenity-dev.github.io/admin/callback.html
         (exactly - no trailing slash, correct path)
```

**B. Check console in popup (before it closes):**

- Open DevTools first
- Then click login
- Popup console will show errors

## 🎯 What Should Happen (Success Flow)

### 1. Admin Page Loads

```
Console output:
🚀 Page loaded, initializing CMS...
✅ Decap CMS loaded successfully
✨ CMS interface ready
```

### 2. Click Login Button

- GitHub authorization page opens in popup
- You see GitHub's OAuth consent screen

### 3. Authorize App

- Click "Authorize" on GitHub
- Popup redirects to callback.html

### 4. Callback Processes

```
Console output in popup:
✅ Token received successfully
📤 Sending authentication to parent window...
🎯 Target origin: https://codenity-dev.github.io
✉️ Message sent to parent window
Authentication successful! Closing window...
```

### 5. Admin Window Receives Auth

```
Console output in admin:
📩 Received message: authorization:github:success:...
📍 Message origin: https://codenity-dev.github.io
```

### 6. CMS Loads Content

- Collections appear in sidebar
- You can click "Blog Posts"
- Existing posts load
- "New Blog Post" button works

## 🔧 Advanced Debugging

### Check Netlify Function

Test the OAuth function directly:

```
https://codenity-admin.netlify.app/.netlify/functions/auth
```

**Expected:** Redirects to GitHub OAuth  
**If not:** Check Netlify function deployment and env vars

### Check Token Exchange

Look at Network tab during authentication:

1. F12 → Network tab
2. Click login
3. Look for POST to `/.netlify/functions/auth`
4. Check response - should contain `token` field

### Verify GitHub API Access

In console after authentication:

```javascript
// This should work if authenticated:
fetch("https://api.github.com/repos/codenity-dev/codenity-dev.github.io")
  .then((r) => r.json())
  .then((data) => console.log("Repo access:", data));
```

## 📋 Pre-Flight Checklist

Before reporting issues, verify:

- [ ] Environment variables set in Netlify
  - [ ] GITHUB_CLIENT_ID
  - [ ] GITHUB_CLIENT_SECRET
  - [ ] ORIGIN
- [ ] GitHub OAuth App settings correct
  - [ ] Callback URL: `https://codenity-dev.github.io/admin/callback.html`
  - [ ] Homepage URL: `https://codenity-dev.github.io`
- [ ] Netlify function deployed
  - [ ] Check Functions tab in Netlify
  - [ ] `auth` function exists
- [ ] config.yml accessible
  - [ ] Visit: https://codenity-dev.github.io/admin/config.yml
  - [ ] Should load without 404
- [ ] Repository settings correct
  - [ ] Repo exists: codenity-dev/codenity-dev.github.io
  - [ ] Branch exists: main
  - [ ] You have write access

## 🆘 Still Not Working?

### Collect Debug Information:

1. **Browser Console Output** (full log)
2. **Network Tab** (any failed requests)
3. **Netlify Function Logs** (if available)
4. **GitHub OAuth App Settings** (screenshot)
5. **What you see** (screenshot of error/issue)

### Try These:

1. **Hard Refresh**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

2. **Clear Cache and Cookies**
   - For codenity-dev.github.io
   - Then try again

3. **Incognito/Private Mode**
   - Tests without cache/extensions
   - If works here, it's a cache issue

4. **Different Browser**
   - Try Chrome, Firefox, Edge
   - Helps identify browser-specific issues

5. **Check GitHub Status**
   - Visit: https://www.githubstatus.com/
   - Ensure GitHub API is operational

## 📞 Getting Help

When asking for help, provide:

1. Console log output (F12 → Console)
2. Network errors (F12 → Network)
3. What you expected vs what happened
4. Screenshots if applicable
5. Browser and OS version

---

**Last Updated:** February 4, 2026  
**Status:** ✅ Enhanced debugging and logging added
