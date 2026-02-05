/**
 * Decap CMS External OAuth Provider
 * Handles GitHub OAuth 2.0 authentication flow
 */

const fetch = require('node-fetch');

exports.handler = async (event) => {
  // CORS configuration
  const allowedOrigins = [
    'https://codenity-dev.github.io',
    'http://localhost:4000',
    'http://127.0.0.1:4000'
  ];
  
  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Validate environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[OAuth] Missing environment variables:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret
    });
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Configuration Error</title></head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <h2 style="color: #e74c3c;">⚠️ Configuration Error</h2>
  <p>GitHub OAuth credentials are not configured in Netlify.</p>
  <p>Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.</p>
</body></html>`
    };
  }

  const params = event.queryStringParameters || {};

  // ========== CALLBACK FLOW: Exchange code for token ==========
  if (params.code) {
    console.log('[OAuth] Processing authorization code');
    
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Decap-CMS-OAuth'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: params.code,
          redirect_uri: `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`GitHub API responded with ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      
      console.log('[OAuth] Token response:', {
        hasToken: !!tokenData.access_token,
        hasError: !!tokenData.error,
        error: tokenData.error,
        errorDescription: tokenData.error_description
      });

      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      if (!tokenData.access_token) {
        throw new Error('No access token in response');
      }

      // Return HTML page that sends token to parent window
      const successHtml = `<!DOCTYPE html>
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
    .icon { font-size: 64px; margin-bottom: 1rem; animation: scaleIn 0.5s ease-out; }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 0.5rem; }
    p { opacity: 0.9; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✓</div>
    <h1>Authentication Successful</h1>
    <p>Completing sign-in...</p>
  </div>
  <script>
  (function() {
    console.log('[Callback Page] Loaded successfully');
    
    var token = ${JSON.stringify(tokenData.access_token)};
    var receiverOrigin = ${JSON.stringify(corsOrigin)};
    
    function sendToken() {
      console.log('[Callback Page] Preparing to send token');
      
      var data = { token: token, provider: "github" };
      var message = "authorization:github:success:" + JSON.stringify(data);
      
      console.log('[Callback Page] Message:', message.substring(0, 50) + '...');
      
      // Try window.opener first (popup), then window.parent (iframe)
      var target = window.opener || window.parent;
      
      if (target && target !== window) {
        console.log('[Callback Page] Sending to', window.opener ? 'opener' : 'parent');
        
        // Send to specific origin
        try {
          target.postMessage(message, receiverOrigin);
          console.log('[Callback Page] Sent to origin:', receiverOrigin);
        } catch (e) {
          console.error('[Callback Page] Error sending to origin:', e);
        }
        
        // Also send to wildcard for compatibility
        try {
          target.postMessage(message, "*");
          console.log('[Callback Page] Sent to wildcard');
        } catch (e) {
          console.error('[Callback Page] Error sending to wildcard:', e);
        }
        
        // Close after delay
        setTimeout(function() {
          console.log('[Callback Page] Closing window');
          window.close();
        }, 1500);
      } else {
        console.error('[Callback Page] No parent/opener window found');
      }
    }
    
    // Send immediately and retry
    sendToken();
    setTimeout(sendToken, 100);
    setTimeout(sendToken, 500);
  })();
  </script>
</body>
</html>`;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: successHtml
      };

    } catch (error) {
      console.error('[OAuth] Token exchange error:', error);
      
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'text/html' },
        body: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Authentication Failed</title></head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <h2 style="color: #e74c3c;">❌ Authentication Failed</h2>
  <p>${error.message}</p>
  <p style="margin-top: 20px;"><a href="https://codenity-dev.github.io/admin/">Return to Admin</a></p>
</body></html>`
      };
    }
  }

  // ========== INITIAL FLOW: Redirect to GitHub ==========
  console.log('[OAuth] Initiating GitHub OAuth flow');
  console.log('[OAuth] Client ID:', clientId?.substring(0, 8) + '...');
  
  const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
  const scope = params.scope || 'repo,user';
  const state = Math.random().toString(36).substring(2, 15);
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  
  console.log('[OAuth] Redirecting to GitHub');
  console.log('[OAuth] Callback URL:', callbackUrl);
  
  return {
    statusCode: 302,
    headers: {
      ...headers,
      'Location': authUrl.toString(),
      'Cache-Control': 'no-cache'
    },
    body: ''
  };
};
