/**
 * Netlify OAuth Provider for Decap CMS v3
 * Industry Standard: OAuth 2.0 Authorization Code Flow
 * Protocol: NetlifyAuthenticator compatible
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin || 'https://codenity-dev.github.io';
  
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle GET - Initial auth or callback
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    const code = params.code;
    
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers,
        body: '<html><body>OAuth configuration error</body></html>'
      };
    }
    
    // If we have a code, exchange it for token
    if (code) {
      console.log('[Netlify Auth] Exchanging authorization code for access token');
      
      try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code
          })
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error || !tokenData.access_token) {
          console.error('[Netlify Auth] Token exchange failed:', tokenData.error_description || tokenData.error);
          throw new Error(tokenData.error_description || 'Token exchange failed');
        }

        console.log('[Netlify Auth] Token obtained successfully');

        // Return callback HTML that sends message to opener
        const callbackHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Successful</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
           display: flex; align-items: center; justify-content: center; height: 100vh; 
           margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { text-align: center; color: white; }
    .success { font-size: 48px; margin-bottom: 20px; }
    h2 { margin: 0; font-size: 24px; font-weight: 600; }
    p { opacity: 0.9; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h2>Authentication Successful</h2>
    <p>Closing window...</p>
  </div>
  <script>
  (function() {
    console.log('[Callback] Sending token to parent window');
    
    const message = 'authorization:github:success:' + JSON.stringify({
      token: '${tokenData.access_token}',
      provider: 'github'
    });
    
    function sendMessage() {
      if (window.opener && !window.opener.closed) {
        // Send to specific origin
        window.opener.postMessage(message, '${origin}');
        // Send wildcard for compatibility
        window.opener.postMessage(message, '*');
        console.log('[Callback] Message sent to opener');
        setTimeout(() => {
          console.log('[Callback] Closing popup window');
          window.close();
        }, 1500);
      } else {
        console.error('[Callback] No opener window found');
      }
    }
    
    // Send immediately and retry
    sendMessage();
    setTimeout(sendMessage, 100);
  })();
  </script>
</body>
</html>`;
        
        return { 
          statusCode: 200, 
          headers: { ...headers, 'Content-Type': 'text/html' }, 
          body: callbackHtml 
        };
        
      } catch (error) {
        console.error('[Netlify Auth] Error:', error);
        return {
          statusCode: 500,
          headers: { ...headers, 'Content-Type': 'text/html' },
          body: `<!DOCTYPE html><html><body><h2>Authentication Failed</h2><p>${error.message}</p></body></html>`
        };
      }
    }
    
    // Initial auth - redirect to GitHub
    console.log('[Netlify Auth] Starting OAuth flow - redirecting to GitHub');
    
    const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
    const state = Math.random().toString(36).substring(7);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=repo,user&state=${state}`;
    
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': githubAuthUrl,
        'Cache-Control': 'no-cache'
      },
      body: ''
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
