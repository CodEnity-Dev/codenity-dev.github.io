# Privacy Policy for SnapVista

**Last Updated: July 27, 2026**

This Privacy Policy describes how **CodEnity** ("we", "us", or "our") handles information when you use **SnapVista - Premium Screen Capture & Editor** (the "Extension"), a browser extension available in the Chrome Web Store.

We take your privacy extremely seriously. Our core philosophy is simple: **we do not collect, store, transmit, or share your data.**

---

## 1. No Data Collection (100% Local Processing)
The Extension does not collect, record, log, or transmit any user data. All operations, stitching, annotations, and file creations are performed entirely locally within your browser sandbox.

* **No Server Uploads:** Your captured screenshots, edited images, and drawings are never uploaded to any remote server or third-party database.
* **No Web History Tracking:** We do not track, log, or store your browsing history, URLs visited, or web usage metrics.
* **No Analytics or Trackers:** We do not include any third-party analytics libraries, advertising trackers, or telemetry scripts in the Extension code.

---

## 2. Explanation of Browser Permissions
To perform its functions, the Extension requests specific browser permissions in `manifest.json`. Below is an explanation of why each permission is required:

### A. `activeTab`
* **Purpose:** Allows the Extension to capture the visible frame of the active tab.
* **Privacy Detail:** This permission only triggers when you explicitly click the Extension icon or use a keyboard shortcut to capture the page. It does not grant the Extension continuous or broad access to your browsing history or other open tabs.

### B. `scripting`
* **Purpose:** Used to programmatically inject the Extension's core capture and cleaning utilities (`content.js` and `content.css`) into the active tab.
* **Privacy Detail:** This injection is used strictly to handle page scrolling calculations for stitching full-page screenshots, overlaying the custom selection box, highlighting hovered elements for element-capture, and hiding webpage clutter (ads/cookie banners) via the Page Cleaner tool.

### C. `storage`
* **Purpose:** Used to store your customized preferences and settings.
* **Privacy Detail:** If used, the data (such as default canvas color schemes, shadow depth configurations, or line thickness preferences) is saved locally in the browser's sandboxed storage and is never synced to external servers.

---

## 3. Third-Party Services & Links
The Extension operates fully offline. It contains no integrations with third-party cloud services, sharing portals, or social media platforms. 
* Any exports (PNG, JPEG, PDF) are processed locally and saved directly to your local file system or copied to your clipboard.
* When you click links to external portals (such as the developer support website or CWS reviews), those external pages operate under their own respective privacy policies.

---

## 4. Compliance with Google Developer Policies
We certify that SnapVista complies fully with the Chrome Web Store Developer Program Policies, including the User Data Privacy Policy's "Limited Use" requirements. We process data strictly to support the single-purpose utility of screen capturing and editing as described in the Extension metadata.

---

## 5. Changes to This Privacy Policy
We may update this Privacy Policy from time to time to reflect changes in our practices or browser security policies. Any updates will be pushed alongside new extension updates on the Chrome Web Store and will be updated on our website.

---

## 6. Contact Us
If you have any questions or feedback regarding this Privacy Policy or our practices, please contact us at:

* **Developer Portal:** [https://codenity-dev.github.io](https://codenity-dev.github.io)
* **Email:** support@codenity.dev
