/**
 * GitHub OAuth Authentication Handler for Decap CMS
 * This serverless function exchanges OAuth authorization codes for access tokens
 * Industry Standard: OAuth 2.0 Authorization Code Flow
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS headers for security
  const headers = {
    'Access-Control-Allow-Origin': process.env.ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

  // Only accept POST requests for token exchange
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Authorization code is required' })
      };
    }

    // Validate environment variables
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.error('Missing GitHub OAuth credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Exchange code for access token with GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`GitHub API responded with status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: tokenData.error_description || tokenData.error 
        })
      };
    }

    if (!tokenData.access_token) {
      throw new Error('No access token received from GitHub');
    }

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Authentication failed',
        message: error.message 
      })
    };
  }
};
