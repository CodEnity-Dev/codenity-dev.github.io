# Security Policy

## 🔒 Security Considerations

### OAuth Credentials

**IMPORTANT**: The `GITHUB_CLIENT_ID` mentioned in this repository should be treated as semi-public (it's exposed in the frontend), but the `GITHUB_CLIENT_SECRET` must NEVER be committed to the repository.

### What's Public vs Private

✅ **Safe to expose (client-side)**:
- `GITHUB_CLIENT_ID` - Used in frontend, necessary for OAuth flow
- Repository name and structure
- CMS configuration (admin/config.yml)

🔐 **Must remain secret (server-side only)**:
- `GITHUB_CLIENT_SECRET` - Store only in Netlify environment variables
- Access tokens
- Personal access tokens
- Any API keys

### Best Practices

1. **Never commit secrets**
   - Use environment variables for all secrets
   - Check `.gitignore` includes `.env` files
   - Review commits before pushing

2. **Rotate credentials if exposed**
   - If you accidentally commit a secret, immediately:
     - Regenerate the secret in GitHub
     - Update Netlify environment variables
     - Force push to remove from history

3. **Limit OAuth scopes**
   - Only request necessary permissions (`repo`, `user`)
   - Review OAuth app permissions regularly

4. **Use HTTPS everywhere**
   - All OAuth redirects must use HTTPS
   - GitHub Pages enforces this automatically

5. **Monitor access**
   - Regularly review authorized OAuth apps in GitHub Settings
   - Check Netlify function logs for suspicious activity

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please email: [security contact email]

**DO NOT** create a public GitHub issue for security vulnerabilities.

## 🔄 Credential Rotation Schedule

Recommended rotation schedule:
- **OAuth secrets**: Every 6-12 months
- **Access tokens**: Use short-lived tokens when possible
- **After incidents**: Immediately after any suspected compromise

## ✅ Security Checklist

Before deployment:
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in commit history
- [ ] OAuth app callback URLs match exactly
- [ ] CORS properly configured in Netlify function
- [ ] HTTPS enforced on GitHub Pages
- [ ] Environment variables set in Netlify (not in code)
- [ ] OAuth app limited to necessary scopes
- [ ] Security headers configured in `netlify.toml`

## 📚 Additional Resources

- [GitHub OAuth Security Best Practices](https://docs.github.com/en/developers/apps/building-oauth-apps/best-practices-for-oauth-apps)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Netlify Security](https://docs.netlify.com/security/)

---

**Last Updated**: February 2026