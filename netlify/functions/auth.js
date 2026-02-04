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
  }

  // Handle POST requests - Exchange code for token
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        message: 'This endpoint only accepts POST requests for token exchange'
      })
    };
  }

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request body',
          message: 'Request body must be valid JSON'
        })
      };
    }

    const { code } = requestBody;

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing authorization code',
          message: 'Authorization code is required for token exchange'
        })
      };
    }

    // Validate environment variables
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials in environment variables');
      console.error('GITHUB_CLIENT_ID present:', !!clientId);
      console.error('GITHUB_CLIENT_SECRET present:', !!clientSecret);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'The client_id and/or client_secret passed are incorrect.',
          message: 'OAuth credentials are not properly configured on the server. Please ensure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables are set in Netlify.'
        })
      };
    }

    console.log('Exchanging authorization code for access token...');
    console.log('Using Client ID:', clientId.substring(0, 8) + '...');
    console.log('Code length:', code.length);

    // Exchange code for access token with GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'CodEnity-CMS-OAuth-Proxy'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('GitHub API error response:', errorText);
      throw new Error(`GitHub API responded with status: ${tokenResponse.status} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('GitHub token response received');

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'The client_id and/or client_secret passed are incorrect.',
          message: tokenData.error_description || tokenData.error,
          details: 'Please verify your GitHub OAuth App credentials in Netlify environment variables'
        })
      };
    }

    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData);
      throw new Error('No access token received from GitHub');
    }

    console.log('Successfully obtained access token');

    // Return the access token to the client
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: tokenData.access_token,
        provider: 'github'
      })
    };

  } catch (error) {
    console.error('OAuth authentication error:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'The client_id and/or client_secret passed are incorrect.',
        message: 'Failed to complete authentication. Please check server logs.',
        details: error.message
      })
    };
  }
};
