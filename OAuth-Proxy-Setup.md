# OAuth Proxy for Decap CMS

This is a simple OAuth proxy for Decap CMS to work with GitHub Pages.

## Setup Instructions

1. Deploy this to Netlify
2. Set environment variables in Netlify:
   - `GITHUB_CLIENT_ID`: Ov23lijyKYgAIq0HUswE
   - `GITHUB_CLIENT_SECRET`: (Your GitHub OAuth app client secret)
   - `ORIGIN`: https://codenity-dev.github.io

3. Update your CMS config.yml with the deployed URL

## Files needed:

### netlify/functions/auth.js
```javascript
exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No authorization code provided' })
    };
  }
  
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error_description || data.error);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN || '*',
        'Content-Type': 'text/html',
      },
      body: `
        <script>
          const token = "${data.access_token}";
          const provider = "github";
          
          // Post message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: "authorization-" + provider,
              token: token
            }, "${process.env.ORIGIN}");
            window.close();
          }
        </script>
      `,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN || '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### package.json
```json
{
  "name": "codenity-cms-auth",
  "version": "1.0.0",
  "dependencies": {
    "node-fetch": "^2.6.7"
  }
}
```