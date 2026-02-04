/**
 * OAuth Token Exchange Endpoint
 * Exchanges GitHub authorization code for access token
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('🟠 [CALLBACK] Request received');
  console.log('🟠 [CALLBACK] Method:', event.httpMethod);
  console.log('🟠 [CALLBACK] Headers:', JSON.stringify(event.headers));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('🟠 [CALLBACK] OPTIONS request - sending CORS headers');
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    console.error('❌ [CALLBACK] Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🟠 [CALLBACK] Parsing request body...');
    const { code } = JSON.parse(event.body || '{}');
    
    console.log('🟠 [CALLBACK] Code present:', !!code);
    console.log('🟠 [CALLBACK] Code length:', code ? code.length : 0);
    
    if (!code) {
      console.error('❌ [CALLBACK] No authorization code provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No authorization code provided' })
      };
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    console.log('🟠 [CALLBACK] Client ID present:', !!clientId);
    console.log('🟠 [CALLBACK] Client Secret present:', !!clientSecret);
    
    if (!clientId || !clientSecret) {
      console.error('❌ [CALLBACK] Missing OAuth credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    console.log('🔄 [CALLBACK] Exchanging code with GitHub...');
    console.log('🔄 [CALLBACK] Using Client ID:', clientId.substring(0, 8) + '...');
    
    // Exchange code for token
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

    console.log('📥 [CALLBACK] GitHub response status:', tokenResponse.status);
    
    const tokenData = await tokenResponse.json();
    console.log('📦 [CALLBACK] GitHub response received');
    console.log('📦 [CALLBACK] Has access_token:', !!tokenData.access_token);
    console.log('📦 [CALLBACK] Has error:', !!tokenData.error);
    
    if (tokenData.error || !tokenData.access_token) {
      console.error('❌ [CALLBACK] GitHub error:', tokenData.error);
      console.error('❌ [CALLBACK] Error description:', tokenData.error_description);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: tokenData.error_description || 'Failed to get access token'
        })
      };
    }

    console.log('✅ [CALLBACK] Token obtained successfully!');
    console.log('✅ [CALLBACK] Token length:', tokenData.access_token.length);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: tokenData.access_token,
        provider: 'github'
      })
    };

  } catch (error) {
    console.error('❌ [CALLBACK] Exception:', error.message);
    console.error('❌ [CALLBACK] Stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
