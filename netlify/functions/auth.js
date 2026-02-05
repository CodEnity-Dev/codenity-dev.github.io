/**
 * Decap CMS External OAuth Provider
 * Handles GitHub OAuth 2.0 authentication flow
 */

const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('========================================');
  console.log('[OAuth] Request:', event.httpMethod, event.path);
  console.log('[OAuth] Query:', event.queryStringParameters);
  console.log('[OAuth] Origin:', event.headers.origin);
  
  // CORS configuration
  const allowedOrigins = [
    'https://codenity-dev.github.io',
    'http://localhost:4000'
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
    return { statusCode: 204, headers, body: '' };
  }

  // Validate environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  console.log('[OAuth] Environment:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdPrefix: clientId?.substring(0, 4)
  });

  if (!clientId || !clientSecret) {
    console.error('[OAuth] Missing credentials');
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'text/html' },
      body: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Configuration Error</title></head><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2 style="color: #e74c3c;">Configuration Error</h2><p>GitHub OAuth credentials not configured in Netlify.</p></body></html>'
    };
  }

  const params = event.queryStringParameters || {};

  // ========== CALLBACK: Exchange code for token ==========
  if (params.code) {
    console.log('[OAuth] CALLBACK - Processing authorization code');
    console.log('[OAuth] Code:', params.code.substring(0, 10) + '...');
    
    const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
    console.log('[OAuth] Callback URL:', callbackUrl);
    
    try {
      console.log('[OAuth] Exchanging code for token...');
      
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
          redirect_uri: callbackUrl
        })
      });

      console.log('[OAuth] GitHub response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('[OAuth] GitHub error:', errorText);
        throw new Error(`GitHub API error: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      
      console.log('[OAuth] Token response:', {
        hasToken: !!tokenData.access_token,
        hasError: !!tokenData.error,
        error: tokenData.error
      });

      if (tokenData.error) {
        console.error('[OAuth] GitHub error:', tokenData);
        throw new Error(tokenData.error_description || tokenData.error);
      }

      if (!tokenData.access_token) {
        console.error('[OAuth] No access token');
        throw new Error('No access token received');
      }

      console.log('[OAuth] SUCCESS - Token obtained');
      console.log('[OAuth] Token preview:', tokenData.access_token.substring(0, 12) + '...');

      // Return HTML that sends token via postMessage
      const html = `<!DOCTYPE html>
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
    .icon { font-size: 64px; margin-bottom: 1rem; }
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
    console.log('========================================');
    console.log('[Callback] Script started');
    console.log('[Callback] Window type:', window.opener ? 'POPUP' : 'IFRAME');
    
    var token = ${JSON.stringify(tokenData.access_token)};
    var origin = ${JSON.stringify(corsOrigin)};
    
    console.log('[Callback] Token length:', token.length);
    console.log('[Callback] Origin:', origin);
    
    function sendToken() {
      console.log('[Callback] Sending token...');
      
      var data = { token: token, provider: "github" };
      var message = "authorization:github:success:" + JSON.stringify(data);
      
      var target = window.opener || window.parent;
      
      if (target && target !== window) {
        try {
          target.postMessage(message, origin);
          console.log('[Callback] Sent to origin');
        } catch (e) {
          console.error('[Callback] Error:', e);
        }
        
        try {
          target.postMessage(message, "*");
          console.log('[Callback] Sent to wildcard');
        } catch (e) {
          console.error('[Callback] Error:', e);
        }
        
        setTimeout(function() {
          console.log('[Callback] Closing window');
          window.close();
        }, 1500);
      } else {
        console.error('[Callback] No parent/opener');
      }
    }
    
    sendToken();
    setTimeout(sendToken, 100);
    setTimeout(sendToken, 500);
    console.log('========================================');
  })();
  </script>
</body>
</html>`;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        },
        body: html
      };

    } catch (error) {
      console.error('[OAuth] Error:', error);
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'text/html' },
        body: `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2 style="color: #e74c3c;">Authentication Failed</h2><p>${error.message}</p><p style="margin-top: 20px;"><a href="https://codenity-dev.github.io/admin/">Return to Admin</a></p></body></html>`
      };
    }
  }

  // ========== INITIAL: Redirect to GitHub ==========
  console.log('[OAuth] INITIAL - Redirecting to GitHub');
  
  const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
  const scope = params.scope || 'repo,user';
  const state = Math.random().toString(36).substring(2, 15);
  
  console.log('[OAuth] Callback URL:', callbackUrl);
  console.log('[OAuth] Scope:', scope);
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  
  console.log('[OAuth] Redirecting to:', authUrl.toString().substring(0, 100) + '...');
  console.log('========================================');
  
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
