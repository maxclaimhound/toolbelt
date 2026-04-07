# X (Twitter) API Integration

Connect your local AI agent to the X API using the official **XMCP** server from X's developer platform. This gives your agent the ability to search posts, create tweets, read mentions, like, repost, and more — all running locally.

> **XMCP** is an official MCP server from [@XDeveloperPlatform](https://github.com/xdevplatform/xmcp). Toolbelt provides this setup guide for integrating it with local AI agent frameworks.

---

## Prerequisites

- Python 3.10+
- An [X Developer account](https://developer.x.com) (free)
- An X Developer App with OAuth 1.0a enabled

---

## Step 1: Create an X Developer App

1. Go to [developer.x.com](https://developer.x.com) and sign in
2. Create a new app (or use an existing one)
3. Under **User authentication settings**:
   - Enable **OAuth 1.0a**
   - Set permissions to **Read and Write**
   - Set callback URL to: `http://127.0.0.1:8976/oauth/callback`
   - Website URL: any valid URL
4. From **Keys and Tokens**, copy:
   - API Key (Consumer Key)
   - API Key Secret (Consumer Secret)
   - Bearer Token

---

## Step 2: Install XMCP

```bash
git clone https://github.com/xdevplatform/xmcp.git
cd xmcp
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
```

---

## Step 3: Configure .env

Edit `.env` with your credentials:

```env
X_OAUTH_CONSUMER_KEY=your_api_key
X_OAUTH_CONSUMER_SECRET=your_api_secret
X_BEARER_TOKEN=your_bearer_token

X_OAUTH_CALLBACK_HOST=127.0.0.1
X_OAUTH_CALLBACK_PORT=8976
X_OAUTH_CALLBACK_PATH=/oauth/callback

MCP_HOST=127.0.0.1
MCP_PORT=8000
```

### Recommended Tool Allowlist

Start with a minimal set of tools. Add more as needed:

```env
X_API_TOOL_ALLOWLIST=searchPostsRecent,createPosts,getUsersMe,getPostsById,likePost,repostPost,getUsersByUsername,getUsersMentions,getUsersTimeline,deletePosts
```

> **Note:** `searchPostsRecent` requires X API Basic ($100/month). For free tier, remove it from the allowlist.

---

## Step 4: Start the Server

```bash
source .venv/bin/activate
python server.py
```

On first run, a browser window will open for OAuth authorization. Approve it and the server will start at `http://127.0.0.1:8000/mcp`.

Keep this process running while your agent is active.

---

## Step 5: Connect to Your Agent Framework

**OpenClaw:**
```bash
openclaw mcp set x '{"url": "http://127.0.0.1:8000/mcp"}'
openclaw mcp list  # verify
```

**LM Studio / any OpenAI-compatible framework:**
Point your MCP client to `http://127.0.0.1:8000/mcp`.

**Claude Desktop:**
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "x": {
      "url": "http://127.0.0.1:8000/mcp"
    }
  }
}
```

---

## Available Tools

| Tool | Description | Free Tier |
|---|---|---|
| `createPosts` | Post a tweet | ✅ |
| `deletePosts` | Delete a tweet | ✅ |
| `getUsersMe` | Get your own profile | ✅ |
| `getUsersByUsername` | Look up any user | ✅ |
| `getUsersMentions` | Get your mentions | ✅ |
| `getUsersTimeline` | Get your timeline | ✅ |
| `getPostsById` | Read a specific tweet | ✅ |
| `likePost` | Like a post | ✅ |
| `repostPost` | Repost a post | ✅ |
| `searchPostsRecent` | Search recent posts | ❌ Requires Basic ($100/mo) |

---

## Example Prompts

Once connected, ask your agent:

- *"Post this thread on X: [your content]"*
- *"Get my latest mentions on X"*
- *"Like the post at x.com/user/status/123"*
- *"What's my X profile info?"*
- *"Delete my last tweet"*

---

## Keep XMCP Running

To run XMCP as a background service on macOS, create a launchd plist:

```bash
cat > ~/Library/LaunchAgents/com.xmcp.server.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.xmcp.server</string>
  <key>ProgramArguments</key>
  <array>
    <string>/path/to/xmcp/.venv/bin/python</string>
    <string>/path/to/xmcp/server.py</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/path/to/xmcp</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.xmcp.server.plist
```

---

## Resources

- [XMCP GitHub](https://github.com/xdevplatform/xmcp)
- [X Developer Portal](https://developer.x.com)
- [X API v2 Docs](https://developer.x.com/en/docs/twitter-api)
