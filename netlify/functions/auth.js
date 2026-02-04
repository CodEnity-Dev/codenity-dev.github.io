/**
 * Netlify OAuth Provider for Decap CMS
 * Implements the Netlify External OAuth Provider protocol
 * Reference: https://docs.netlify.com/visitor-access/oauth-provider-tokens/
 */

const fetch = require('node-fetch');

const ALLOWED_ORIGINS = [
  'https://codenity-dev.github.io',
  'http://localhost:8888'
];

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://codenity-dev.github.io';
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'text/html'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // This endpoint serves an HTML page that implements the OAuth flow
  if (event.httpMethod === 'GET') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    // Validate environment variables
    if (!clientId) {
      console.error('GITHUB_CLIENT_ID environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'OAuth client ID is not configured. Please contact the administrator.'
        })
      };
    }
    
    // Get state from query params or generate new one
    const queryParams = event.queryStringParameters || {};
    const state = queryParams.state || Math.random().toString(36).substring(7);
    
    // Use ORIGIN from environment or infer from origin header
    const baseOrigin = process.env.ORIGIN || allowedOrigin;
    const redirectUri = `${baseOrigin}/admin/callback.html`;
    const scope = 'repo,user';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    console.log(`Redirecting to GitHub OAuth with redirect_uri: ${redirectUri}`);
    
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': authUrl
      },
      body: ''
    };

  return {
    statusCode: 405,
    headers,
    body: '<html><body><h1>Method Not Allowed</h1><p>This endpoint only accepts GET requests</p></body></html>'
  };
};
