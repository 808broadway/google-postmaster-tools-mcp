const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runWizard() {
  console.log('\n===================================================');
  console.log('  Google Postmaster Tools - Auth Setup Wizard');
  console.log('===================================================\n');

  const credsPath = path.join(__dirname, 'credentials.json');

  // Phase 1: Handle credentials.json creation
  if (!fs.existsSync(credsPath)) {
    console.log('[!] No credentials.json found. Let\'s create one.');
    console.log('Please grab your Client ID and Client Secret from your Google Cloud Console.\n');
    
    const clientId = await ask('Enter your Client ID: ');
    const clientSecret = await ask('Enter your Client Secret: ');

    const credentials = {
      installed: {
        client_id: clientId.trim(),
        project_id: 'postmaster-mcp',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: clientSecret.trim(),
        redirect_uris: ['http://localhost']
      }
    };

    fs.writeFileSync(credsPath, JSON.stringify(credentials, null, 2));
    console.log('\n[OK] credentials.json created successfully!\n');
  } else {
    console.log('[OK] credentials.json already exists! Moving to token generation...\n');
  }

  // Phase 2: Handle token generation
  const accountName = await ask('Enter a short, one-word name for this account (e.g., brandname): ');
  const cleanName = accountName.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  if (!cleanName) {
    console.log('\n[Error] Invalid name. Please run the wizard again.');
    rl.close();
    return;
  }

  const tokenFileName = `token_${cleanName}.json`;

  console.log(`\nLaunching the authentication flow to create ${tokenFileName}...`);
  console.log('Check your browser to approve the Google login.\n');

  try {
    // Run the existing auth generator synchronously
    execSync(`node auth-generator.js ${tokenFileName}`, { stdio: 'inherit' });
    console.log('\n===================================================');
    console.log(`  Success! ${tokenFileName} is ready to use in your config.`);
    console.log('===================================================\n');
  } catch (error) {
    console.error('\n[Error] The authentication process was interrupted.');
  }

  rl.close();
}

runWizard();