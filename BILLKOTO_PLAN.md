# BillKoto Web Section Plan

Date: 2026-05-29
Owner: CodEnity
Scope: Add BillKoto landing page + privacy, terms, support pages under /billkoto/ with Finlio-style standalone HTML.

## Goals
- Ship a professional BillKoto landing page mirroring the Finlio pattern and section rhythm.
- Provide dedicated, public Privacy Policy, Terms of Service, and Support pages.
- Ensure the privacy policy is reachable at /billkoto/privacypolicy/ and keep the Finlio-style /billkoto/privacy-policy.html link working.

## Verified Context
- Finlio pages are standalone HTML with inline styles and no Jekyll layout usage.
- Base URL is empty in _config.yml, so /billkoto/... maps to repo paths.
- BillKoto assets exist at billkoto/assets/ (launch_icon.png) and screenshots at billkoto/assets/screenshots/:
  - appliances.jpg
  - calculator.jpg
  - homepage.jpg
  - insigthpage.jpg

## URL + File Mapping (Exact)
- Landing page: /billkoto/ -> billkoto/index.html
- Privacy (canonical for request): /billkoto/privacypolicy/ -> billkoto/privacypolicy/index.html
- Privacy (Finlio mirror link): /billkoto/privacy-policy.html -> billkoto/privacy-policy.html
- Terms: /billkoto/terms-of-service.html -> billkoto/terms-of-service.html
- Support: /billkoto/support.html -> billkoto/support.html

## Content Sources
- Landing page: BillKoto web section spec provided by user.
- Privacy Policy: User-provided privacy policy text adapted to the site style.
- Terms of Service: New BillKoto terms page consistent with privacy policy scope.
- Support: Contact details and support guidance.

## Visual + UX Direction
- Mirror the Finlio layout rhythm: sticky top nav, hero + highlights panel, features grid, data use, compliance/legal block, CTA, footer.
- Use BillKoto color direction (green) with a distinct gradient and non-default Google Fonts.
- Include at least one screenshot in the hero highlight panel and a small screenshots strip/grid later.
- Keep copy short, factual, and Bangladesh-specific with no "official" claims.

## Implementation Steps
1) Create billkoto/index.html
   - Finlio-like structure with BillKoto content and anchors: #features, #data-use, #privacy, #terms.
   - CTA buttons: Play Store, Privacy Policy.
   - Use launch_icon.png for logo and screenshots from billkoto/assets/screenshots/.
2) Create billkoto/privacy-policy.html
   - Adapted privacy policy content in a clean, readable layout.
3) Create billkoto/privacypolicy/index.html
   - Duplicate privacy policy content to satisfy /billkoto/privacypolicy/ URL.
4) Create billkoto/terms-of-service.html
   - Standard app terms aligned with the BillKoto feature scope and local-first data posture.
5) Create billkoto/support.html
   - Clear support contact and links back to landing page and legal pages.

## QA Checklist
- All pages load with correct relative links.
- Nav anchors work on landing page.
- Privacy and Terms links appear in header and footer.
- Mobile layout: hero, feature grid, and panels collapse to one column cleanly.
- No broken image URLs for screenshots or app icon.

## Open Items
- None (implementing both /privacypolicy/ and /privacy-policy.html to satisfy URL and pattern).
