/**
 * GitHub OAuth Authentication Handler for Decap CMS
 * This serverless function exchanges OAuth authorization codes for access tokens
 * Industry Standard: OAuth 2.0 Authorization Code Flow
 * 
 * Security Features:
 * - CORS protection with whitelist
 * - Environment variable validation
 * - Secure token exchange
 * - Comprehensive error logging
 * - Rate limiting considerations
 */

const fetch = require('node-fetch');

// Configuration
const ALLOWED_ORIGINS = [
  'https://codenity-dev.github.io',
  'http://localhost:8888',
  'http://127.0.0.1:8888',
  'http://localhost:4000',
  'http://127.0.0.1:4000'
];

exports.handler = async (event, context) => {
  // Determine allowed origin
  const origin = event.headers.origin || event.headers.Origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : process.env.ORIGIN || 'https://codenity-dev.github.io';
  
  // CORS headers for security
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Handle GET requests - Redirect to GitHub OAuth
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
    const redirectUri = `${baseOrigin}/admin/`;
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
