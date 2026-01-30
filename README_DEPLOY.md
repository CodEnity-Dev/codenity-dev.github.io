# Deployment instructions

1. Confirm `site.url` in `_config.yml` points to your GitHub Pages URL (or leave blank for previews).

2. Commit and push the repository to GitHub (to the `main` branch).

3. The GitHub Action `.github/workflows/deploy.yml` will run on push to `main`, build the site, and push the generated site to the `gh-pages` branch.

4. In your repository settings -> Pages, set the source to "Deploy from a branch" and choose `gh-pages` / root. Enable HTTPS.

Local preview (if you prefer local builds):

Option A — Windows using RubyInstaller:

```powershell
# After installing Ruby+Devkit and running ridk install
gem install bundler jekyll --no-document
bundle install
bundle exec jekyll serve --livereload
```

Option B — Docker (no Ruby install required):

```powershell
docker run --rm -it -p 4000:4000 -v "${PWD}:/srv/jekyll" -w /srv/jekyll jekyll/jekyll:4 jekyll serve --watch --force_polling
```

If you want me to push these changes to your GitHub repo and enable Actions, provide repository access or push this repo to GitHub and tell me the repo URL.
