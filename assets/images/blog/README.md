# CMS Media Guidelines

## Image Directory Structure

This directory (`assets/images/blog/`) is configured as the default media folder for the Decap CMS. When you upload images through the admin interface, they will be stored here.

## Recommended Image Guidelines

### File Naming
- Use descriptive, SEO-friendly names
- Use lowercase letters and hyphens
- Example: `browser-extension-tutorial-hero.jpg`

### File Formats
- **JPEG**: For photographs and complex images
- **PNG**: For images with transparency or simple graphics
- **WebP**: For optimized modern format (when supported)
- **SVG**: For icons and vector graphics

### Image Sizes
- **Featured Images**: 1200x630px (ideal for social sharing)
- **Inline Images**: 800px width maximum
- **Thumbnails**: 400x300px
- **File Size**: Keep under 500KB for optimal performance

### Alt Text
Always provide descriptive alt text for accessibility and SEO.

## Usage in Posts

### Featured Images
Add to your post's front matter:
```yaml
image: /assets/images/blog/your-image.jpg
```

### Inline Images
Use standard Markdown syntax:
```markdown
![Alt text description](/assets/images/blog/your-image.jpg)
```

### Responsive Images (Advanced)
For better performance, consider using responsive image markup:
```html
<picture>
  <source srcset="/assets/images/blog/image-large.webp" media="(min-width: 800px)" type="image/webp">
  <source srcset="/assets/images/blog/image-small.webp" media="(max-width: 799px)" type="image/webp">
  <img src="/assets/images/blog/image-fallback.jpg" alt="Descriptive alt text" loading="lazy">
</picture>
```

## Optimization Tips

1. **Compress images** before upload
2. **Use appropriate formats** for content type
3. **Include alt text** for accessibility
4. **Consider lazy loading** for performance
5. **Test on mobile** devices

## CMS Integration

The Decap CMS will automatically:
- Save uploaded images to this directory
- Generate the correct public URLs
- Provide image selection in the post editor
- Support drag-and-drop uploads

---

*This directory is automatically managed by the CMS. Manual file organization is recommended for better maintenance.*