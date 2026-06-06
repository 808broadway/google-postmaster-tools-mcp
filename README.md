# Local Google Postmaster Tools MCP Server

Bring the latest available deliverability metrics, domain reputation, and spam rates from Google Postmaster Tools into your Claude Desktop AI workflow. Unlock deeper analysis by seamlessly cross-referencing your Postmaster Tools data against other connected services (like Klaviyo).

Whether you are an independent brand manager monitoring a **single domain** or a lifecycle marketing professional managing a **large portfolio of multiple client accounts**, this self-hosted **Model Context Protocol (MCP)** server adapts completely to your scale. It allows you to analyze email delivery performance natively inside your chat interface without bouncing between separate browser sessions.

### 💡 What is a "Local MCP Server" in Plain English?
Think of a Model Context Protocol (MCP) server as a **secure custom bridge** or a private USB cable that plugs directly into Claude Desktop on your computer. It doesn't live on the internet, and it doesn't run on a remote cloud. It sits quietly on your machine, waking up for a millisecond only when you ask Claude a question about your Postmaster data, fetching it directly from Google, and going right back to sleep. 

### Why Use This Server?
* **Single or Multi-Account Flexibility:** Connect a single Google account to seamlessly audit your core domain, or scale effortlessly to manage multiple brands. Each account uses its own secure token, ensuring absolute data isolation with no bleeding between clients.
* **Zero Collision Architecture:** Tools are dynamically named after your specific account nicknames (e.g., `brandone_list_verified_domains`), allowing a single instance or multiple instances to run side-by-side cleanly.
* **⚡ Ultra-Lightweight:** Because it runs entirely on local text commands, it uses virtually **zero computer resources (RAM/CPU)**. Running this server uses less memory than leaving a single empty tab open in Google Chrome.

⏱️ **Total Setup Time:** ~10-15 minutes

---

## 🔒 Privacy & Security First (Local-Only)

This project does not collect, track, or store your data on remote infrastructure. Therefore, it completely bypasses the need for a traditional hosted privacy policy. You retain absolute ownership over your API credentials on your local machine.

* **100% Local Execution:** This integration is a self-hosted Model Context Protocol (MCP) server. All API requests, OAuth tokens, and domain metrics are processed locally on your own machine.
* **No Third-Party Servers:** There is no middleman database, external tracking, or cloud hosting. Your deliverability data is transmitted directly between your machine's Claude Desktop client and Google’s official APIs.
* **Secure Token Storage:** Your generated access keys are stored exclusively in your local folder as `token_*.json` files. 

---

## 🚀 Step-by-Step Installation Guide

### Step 1: Install Core Dependencies
⏱️ **Time Check:** 3 minutes

Before running the server, your computer needs two safe, industry-standard utilities installed to run code and download files.

