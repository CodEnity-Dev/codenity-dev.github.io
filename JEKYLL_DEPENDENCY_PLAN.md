# Jekyll Dependency Stabilization Plan

Date: 2026-05-29
Owner: CodEnity
Scope: Stabilize GitHub Actions Jekyll build by locking Ruby dependencies under .jekyll.

## Goals
- Prevent CI failures caused by unpinned, transitive gem updates (e.g., sass-embedded).
- Keep Ruby toolchain consistent across local and CI.

## Current State (Verified)
- .jekyll/Gemfile defines Jekyll + plugins, but there is no Gemfile.lock.
- GitHub Actions workflow uses Ruby 3.1.7 and runs bundle install from .jekyll.

## Plan
1) Generate .jekyll/Gemfile.lock
   - Run bundler in .jekyll to resolve and lock dependencies.
   - Commit the lockfile so CI installs the same versions every run.
2) Ensure platforms are covered
   - Add x86_64-linux platform to Gemfile.lock to match GitHub Actions runner.
3) Keep Ruby consistent
   - Keep ruby 3.1.7 as configured unless you choose to upgrade later.

## Files
- .jekyll/Gemfile.lock (new)

## QA
- Run CI build or local `bundle exec jekyll build` in .jekyll to confirm.
