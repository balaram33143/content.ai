# Webhook 404 Error - Troubleshooting Guide

If you're seeing this error:

> **HTTP 404 - The webhook URL was not found. Make sure your workflow is active in n8n (or listening on the test URL), and that the webhook path is correct.**

This guide will help you fix it step by step.

---

## Understanding the Error

A 404 error means the server received your request but couldn't find the endpoint. For n8n webhooks, this typically means:

1. **The workflow is not deployed** - you saved it but didn't activate it
2. **The webhook URL is incorrect** - typo or wrong path
3. **n8n is not running** - the service crashed or wasn't started
4. **You're using the wrong URL format** - missing domain or wrong path structure

---

## Diagnostic Checklist

### ✅ Step 1: Verify n8n is Running

**For Local n8n:**
- Open http://localhost:5678 in your browser
- You should see the n8n login page
- If not, start it: `n8n start`

**For n8n Cloud:**
- Open your dashboard at https://n8n.cloud
- Check if your workflow exists

### ✅ Step 2: Find Your Webhook URL

**In n8n (Local or Cloud):**

1. Open your workflow
2. Click the **Webhook** node (or trigger node named "01_Content_Request_Form" if using template)
3. Look for the webhook URL section
4. You should see two URLs:
   - **Production URL**: `http://localhost:5678/webhook/abc-123-def` (or your domain)
   - **Test URL**: `http://localhost:5678/webhook-test/abc-123-def` (test mode)

**Copy the FULL URL** - it should include:
- Protocol: `http://` or `https://`
- Domain: `localhost:5678` or your n8n domain
- Path: `/webhook/` or `/webhook-test/` followed by ID

❌ **Wrong**: `/webhook/`
✅ **Correct**: `http://localhost:5678/webhook/abc-123-def`

### ✅ Step 3: Check Workflow Status

**The workflow must be ACTIVE (not just saved)**

1. In n8n, look for the workflow toggle/status
2. It should show:
   - 🟢 **Active** (green dot)
   - Status: "Active"
3. If it's inactive:
   - Click the activate button
   - You should see the Production URL appear

**If testing an inactive workflow:**
- Use the **Test URL** (`/webhook-test/`) instead
- The workflow doesn't need to be deployed for test URLs to work

### ✅ Step 4: Test the Webhook Directly

Before connecting it to ContentForge, test it with curl or Postman:

```bash
curl -X POST http://localhost:5678/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Expected responses:
- ✅ **200 OK**: Webhook works
- ✅ **204 No Content**: Webhook works (no response body)
- ✅ **400 Bad Request**: Webhook works but rejected the payload (check n8n workflow)
- ❌ **404 Not Found**: Webhook URL is wrong or workflow not deployed

---

## Solution Guide

### Solution 1: Workflow Not Deployed

**Problem**: You created the workflow but didn't activate it

**Fix:**
1. Open your workflow in n8n
2. Look for the **Activate/Deploy** button (often at top-right)
3. Click it to activate
4. The Production URL should now be active
5. Copy the full URL

### Solution 2: Wrong URL Format

**Problem**: The URL is missing parts or has typos

**Check your URL has:**
- ✅ `http://` or `https://` at the start
- ✅ Domain: `localhost:5678` for local, or your custom domain for cloud
- ✅ Path: `/webhook/` or `/webhook-test/`
- ✅ ID: The unique webhook identifier (after `/webhook/`)
- ❌ NO trailing slash: `http://localhost:5678/webhook/id/` ← WRONG
- ✅ Correct: `http://localhost:5678/webhook/id` ← RIGHT

**Common mistakes:**
- ❌ `http://localhost/webhook/` (missing port 5678)
- ❌ `webhook/abc-123` (missing domain and protocol)
- ❌ `http://localhost:5678/webhook` (missing webhook ID)
- ❌ `https://localhost:5678` (should be `http://` for local)

### Solution 3: n8n Not Running

**Problem**: n8n crashed or wasn't started

**For Local n8n:**
```bash
# Check if it's running
curl http://localhost:5678

# If not running, start it
n8n start

# Or restart it
npx n8n restart
```

**For n8n Cloud:**
- Check your dashboard at https://n8n.cloud
- Verify the workflow is in your account
- Ensure you didn't delete the workflow

### Solution 4: Firewall/Network Issue

