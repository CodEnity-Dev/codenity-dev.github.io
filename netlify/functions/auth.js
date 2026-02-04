/**
 * Netlify OAuth Provider for Decap CMS
 * Implements proper handshake protocol
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin || 'https://codenity-dev.github.io';
  
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'text/html'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

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
      console.log('Exchanging code for token...');
      
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
          throw new Error(tokenData.error_description || 'Token exchange failed');
        }

        // Return HTML that sends message to opener
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Success</title></head>
<body>
  <h2>Authentication successful!</h2>
  <p>Closing window...</p>
  <script>
    (function() {
      const message = 'authorization:github:success:' + JSON.stringify({
        token: '${tokenData.access_token}',
        provider: 'github'
      });
      
      if (window.opener) {
        window.opener.postMessage(message, '${origin}');
        window.opener.postMessage(message, '*');
        setTimeout(() => window.close(), 1000);
      }
    })();
  </script>
</body>
</html>`;
        
        return { statusCode: 200, headers, body: html };
        
      } catch (error) {
        console.error('Token exchange error:', error);
        return {
          statusCode: 500,
          headers,
          body: '<html><body>Authentication failed: ' + error.message + '</body></html>'
        };
      }
    }
    
    // Initial load - send handshake and redirect to GitHub
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authenticating...</title></head>
<body>
  <h2>Redirecting to GitHub...</h2>
  <script>
    (function() {
      // Send handshake
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '${origin}');
      }
      
      // Wait for response, then redirect
      const listener = function(e) {
        if (e.data === 'authorizing:github' && e.origin === '${origin}') {
          window.removeEventListener('message', listener);
          
          // Redirect to GitHub
          const redirectUri = window.location.origin + window.location.pathname;
          const authUrl = 'https://github.com/login/oauth/authorize' +
            '?client_id=${clientId}' +
            '&redirect_uri=' + encodeURIComponent(redirectUri) +
            '&scope=repo,user' +
            '&state=' + Math.random().toString(36).substring(7);
          
          window.location.href = authUrl;
        }
      };
      
      window.addEventListener('message', listener);
      
      // Fallback: redirect anyway after 1 second
      setTimeout(() => {
        const redirectUri = window.location.origin + window.location.pathname;
        const authUrl = 'https://github.com/login/oauth/authorize' +
          '?client_id=${clientId}' +
          '&redirect_uri=' + encodeURIComponent(redirectUri) +
          '&scope=repo,user' +
          '&state=' + Math.random().toString(36).substring(7);
        window.location.href = authUrl;
      }, 1000);
    })();
  </script>
</body>
</html>`;
    
    return { statusCode: 200, headers, body: html };
  }

  return {
    statusCode: 405,
    headers,
    body: '<html><body>Method not allowed</body></html>'
  };
};
