const fs = require('fs');
const path = require('path');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { google } = require('googleapis');

// Dynamic token routing based on arguments passed by Claude
const tokenFileName = process.argv[2] || 'token.json'; 
const TOKEN_PATH = path.join(__dirname, tokenFileName);
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// Automatically extract the account name from the token file to avoid collisions
const accountPrefix = tokenFileName.replace('token_', '').replace('.json', '');

// Initialize the Google OAuth client
function getOAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

const auth = getOAuthClient();
const postmaster = google.gmailpostmastertools({ version: 'v1', auth });

// Initialize the MCP Server dynamically named
const server = new Server(
  { name: `postmaster-${accountPrefix}`, version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Create completely unique tool names for each account
const listToolName = `${accountPrefix}_list_verified_domains`;
const statsToolName = `${accountPrefix}_get_traffic_stats`;

// Register the unique tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: listToolName,
        description: `Lists all the domains currently verified in the ${accountPrefix} Google Postmaster Tools account.`,
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: statsToolName,
        description: `Gets traffic statistics for a specific domain in the ${accountPrefix} account. Uses the list method to avoid 404 errors on days with low volume.`,
        inputSchema: {
          type: 'object',
          properties: {
            domainName: {
              type: 'string',
              description: 'The exact domain name to fetch stats for (e.g., "xeroshoes.com")'
            },
            startDateYear: { type: 'integer', description: 'e.g., 2025' },
            startDateMonth: { type: 'integer', description: '1-12' },
            startDateDay: { type: 'integer', description: '1-31' },
            endDateYear: { type: 'integer', description: 'e.g., 2026' },
            endDateMonth: { type: 'integer', description: '1-12' },
            endDateDay: { type: 'integer', description: '1-31' }
          },
          required: ['domainName']
        }
      }
    ]
  };
});

// Handle the actual logic using the unique names
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === listToolName) {
      const response = await postmaster.domains.list();
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
      };
    } 
    
    if (name === statsToolName) {
      const params = { parent: `domains/${args.domainName}` };
      
      // Attach optional date parameters if Claude provides them
      if (args.startDateYear) params['startDate.year'] = args.startDateYear;
      if (args.startDateMonth) params['startDate.month'] = args.startDateMonth;
      if (args.startDateDay) params['startDate.day'] = args.startDateDay;
      if (args.endDateYear) params['endDate.year'] = args.endDateYear;
      if (args.endDateMonth) params['endDate.month'] = args.endDateMonth;
      if (args.endDateDay) params['endDate.day'] = args.endDateDay;

      const response = await postmaster.domains.trafficStats.list(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Google API Error: ${error.message}` }]
    };
  }
});

// Start the server with the keep-alive fix
async function run() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`Google Postmaster Tools [${accountPrefix}] running cleanly!`);
    
    // Force the Node process to stay alive indefinitely
    setInterval(() => {}, 1000 * 60 * 60); 
  } catch (error) {
    console.error('Startup Error:', error);
  }
}

run().catch(console.error);