# CodEnity - Developer Tools & Resources

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://codenity-dev.github.io)
[![Jekyll](https://img.shields.io/badge/Jekyll-4.3-red)](https://jekyllrb.com/)
[![Decap CMS](https://img.shields.io/badge/CMS-Decap-blue)](https://decapcms.org/)

Official website and blog for CodEnity - showcasing developer tools, browser extensions, and educational content.

## 🚀 Quick Start

### For Content Editors

1. Visit [/admin/](https://codenity-dev.github.io/admin/)
2. Login with GitHub
3. Start creating content!

**First time setup?** See [ADMIN_SETUP.md](ADMIN_SETUP.md) for authentication configuration.

### For Developers

```powershell
# Clone the repository
git clone https://github.com/codenity-dev/codenity-dev.github.io.git
cd codenity-dev.github.io

# Install dependencies
bundle install

# Run local development server
bundle exec jekyll serve --livereload

# Visit http://localhost:4000
```

## 📁 Project Structure

```
codenity-dev.github.io/
├── _posts/              # Blog posts (Markdown)
├── _data/               # Site data (YAML)
├── _layouts/            # Page templates
├── _includes/           # Reusable components
├── admin/               # CMS admin panel
├── assets/              # CSS, JS, images
├── apps/                # App showcase pages
├── blog/                # Blog section
└── videos/              # Video content
```

## 🛠️ Tech Stack

- **Static Site Generator**: Jekyll 4.3
- **CMS**: Decap CMS (GitHub backend)
- **Hosting**: GitHub Pages
- **OAuth Provider**: Netlify Functions
- **CI/CD**: GitHub Actions

## 📝 Content Management

### Creating Blog Posts

#### Via CMS (Recommended)

1. Go to [/admin/](https://codenity-dev.github.io/admin/)
2. Navigate to "Blog Posts"
3. Click "New Post"
4. Fill in the fields and publish

#### Via File System

1. Create a new file: `_posts/YYYY-MM-DD-title.md`
2. Add front matter:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: 2026-02-03 12:00:00 +0000
   categories: [tutorials, development]
   tags: [javascript, nodejs]
   author: "CodEnity Team"
   description: "SEO-friendly description"
   ---
   ```
3. Write content in Markdown
4. Commit and push

## 🔐 Admin Panel Setup

The admin panel requires OAuth authentication with GitHub.

### Quick Setup (5 minutes)

See [ADMIN_SETUP.md](ADMIN_SETUP.md) for step-by-step instructions to:

1. Create GitHub OAuth App
2. Deploy to Netlify
3. Configure authentication
4. Start managing content

### Troubleshooting

Common issues and solutions:

- **"Page not found" error**: Update `base_url` in `admin/config.yml`
- **Authentication fails**: Check environment variables in Netlify
- **Unauthorized error**: Authorize OAuth app in GitHub settings

Full documentation: [OAuth-Proxy-Setup.md](OAuth-Proxy-Setup.md)

## 🚢 Deployment

### Automatic Deployment

Pushes to `main` branch automatically deploy via GitHub Actions:

1. Build with Jekyll
2. Deploy to `gh-pages` branch
3. GitHub Pages serves the site

### Manual Deployment

```powershell
# Build the site
bundle exec jekyll build

# Deploy (requires gh CLI)
gh-pages -d _site
```

See [README_DEPLOY.md](README_DEPLOY.md) for detailed deployment instructions.

## 🧪 Local Development

### With Ruby (Native)

```powershell
bundle install
bundle exec jekyll serve --livereload
```

### With Docker (No Ruby required)

```powershell
docker run --rm -it -p 4000:4000 -v "${PWD}:/srv/jekyll" jekyll/jekyll:4 jekyll serve --watch
```

### Testing CMS Locally

```powershell
# Use test backend (no OAuth required)
# Uncomment in admin/config.yml:
# backend:
#   name: test-repo

# Then start Jekyll
bundle exec jekyll serve
```

## 📚 Documentation

- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Quick admin panel setup
- [OAuth-Proxy-Setup.md](OAuth-Proxy-Setup.md) - Complete OAuth guide
- [BLOG_DOCUMENTATION.md](BLOG_DOCUMENTATION.md) - Blog writing guide
- [README_DEPLOY.md](README_DEPLOY.md) - Deployment instructions
- [SECURITY.md](SECURITY.md) - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: [GitHub Issues](https://github.com/codenity-dev/codenity-dev.github.io/issues)
- **Discussions**: [GitHub Discussions](https://github.com/codenity-dev/codenity-dev.github.io/discussions)

---

**Built with ❤️ by the CodEnity Team**