1. **Node.js:** The underlying runtime environment that lets your computer execute JavaScript tools. Go to [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** version for Windows or Mac. Run the installer and click "Next" through the default prompts. **You do not need to install any extras** (like Chocolatey or additional build tools) if prompted.  
2. **Git:** A tool that allows you to cleanly download and update open-source code repositories. Go to [git-scm.com](https://git-scm.com/) and download the installer for your operating system. Run the installer using the standard default choices.

Once both are installed, download this project by clicking the green **Code** button at the top of this GitHub page and selecting **Download ZIP**, then extract it to a folder on your computer (e.g., your Documents folder). Alternately, open a terminal/command prompt and run the following command:

```bash
git clone https://github.com/808broadway/google-postmaster-tools-mcp.git
```

---

### Step 2: Configure Your Google Cloud Sandbox
⏱️ **Time Check:** 5 minutes

Because this is an open-source tool running entirely on your computer, you will create a free developer credentials profile inside Google Cloud to authorize API requests.

1. Open the [Google Cloud Console](https://console.cloud.google.com/). Log in with any Google account. **(This does not have to be the email associated with your Postmaster Tools accounts.)**  
2. **Create a Project:** Click the project dropdown in the top-left corner, click **New Project**, name it `Postmaster Tools MCP`, and click **Create**.  
3. **Enable the API:** In the top search bar, search for **Gmail Postmaster Tools API**. Click it, then click the blue **Enable** button.  
4. **Configure Google Auth Platform:** In the left-hand menu, navigate to **Google Auth Platform** > **Branding**. If prompted, select **External**. Fill out the required fields: **App name** (e.g., `Postmaster Tools MCP`), **User support email** (your email), and **Developer contact information** (your email). Click **Save**.  
5. **Add Test Users (IMPORTANT!):** In the left-hand menu under Google Auth Platform, click **Audience**. Scroll down to **Test users** and click **+ Add users**. Enter the exact Google/Workspace email address(es) that own or have access to your Google Postmaster Tools accounts. Click **Save**.  
6. **Generate Credentials:** In the left-hand menu under Google Auth Platform, click **Clients**. Click **Create Client** (or Create Credentials > OAuth client ID). Set the Application Type dropdown to **Desktop app**. Name it `Postmaster Tools MCP Key` and click **Create**. A popup will show your **Client ID** and **Client Secret**. Keep this window open for the next step!

---

### Step 3: Run the Automation Setup Wizard
⏱️ **Time Check:** 2 minutes

We have included an interactive wizard that handles library installation, formats files, and runs authentication paths automatically.

**⚠️ Adding a 2nd Account?** If you are returning to run this wizard again to add a second brand's Postmaster account, make sure you first go back to your Google Cloud Console -> **Google Auth Platform** -> **Audience** (Step 2.5) and add that second account's email address to the **Test Users** list!

#### Option A: Automatic Setup (Windows)
1. Open your project folder in Windows File Explorer.  
2. Locate the file named `setup.bat` and double-click it.  
3. The terminal window will open. It will automatically download the necessary dependencies (`npm install`) if they are missing.  
4. Follow the on-screen prompts to input your Google Cloud **Client ID** and **Client Secret**.  
5. Enter a short, one-word nickname for your first client or account (e.g., `brandone`).  
6. Your web browser will pop open automatically. Log in with the Google account associated with that brand, click through the unverified app warning safely, and grant permission.  
7. To add a second account or client brand later, simply double-click `setup.bat` again. It will recognize your existing keys and skip straight to creating `token_brandtwo.json`.

#### Option B: Manual Setup (Mac / Linux or Command Line)
If you prefer not to use the automated batch script, you can execute the steps manually via your terminal:

```bash
npm install
node setup.js
```

---

### Step 4: Add the Connection to Claude Desktop
⏱️ **Time Check:** 2-5 mins

Now you need to tell the Claude Desktop application where to look for your new servers by adding them to your global configuration file.

1. Open your system's configuration directory to locate the file named `claude_desktop_config.json`: 
   * **Windows:** Copy and paste `%APPDATA%\Claude\` into your File Explorer address bar and hit Enter. 
   * **Mac:** Open Finder, press `Cmd + Shift + G`, paste `~/Library/Application Support/Claude/`, and hit Enter.  
2. Open `claude_desktop_config.json` in a standard text editor (like Notepad, Notepad++, or TextEdit).  
3. **Optional AI Assistance:** If you want Claude to handle the tricky bracket formatting for you, you can copy the entire text inside your existing `claude_desktop_config.json` file, paste it into your Claude chat window, and ask: 
   > *"Here is my current config file. Can you please append the configuration definitions for my new Google Postmaster Tools MCP servers to it?"*
   * ⚠️ **PRIVACY NOTE:** If you have modified this configuration file in the past for other integrations, it may contain private API keys or database credentials. Review the text before pasting to ensure you aren't sharing sensitive third-party keys in your chat session.  
4. Once updated, ensure your configuration block looks like the example below, then save and close the file.

#### Configuration Example Matrix
Your configuration file should stack your servers cleanly inside the `"mcpServers"` block. Make sure to change the file path to the exact physical path where your project folder is located on your computer, using forward slashes (`/`) even on Windows.

```json
{
  "mcpServers": {
    "postmaster-brandone": {
      "command": "node",
      "args": [
        "C:/path/to/your/project/index.js",
        "token_brandone.json"
      ]
    },
    "postmaster-brandtwo": {
      "command": "node",
      "args": [
        "C:/path/to/your/project/index.js",
        "token_brandtwo.json"
      ]
    }
  }
}
```

---

### Step 5: Complete Restart of Claude Desktop
⏱️ **Time Check:** 1 minute

Claude only scans for new integrations when the application initializes from a completely cold boot state.

1. Close the Claude Desktop application window.  
2. **Windows Users:** Go to your Windows system tray (the small arrow icon next to your clock in the bottom right corner of your taskbar). Find the Claude icon, right-click it, and select **Quit Claude**.  
3. **Mac Users:** Click **Claude** in the top menu bar and select **Quit Claude** (or press `Cmd + Q`).  
4. Relaunch Claude Desktop. Look for the small **plug icon** in the bottom-right corner of the chat input bar to confirm your custom tools are active!

---

## 💬 Natural Language Prompt Examples

Once the integration is active, you can chat with Claude about your delivery data naturally. Try these prompts out:

* *"Can you look at the `brandone` Postmaster Tools connector and let me know what domains are verified?"*  
* *"Pull the traffic statistics for `domain.com` from the `brandone` server over the last 30 days. Let me know what our average user spam rate and domain reputations look like."*  
* *"Check `brandtwo`'s domain metrics and let me know if we experienced any delivery errors or IP reputation dips last week."*  
* *"Please cross-reference days of elevated spam complaint rate vs our campaigns in our Klaviyo account to help determine which campaigns may have been the cause, or if the complaint may have come from an external sender (not Klaviyo)."*

---

## 🛠️ FAQ & Troubleshooting

**Q: When my browser opens to authenticate, I get the error: "Access blocked: Postmaster Tools MCP has not completed the Google verification process".**  
**A:** This can easily look like a company security policy is blocking the app, but that isn't the case! This error simply means the specific Google account you are trying to log in with hasn't been whitelisted in your project yet. Because this is a private, unverified local app, Google strictly blocks any email address that isn't on your "Test users" list.
* **The Fix:** Go back to your Google Cloud Console -> **Google Auth Platform** -> **Audience**. Under "Test users", click **+ Add users**, and add the exact email address you are trying to authenticate (the one which has Google Postmaster Tools access). Save the page, and run the `setup.bat` file again.

**Q: Claude says it can't find my tools or gives me an error when I ask for Postmaster data.**  
**A:** This is almost always an issue with Claude not recognizing the updated config file. Double-check that all paths in your `claude_desktop_config.json` use forward slashes (`/`), and ensure you fully quit Claude from your system tray (Windows) or Menu Bar (Mac) before relaunching it.

---

### Need Help?
If you run into any issues during authorization or config mapping, post a question in the repository **Issues** tab or message me directly in the Klaviyo Champion Slack community!
