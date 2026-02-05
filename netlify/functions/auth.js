/**
 * Decap CMS External OAuth Provider
 * Handles GitHub OAuth 2.0 authentication flow
 */

const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('========================================');
  console.log('[OAuth] Request received:', {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters,
    origin: event.headers.origin,
    host: event.headers.host
  });
  
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

  console.log('[OAuth] Environment check:', {
    hasClientId: !!clientId,
    clientIdLength: clientId?.length,
    clientIdPrefix: clientId?.substring(0, 4),
    hasClientSecret: !!clientSecret,
    clientSecretLength: clientSecret?.length
  });

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
</body></html>`🔄 CALLBACK FLOW - Processing authorization code');
    console.log('[OAuth] Authorization code:', params.code.substring(0, 10) + '...');
    
    const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
    console.log('[OAuth] Callback URL for token exchange:', callbackUrl);
    
    try {
      const tokenRequestBody = {
        client_id: clientId,
        client_secret: clientSecret,
        code: params.code,
        redirect_uri: callbackUrl
      };
      
      console.log('[OAuth] Token request:', {
        client_id: clientId.substring(0, 8) + '...',
        code: params.code.substring(0, 10) + '...',
        redirect_uri: callbackUrl
      });
      

  const params = event.queryStringParameters || {};

  // ========== CALLBACK FLOW: Exchange code for token ==========
  if (params.code) {
    console.log('[OAuth] Processing authorization code');
    
    trconsole.log('[OAuth] GitHub API response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('[OAuth] GitHub API error response:', errorText);
        throw new Error(`GitHub API responded with ${tokenResponse.status}: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      
      console.log('[OAuth] Token response receivedon',
          'User-Agent': 'Decap-CMS-OAuth'
        },
        body: JSON.stringify({
        console.error('[OAuth] ❌ GitHub returned error:', tokenData);
        throw new Error(tokenData.error_description || tokenData.error);
      }

      if (!tokenData.access_token) {
        console.error('[OAuth] ❌ No access token in response:', tokenData);
        throw new Error('No access token in response');
      }

      console.log('[OAuth] ✅ Token obtained successfully!');
      console.log('[OAuth] Token preview:', tokenData.access_token.substring(0, 12) + '...'););

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
</head>========================================');
    console.log('[Callback Page] Script started');
    console.log('[Callback Page] Window type:', window.opener ? 'POPUP' : (window.parent !== window ? 'IFRAME' : 'STANDALONE'));
    console.log('[Callback Page] Has opener:', !!window.opener);
    console.log('[Callback Page] Has parent:', window.parent !== window);
    
    var token = ${JSON.stringify(tokenData.access_token)};
    var receiverOrigin = ${JSON.stringify(corsOrigin)};
    
    console.log('[Callback Page] Token length:', token.length);
    console.log('[Callback Page] Token preview:', token.substring(0, 12) + '...');
    console.log('[Callback Page] Receiver origin:', receiverOrigin);
    
    function sendToken() {
      console.log('[Callback Page] 📤 Attempting to send token...');
      
      var data = { token: token, provider: "github" };
      var message = "authorization:github:success:" + JSON.stringify(data);
      
      console.log('[Callback Page] Message format:', message.substring(0, 80) + '...');
      
      // Try window.opener first (popup), then window.parent (iframe)
      var target = window.opener || window.parent;
      
      if (target && target !== window) {
        console.log('[Callback Page] Target window:', window.opener ? 'window.opener' : 'window.parent');
        
        // Send to specific origin
        try {
          target.postMessage(message, receiverOrigin);
          console.log('[Callback Page] ✅ Sent to origin:', receiverOrigin);
        } catch (e) {
          console.error('[Callback Page] ❌ Error sending to origin:', e);
        }
        
        // Also send to wildcard for compatibility
        try {
          target.postMessage(message, "*");
          console.log('[Callback Page] ✅ Sent to wildcard (*)');
        } catch (e) {
          console.error('[Callback Page] ❌ Error sending to wildcard:', e);
        }
        
        // Close after delay
        setTimeout(function() {
          console.log('[Callback Page] 🚪 Closing window in 1.5s');
          window.close();
        }, 1500);
      } else {
        console.error('[Callback Page] ❌ No parent/opener window found');
        console.error('[Callback Page] window.opener:', window.opener);
        console.error('[Callback Page] window.parent:', window.parent);
        console.error('[Callback Page] window.parent === window:', window.parent === window);
      }
    }
    
    // Send immediately and retry
    console.log('[Callback Page] 🚀 Sending token (attempt 1)');
    sendToken();
    setTimeout(function() { 
      console.log('[Callback Page] 🔄 Retry attempt 2'); 
      sendToken(); 
    }, 100);
    setTimeout(function() { 
      console.log('[Callback Page] 🔄 Retry attempt 3'); 
      sendToken(); 
    }, 500);
    
    console.log('[Callback Page] Script completed, waiting for retries...'
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
        statusCode: 200🚀 INITIAL FLOW - Starting GitHub OAuth');
  console.log('[OAuth] Client ID:', clientId?.substring(0, 8) + '...');
  
  const callbackUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
  const scope = params.scope || 'repo,user';
  const state = Math.random().toString(36).substring(2, 15);
  
  console.log('[OAuth] Parameters:', {
    callbackUrl: callbackUrl,
    scope: scope,
    state: state
  });
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  
  console.log('[OAuth] 🔗 Redirecting to:', authUrl.toString());
  console.log('========================================'
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
