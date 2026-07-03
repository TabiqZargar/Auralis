const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ENV_PATH = path.resolve(__dirname, "..", ".env");

// Read .env manually
function loadEnv(filepath) {
  const content = fs.readFileSync(filepath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

function post(url, headers, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const mod = urlObj.protocol === "https:" ? https : http;
    const payload = typeof body === "string" ? body : new URLSearchParams(body).toString();
    const req = mod.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function get(url, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const mod = urlObj.protocol === "https:" ? https : http;
    const req = mod.request(
      url,
      { method: "GET", headers },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

async function main() {
  console.log("=== Spotify Integration Verification ===\n");

  // Step 1: Confirm .env values
  console.log("1. Reading .env file...");
  if (!fs.existsSync(ENV_PATH)) {
    console.error("   FAIL: .env file not found");
    process.exit(1);
  }
  const env = loadEnv(ENV_PATH);
  const clientId = env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = env.VITE_SPOTIFY_CLIENT_SECRET;
  if (!clientId) {
    console.error("   FAIL: VITE_SPOTIFY_CLIENT_ID is not set in .env");
    process.exit(1);
  }
  if (!clientSecret) {
    console.error("   FAIL: VITE_SPOTIFY_CLIENT_SECRET is not set in .env");
    process.exit(1);
  }
  console.log(`   PASS: VITE_SPOTIFY_CLIENT_ID = ${clientId.slice(0, 8)}...${clientId.slice(-4)}`);
  console.log(`   PASS: VITE_SPOTIFY_CLIENT_SECRET = ${clientSecret.slice(0, 8)}...${clientSecret.slice(-4)}`);

  // Step 2: Request token from Spotify
  console.log("\n2. Requesting access token from https://accounts.spotify.com/api/token...");
  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  const tokenRes = await post(
    "https://accounts.spotify.com/api/token",
    { Authorization: authHeader },
    { grant_type: "client_credentials" },
  );
  console.log(`   HTTP ${tokenRes.status}: ${tokenRes.body.slice(0, 200)}`);

  if (tokenRes.status !== 200) {
    console.error("   FAIL: Token request failed");
    try {
      const errBody = JSON.parse(tokenRes.body);
      console.error(`   Error: ${errBody.error} - ${errBody.error_description}`);
    } catch {
      console.error(`   Response: ${tokenRes.body}`);
    }
    process.exit(1);
  }
  console.log("   PASS: Token request succeeded");

  // Step 3: Parse and verify access token
  console.log("\n3. Parsing access token...");
  let tokenData;
  try {
    tokenData = JSON.parse(tokenRes.body);
  } catch {
    console.error("   FAIL: Could not parse token response JSON");
    process.exit(1);
  }
  if (!tokenData.access_token) {
    console.error("   FAIL: Response does not contain access_token");
    process.exit(1);
  }
  console.log(`   PASS: access_token received (${tokenData.access_token.slice(0, 20)}...)`);
  console.log(`   token_type: ${tokenData.token_type}`);
  console.log(`   expires_in: ${tokenData.expires_in}s`);

  // Step 4: Make a test API request with the token
  console.log("\n4. Testing Spotify API request with Authorization header...");
  const testPaths = [
    "/v1/albums/4aawyAB9vmqN3uQ7FjRGTy",  // Popular album
    "/v1/search?q=test&type=track&limit=1",
    "/v1/browse/new-releases?limit=1",
  ];
  let allPassed = true;
  for (const testPath of testPaths) {
    const url = `https://api.spotify.com${testPath}`;
    const apiRes = await get(url, { Authorization: `Bearer ${tokenData.access_token}` });
    const statusOk = apiRes.status >= 200 && apiRes.status < 300;
    console.log(`   ${statusOk ? "PASS" : "FAIL"}  ${testPath}  -> HTTP ${apiRes.status}`);
    if (!statusOk) {
      allPassed = false;
      console.error(`       Response body: ${apiRes.body.slice(0, 300)}`);
    }
  }

  if (!allPassed) {
    console.error("\n   Some API requests failed (see above)");
    process.exit(1);
  }
  console.log("\n   All API requests passed with Authorization header");

  // Step 5: (Proxy test) Try the local proxy if running
  const proxyBase = process.env.VITE_API_BASE_URL || "http://localhost:3001";
  console.log(`\n5. Checking local proxy at ${proxyBase}...`);
  try {
    const proxyRes = await get(`${proxyBase}/spotify/v1/albums/4aawyAB9vmqN3uQ7FjRGTy`, {});
    console.log(`   HTTP ${proxyRes.status}: ${proxyRes.body.slice(0, 100)}`);
    if (proxyRes.status >= 200 && proxyRes.status < 300) {
      console.log("   PASS: Proxy is running and forwarding requests");
    } else if (proxyRes.status === 404 || proxyRes.status === 502) {
      console.log("   WARN: Proxy responded but might not be fully configured (expected if no proxy server running)");
    } else {
      console.log(`   INFO: Proxy returned ${proxyRes.status} (expected if no proxy server running)`);
    }
  } catch (err) {
    console.log("   INFO: Proxy not reachable (expected if no proxy server running locally)");
  }

  console.log("\n=== Verification Complete ===");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
