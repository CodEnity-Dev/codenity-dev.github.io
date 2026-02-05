/**
 * Official Netlify CMS OAuth Provider for GitHub
 * Based on: https://github.com/netlify/netlify-cms-contrib/tree/master/packages/netlify-cms-oauth-provider-node
 */

const simpleOauthModule = require('simple-oauth2');
const randomstring = require('randomstring');

const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
});

exports.handler = async (event, context) => {
  const origin = event.headers.origin || 'https://codenity-dev.github.io';
  
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'text/html'
  };

  // OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET /auth - Start OAuth or handle callback
  if (event.httpMethod === 'GET') {
    const qs = event.queryStringParameters || {};

    // Callback from GitHub with authorization code
    if (qs.code) {
      console.log('[OAuth] Callback received, exchanging code for token');
      
      try {
        const tokenConfig = {
          code: qs.code,
          redirect_uri: getRedirectUri(event)
        };

        const result = await oauth2.authorizationCode.getToken(tokenConfig);
        const token = oauth2.accessToken.create(result);

        console.log('[OAuth] Token obtained successfully');

        // Return HTML that posts message to parent window
        return {
          statusCode: 200,
          headers,
          body: renderBody('success', {
            token: token.token.access_token,
            provider: 'github'
          }, origin)
        };
      } catch (error) {
        console.error('[OAuth] Token exchange failed:', error);
        return {
          statusCode: 200,
          headers,
          body: renderBody('error', error, origin)
        };
      }
    }

    // Initial authorization request
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: getRedirectUri(event),
      scope: qs.scope || 'repo,user',
      state: randomstring.generate(32)
    });

    console.log('[OAuth] Redirecting to GitHub authorization');

    return {
      statusCode: 302,
      headers: {
        ...headers,
        Location: authorizationUri,
        'Cache-Control': 'no-cache'
      },
      body: ''
    };
  }

  return {
    statusCode: 405,
    headers,
    body: 'Method Not Allowed'
  };
};

function getRedirectUri(event) {
  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host;
  return `${protocol}://${host}/.netlify/functions/auth`;
}

function renderBody(status, content, origin) {
  if (status === 'success') {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Successful</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container { text-align: center; padding: 2rem; }
    .icon { font-size: 72px; margin-bottom: 1rem; animation: scaleIn 0.5s; }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    h1 { font-size: 28px; margin-bottom: 0.5rem; }
    p { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✓</div>
    <h1>Success!</h1>
    <p>You can close this window</p>
  </div>
  <script>
  (function() {
    function receiveMessage(e) {
      console.log('[OAuth Popup] Received message:', e);
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify(content)}',
        e.origin
      );
      window.removeEventListener('message', receiveMessage);
      setTimeout(function() { window.close(); }, 1000);
    }
    
    window.addEventListener('message', receiveMessage, false);
    
    console.log('[OAuth Popup] Sending authorizing message');
    window.opener.postMessage(
      'authorizing:github',
      '${origin}'
    );
  })();
  </script>
</body>
</html>`;
  } else {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Error</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 40px;
      text-align: center;
      background: #f5f5f5;
    }
    h1 { color: #e74c3c; }
    pre {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      overflow: auto;
    }
  </style>
</head>
<body>
  <h1>Authentication Failed</h1>
  <pre>${JSON.stringify(content, null, 2)}</pre>
  <p><a href="${origin}/admin/">Return to Admin</a></p>
</body>
</html>`;
  }
}