**Problem**: Firewall or network settings blocking the connection

**For Local n8n:**
- ✅ Works: `http://localhost:5678/webhook/...` (from same machine)
- ✅ Works: `http://127.0.0.1:5678/webhook/...` (loopback)
- ❌ Blocked: `http://192.168.1.100:5678/webhook/...` (if firewall blocking)

**Fix**:
1. Allow port 5678 in your firewall
2. Or expose n8n via ngrok: `ngrok http 5678` (get public URL)

### Solution 5: Using Test URL vs Production URL

**Problem**: Using the wrong URL type

**When to use each:**

| Scenario | Use | Example |
|----------|-----|---------|
| Workflow is **deployed/active** | Production URL | `http://localhost:5678/webhook/id` |
| Workflow is **inactive** (testing) | Test URL | `http://localhost:5678/webhook-test/id` |
| Both are available | Use Production | `/webhook/id` |

**Current ContentForge behavior:**
- Tries Primary URL first
- Falls back to alternate URL if first fails
- Automatically converts between `/webhook/` and `/webhook-test/`

### Solution 6: Webhook Node Configuration

**Problem**: Webhook node not configured properly in n8n

**Check:**
1. Open the Webhook node
2. Verify settings:
   - Authentication: None (unless needed)
   - HTTP method: POST ✅
   - Path: Should be unique and configured correctly
3. Click "Copy Test URL" to see the exact URL
4. Test it with curl before deploying

---

## Advanced Debugging

### Enable Verbose Logging

**In ContentForge:**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try generating content
4. Look for error messages with full URL and response details

**In n8n:**
1. Open workflow execution logs
2. Click the execution that failed
3. Check the Webhook node's response
4. Look for error messages from your workflow

### Check n8n Logs

```bash
# If running locally
tail -f ~/.n8n/logs/n8n.log

# Or check browser console for n8n logs
```

### Use Online Tools

Test your URL with online tools:
- [Postman Echo](https://learning.postman.com/docs/postman-echo-api/): Create test requests
- [RequestBin](https://requestbin.com/): Inspect incoming requests
- [ngrok](https://ngrok.com/): Expose local server to internet

---

## Quick Verification Checklist

Before trying again, verify:

- [ ] n8n is running and accessible at http://localhost:5678
- [ ] Workflow is deployed (status: Active, green dot)
- [ ] Webhook URL is copied correctly (includes domain, port, path, and ID)
- [ ] URL has no trailing slash
- [ ] Protocol is `http://` for local, `https://` for cloud
- [ ] If testing inactive workflow, use `/webhook-test/` path
- [ ] Firewall allows port 5678 (for local n8n)
- [ ] No typos in the URL
- [ ] URL was copied from n8n, not manually typed

---

## Still Not Working?

### Get Support

1. **Check the Diagnostics page**
   - Go to http://localhost:3000/dashboard/diagnostics
   - Check what each test shows
   - Look for specific error messages

2. **Verify with curl**
   ```bash
   curl -v -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
   - Look for the HTTP status code
   - Check response body for errors

3. **Check n8n execution**
   - In n8n, find the workflow
   - Click "Executions" or "Logs"
   - Look for failed requests
   - Check error details

4. **Review ContentForge logs**
   - Browser DevTools Console (F12)
   - Check /api/diagnostic response
   - Look for detailed error messages

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `net::ERR_CONNECTION_REFUSED` | n8n not running | Start n8n: `n8n start` |
| `net::ERR_NAME_NOT_RESOLVED` | Wrong domain | Check URL spelling |
| `HTTP 404 Not Found` | Webhook doesn't exist | Verify URL and deploy workflow |
| `HTTP 403 Forbidden` | Access denied | Check authentication settings |
| `HTTP 500 Internal Error` | n8n workflow error | Check n8n logs for workflow issues |
| `Connection timeout` | Firewall/network blocking | Allow port in firewall or use ngrok |

---

## Contact & Resources

- **n8n Community**: https://community.n8n.io
- **n8n Docs**: https://docs.n8n.io
- **Webhook Testing**: https://webhook.site (capture and inspect webhooks)

---

**Pro Tip**: When troubleshooting, always check both the Frontend Diagnostics page AND the n8n execution logs. Issues could be with either the URL configuration or the workflow itself.
