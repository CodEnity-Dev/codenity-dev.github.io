---
layout: default
title: "Getting Started with Browser Extension Development"
date: 2026-02-02 10:00:00 +0000
categories: [tutorial, browser-extensions]
tags: [javascript, chrome, firefox, development]
author: "CodEnity Team"
description: "A comprehensive guide to building your first browser extension for Chrome, Firefox, and Edge"
image: "/assets/images/blog/browser-extension-guide.jpg"
excerpt: "Learn how to create powerful browser extensions from scratch with our step-by-step tutorial covering all major browsers."
---

# Getting Started with Browser Extension Development

Browser extensions are powerful tools that can enhance user productivity and provide custom functionality. In this tutorial, we'll walk through creating your first browser extension that works across Chrome, Firefox, and Edge.

## What You'll Learn

- Setting up your development environment
- Understanding manifest files
- Creating popup interfaces
- Working with content scripts
- Publishing to browser stores

## Prerequisites

Before we begin, make sure you have:

- Basic knowledge of HTML, CSS, and JavaScript
- A code editor (VS Code recommended)
- Chrome, Firefox, or Edge browser for testing

## Step 1: Project Setup

Create a new folder for your extension:

```bash
mkdir my-first-extension
cd my-first-extension
```

Every browser extension starts with a `manifest.json` file that describes your extension:

```json
{
  "manifest_version": 3,
  "name": "My First Extension",
  "version": "1.0.0",
  "description": "A simple extension tutorial",
  "permissions": ["activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```

## Step 2: Creating the Popup

Create a `popup.html` file:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        width: 300px;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      button {
        background: #007cba;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h2>CodEnity Extension</h2>
    <p>Welcome to your first browser extension!</p>
    <button id="clickButton">Click Me!</button>
    <script src="popup.js"></script>
  </body>
</html>
```

## Step 3: Adding Functionality

Create `popup.js`:

```javascript
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("clickButton");

  button.addEventListener("click", function () {
    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send message to content script
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "highlight",
        message: "Hello from CodEnity Extension!",
      });
    });
  });
});
```

## Cross-Browser Compatibility

To make your extension work across browsers, use the WebExtension API standard:

### For Firefox (manifest.json additions):

```json
{
  "browser_specific_settings": {
    "gecko": {
      "id": "your-extension@codenity.com",
      "strict_min_version": "91.0"
    }
  }
}
```

### For Edge:

Edge uses the same Manifest V3 format as Chrome, making porting straightforward.

## Testing Your Extension

1. **Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked"
2. **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on"
3. **Edge**: Go to `edge://extensions/`, enable Developer mode, click "Load unpacked"

## Publishing to Stores

Once your extension is ready:

1. **Chrome Web Store**: Requires $5 developer fee, review process ~1-3 days
2. **Mozilla Add-ons**: Free, review process ~1-7 days
3. **Edge Add-ons**: Free, review process ~1-7 days

## Best Practices

- **Security**: Never inject untrusted content
- **Performance**: Minimize background scripts
- **Privacy**: Be transparent about data usage
- **UX**: Keep interfaces simple and intuitive

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [CodEnity Extension Examples](https://github.com/CodEnity-Dev)

## Next Steps

In our next tutorial, we'll cover:

- Advanced content script techniques
- Working with browser APIs
- Extension security best practices
- Automated testing strategies

---

_Found this tutorial helpful? Check out our other [development guides](/blog/categories/tutorial/) and don't forget to [subscribe to our YouTube channel](https://www.youtube.com/@codenity-iki) for video tutorials!_
