# Google Postmaster Tools MCP Server for Claude (V2)

An automated, standalone connector that allows Claude to read your Google Postmaster Tools deliverability data directly within your chat window. 

**What's new in V2.1.0:** This upgrade completely removes the need to install Node.js or run terminal commands. The entire application is now compiled into standalone Windows (`.exe`) and macOS executables with built-in support for managing multiple brand accounts seamlessly.

---

## 📦 Phase 1: Download & Folder Setup

1. Go to the **Releases** section on the right side of this GitHub repository.
2. Download the appropriate asset for your operating system:
   * **Windows:** Download `postmaster-mcp-windows-v2.zip`.
   * **Mac:** Download `postmaster-mcp-mac-v2.zip`.
3. Extract the contents of the zip file into a dedicated, permanent folder on your computer (for example: `C:\Users\YourName\Documents\Projects\postmaster-tools` or `~/Documents/Projects/postmaster-tools`). 
4. Inside this folder, you will see your two executables: `setup` and `postmaster-server` (with `.exe` extensions on Windows). Keep this window open.

---

## 🔑 Phase 2: Get Your Google Master Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a **New Project** named `Google Postmaster Tools MCP`.
2. In the search bar at the top, search for **Gmail Postmaster Tools API** and select it. On the next page, click **Enable**.
3. In the left menu, navigate to **Google Auth Platform > Overview**. You will see a "Google Auth Platform not configured yet" message. Click **Get started**.
    * **Step 1: App Information.** Enter the app name `Google Postmaster Tools MCP` and select your email address. Click **Next**.
    * **Step 2: Audience.** Select **External**. Click **Next**.
    * **Step 3: Contact Information.** Enter your email address. Click **Next**.
    * **Step 4: Finish.** Check the box agreeing to the User Data Policy. Click **Continue**, then click **Create**.
4. **Crucial Step:** In the left column, click **Audience**. Under *Testing*, click **Publish App** to move the status to **In Production**. *(If you leave it in "Testing," your tokens will expire every 7 days).*
5. Next, click **Clients** in the left column and then click **Create client**.
    * Choose **Desktop app** as the Application Type and click **Create**. *(You can leave the default client name as is).*
    * Click **Download JSON** on the confirmation screen.
6. **Place the Key:** Once the JSON file downloads to your computer, rename it to exactly **`credentials.json`** and drop it directly into the folder you created in Phase 1, right alongside your two executable files.

### 🔑 A Note on Google Accounts and Domain Access
This MCP server will automatically connect to **all** Google Postmaster Tools domains that your specific Google login has access to. 

For example, if your primary work email (`you@exampleagency.com`) has been granted access to ten different clients' Google Postmaster Tools accounts, you only need to run this authorization process **once** using that single email address. Claude will be able to read data for all of those domains through that one connection. You do not need to generate a separate token for every single brand. 

That being said, if your client domains are split across completely different, unlinked Google accounts, this tool also fully supports generating multiple unique tokens and running them side-by-side in Claude Desktop.

---

## ⚙️ Phase 3: Run the Setup Wizard

1. Double-click your setup executable (`setup-win.exe` for Windows, or the `setup` binary for Mac).
   * **🍎 Mac Users (Gatekeeper Warning):** Because this is an unsigned developer tool, macOS may block the executable initially. To bypass this, **Control-click** (or Right-click) the file in Finder and select **Open**. 
2. A command window will open. Type a short, lowercase name for the company/brand you want to connect (e.g., `companyname`) and press **Enter**.
3. A browser tab will automatically open. Log into the Google account that has access to that company's Google Postmaster Tools data.
4. *Note:* Because this is a DIY open-source app and not audited by Google corporate, you will see a warning screen. This is normal. Click **Advanced** ➔ **Go to [App Name] (unsafe)** to bypass it. 
5. Grant read-only access. Once the browser confirms success, you can close the tab. 
6. Look in your folder: A new file (e.g., `token_companyname.json`) has been safely generated. You can repeat this setup process anytime to add more accounts.

---

## 🔌 Phase 4: Connect to Claude Desktop

1. Open your **Claude Desktop** application.
2. Open your **Settings** menu and click on the **Developer** tab.
3. Click the **Edit Config** button. This will automatically locate and open your `claude_desktop_config.json` file in your default text editor.
   * *If the button doesn't work, Mac users can find the config manually at:* `~/Library/Application Support/Claude/claude_desktop_config.json`
4. Add a server block pointing to your `postmaster-server` executable and pass your unique token filename as an argument. 
   
   **For Windows Users:**
   *(Important: You must use double-backslashes `\\` for your folder paths!)*
   ```json
   "mcpServers": {
    "google-postmaster-tools-companyname": {
      "command": "C:\\Your\\Exact\\Path\\postmaster-server-win.exe",
      "args": [
        "token_companyname.json"
      ]
    }
  }
   ```

   **For Mac Users:**
   *(Important: Ensure your file paths use forward slashes `/`)*
   ```json
   "mcpServers": {
    "google-postmaster-tools-companyname": {
      "command": "/Users/YourName/Your/Exact/Path/postmaster-server-macos",
      "args": [
        "token_companyname.json"
      ]
    }
  }
   ```
   
   *(Important: JSON blocks must always be separated by commas. If you paste this new block at the very end of your existing configuration file, make sure there is a comma `,` on the line immediately preceding it. If you paste it at the very beginning, make sure there is a comma `,` immediately after its final closing bracket `}`!)*

   Note: If you want to let Claude format the config file for you, see the "Let Claude format the JSON for you" tip near the bottom of this guide.

5. Save the file and close your text editor.
6. Completely **Quit** Claude and restart the app (Windows users should quit from the system tray, Mac users can use `Cmd + Q`). The server will now run invisibly in the background.

---

**💡 Troubleshooting Tip: Let Claude format the JSON for you**

If you aren't comfortable editing JSON files or if your configuration breaks, you can just ask Claude to write the exact code for your `claude_desktop_config.json` file!

1. Copy the current contents of your config file (being sure to redact any sensitive info like private API keys).
2. Copy the example snippet from **Phase 4, Step 4**.
3. Paste both into a normal Claude web chat.
4. **Include this exact prompt:** > *"Please merge this new MCP server snippet into my existing Claude Desktop config file. My executable file is located at **[INSERT YOUR EXACT FOLDER PATH TO THE EXECUTABLE HERE]** and my token file is named **[INSERT TOKEN FILENAME HERE]**. Please format the JSON perfectly, ensure the folder path uses the correct slashes for my OS (double-backslashes for Windows, forward slashes for Mac), keep the token file as just the filename (no folder path), and make sure the commas separating the blocks are in the correct places."*

**When setting this up, keep these two rules in mind:**
* **The Server Name:** The name in quotes (e.g., `"google-postmaster-tools-companyname"`) is simply the internal identifier Claude uses for the server. You can change this to anything you want as long as it's a unique string with no spaces.
* **The Token File:** Make sure you only provide the **exact file name** of the token (e.g., `"token_companyname.json"`), *not* the full absolute file path. The executable automatically knows to look in its own folder!

Claude will hand you the perfect code with all the necessary commas and brackets in place. You can then simply select all in your text editor, paste Claude's version over it, and save the file. 

*(Note: Be sure to paste back in any private API keys or passwords that you redacted before you hit save!)*

---
 
**💡 Troubleshooting Tip #2: The "Fresh Chat" Rule**
If you ever update your configuration file or generate a new token to fix a connection error, **always start a brand-new chat** in Claude Desktop afterward. Old chats will sometimes "remember" previous errors and fail to connect, even after the underlying issue has been completely fixed!
