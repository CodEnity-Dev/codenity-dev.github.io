/**
 * Netlify OAuth Provider for Decap CMS v3
 * Implements external OAuth backend as per Decap CMS specification
 * Reference: https://decapcms.org/docs/external-oauth-clients/
 */

const fetch = require('node-fetch');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin || 'https://codenity-dev.github.io';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers: corsHeaders, 
      body: '' 
    };
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[OAuth] Missing GitHub credentials');
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OAuth configuration error' })
    };
  }

  // GET request - Handle OAuth initiation and callback
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    const code = params.code;
    
    // OAuth callback with authorization code
    if (code) {
      console.log('[OAuth] Received authorization code, exchanging for token');
      
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
          console.error('[OAuth] Token exchange failed:', tokenData);
          throw new Error(tokenData.error_description || 'Failed to obtain access token');
        }

        console.log('[OAuth] Successfully obtained access token');

        // Decap CMS expects this EXACT HTML format with postMessage
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Complete</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 1rem;
      animation: fadeIn 0.5s;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    h1 { margin: 0 0 0.5rem 0; font-size: 24px; }
    p { opacity: 0.9; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✓</div>
    <h1>Authentication Successful</h1>
    <p>Completing login...</p>
  </div>
  <script>
    (function() {
      function postAuthMessage() {
        try {
          const data = {
            token: "${tokenData.access_token}",
            provider: "github"
          };
          
          // Decap CMS v3 expects this message format
          const message = "authorization:github:success:" + JSON.stringify(data);
          
          // Post to parent/opener window
          const target = window.opener || window.parent;
          if (target) {
            target.postMessage(message, "${origin}");
            target.postMessage(message, "*"); // Fallback for compatibility
            console.log("Posted auth message to parent window");
          }
          
          // Close popup after successful message
          setTimeout(function() {
            window.close();
          }, 1000);
        } catch (err) {
          console.error("Error posting message:", err);
        }
      }
      
      // Post message immediately when page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', postAuthMessage);
      } else {
        postAuthMessage();
      }
    })();
  </script>
</body>
</html>`;
        
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: html
        };
        
      } catch (error) {
        console.error('[OAuth] Error during token exchange:', error);
        return {
          statusCode: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html; charset=utf-8'
          },
          body: `<!DOCTYPE html><html><body><h2>Authentication Error</h2><p>${error.message}</p></body></html>`
        };
      }
    }
    
    // Initial OAuth request - redirect to GitHub authorization
    console.log('[OAuth] Initiating GitHub OAuth flow');
    
    // Construct callback URL - GitHub will redirect back here
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host;
    const callbackUrl = `${protocol}://${host}${event.path}`;
    
    // Generate state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    
    const scope = params.scope || 'repo,user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}&state=${state}`;
    
    console.log('[OAuth] Redirecting to GitHub authorization URL');
    
    return {
      statusCode: 302,
      headers: {
        ...corsHeaders,
        'Location': authUrl,
        'Cache-Control': 'no-cache'
      },
      body: ''
    };
  }

  // Unsupported method
  return {
    statusCode: 405,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
