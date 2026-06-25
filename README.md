# Google Postmaster Tools MCP Server for Claude (V2)

An automated, standalone connector that allows Claude to read your Google Postmaster Tools deliverability data directly within your chat window. 

**What's new in V2:** This upgrade completely removes the need to install Node.js or run terminal commands. The entire application is now compiled into standalone Windows executables (`.exe`) with built-in support for managing multiple brand accounts seamlessly.

---

## 📦 Phase 1: Download & Folder Setup

1. Go to the **Releases** section on the right side of this GitHub repository.
2. Download the latest `postmaster-mcp-windows-v2.zip` asset.
3. Extract the contents of the zip file into a dedicated, permanent folder on your computer (for example: `C:\Users\YourName\Documents\Projects\postmaster-tools`). 
4. Inside this folder, you will see your two executables: `setup-win.exe` and `postmaster-server-win.exe`. Keep this window open.

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
6. **Place the Key:** Once the JSON file downloads to your computer, rename it to exactly **`credentials.json`** and drop it directly into the folder you created in Phase 1, right alongside your two `.exe` files.

---

## ⚙️ Phase 3: Run the Setup Wizard

1. Double-click **`setup-win.exe`**.
2. A command window will open. Type a short, lowercase name for the brand/client you want to connect (e.g., `brand1`) and press **Enter**.
3. A browser tab will automatically open. Log into the Google account that has access to that brand's Postmaster data.
4. *Note:* Because this is a DIY open-source app and not audited by Google corporate, you will see a warning screen. This is normal. Click **Advanced** ➔ **Go to [App Name] (unsafe)** to bypass it. 
5. Grant read-only access. Once the browser confirms success, you can close the tab. 
6. Look in your folder: A new file (e.g., `token_brand1.json`) has been safely generated. You can repeat this setup process anytime to add more accounts.

---

## 🔌 Phase 4: Connect to Claude Desktop

1. Open your **Claude Desktop** application.
2. Open your **Settings** menu and click on the **Developer** tab.
3. Click the **Edit Config** button. This will automatically locate and open your `claude_desktop_config.json` file in your default text editor.
4. Add a server block pointing to `postmaster-server-win.exe` and pass your unique token filename as an argument. 
   
   Here is what your configuration file should look like:
```json
   {
     "mcpServers": {
       "google-postmaster-brand1": {
         "command": "C:\\Your\\Exact\\Path\\postmaster-server-win.exe",
         "args": [
           "token_brand1.json"
         ]
       }
     }
   }
   ```
   *(Important: You must use double-backslashes `\\` for your folder paths in this file, otherwise the configuration will break!)*

5. Save the file and close your text editor.
6. Completely **Quit** Claude from the Windows system tray (down by the clock) and restart the app. The server will now run invisibly in the background.

---

> **💡 Troubleshooting Tip: Let Claude format the JSON for you**
> If you aren't comfortable editing JSON files or if your configuration breaks, you can just ask Claude to write the exact text block you need! 
> 
> Copy the current contents of your config file (being sure to redact any sensitive info like private API keys or passwords), paste it into a normal Claude web chat, tell the AI the exact folder path where your executables are stored, and ask it to format the new server block for you. Claude will hand you a perfect piece of text. You can then simply select all in your text editor, paste Claude's version over it, and save the file. 
> 
> *(Note: Be sure to paste back in any private API keys or passwords that you redacted before you hit save!)*
> 
>  **💡 Troubleshooting Tip: The "Fresh Chat" Rule**
> If you ever update your configuration file or generate a new token to fix a connection error, **always start a brand-new chat** in Claude Desktop afterward. Old chats will sometimes "remember" previous errors and fail to connect, even after the underlying issue has been completely fixed!
