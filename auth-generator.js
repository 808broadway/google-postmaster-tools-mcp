const fs = require('fs');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');
const readline = require('readline');

// Load your credentials file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id } = credentials.installed || credentials.web;

// Set up the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id, 
  client_secret, 
  'http://localhost:3000/oauth2callback'
);

// Define permission scope for Postmaster Tools
const SCOPES = ['https://www.googleapis.com/auth/postmaster.readonly'];

// Generate authorization URL
const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' 
});

console.log('===================================================');
console.log('  Google Postmaster Tools - Auth Setup Wizard');
console.log('===================================================\n');

if (fs.existsSync('credentials.json')) {
    console.log('[OK] credentials.json already exists! Moving to token generation...\n');
}

// Set up the terminal prompt interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for the brand name before starting the server
rl.question('Enter a short, one-word name for this account (e.g., brandname): ', (brandInput) => {
  
  // Clean up the input (removes spaces, makes lowercase) to ensure a safe filename
  const safeBrandName = brandInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const tokenFileName = `token_${safeBrandName}.json`;

  console.log('\n------------------------------------------------------------');
  console.log('Opening your browser to authorize Postmaster Tools access...');
  console.log('------------------------------------------------------------');

  // Start a local server to catch the authorization token
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url.startsWith('/oauth2callback')) {
        const q = url.parse(req.url, true).query;
        res.end('Authentication successful! You can close this browser tab now.');
        server.close();

        // Exchange the code for security tokens
        const { tokens } = await oAuth2Client.getToken(q.code);
        
        // Save the tokens locally to a file using the DYNAMIC filename
        // If a file with this name already exists, fs.writeFileSync automatically overwrites it!
        fs.writeFileSync(tokenFileName, JSON.stringify(tokens, null, 2));
        console.log(`\n--> Success! Saved authentication to "${tokenFileName}"`);
        console.log('You are ready to use this account with your MCP Server!');
        process.exit(0);
      }
    } catch (e) {
      res.end('Authentication failed.');
      console.error('Error generating token:', e);
      process.exit(1);
    }
  }).listen(3000, () => {
    // Automatically open browser in Windows
    require('child_process').exec(`start "" "${authorizeUrl}"`);
  });

  rl.close();
});