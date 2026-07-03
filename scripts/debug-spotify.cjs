const https = require("https");
const fs = require("fs");
const path = require("path");

function loadEnv(filepath) {
  const content = fs.readFileSync(filepath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

function request(method, url, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const mod = urlObj.protocol === "https:" ? https : http;
    const payload = method === "POST" ? new URLSearchParams({ grant_type: "client_credentials" }).toString() : null;
    const req = mod.request(url, {
      method,
      headers: { ...(payload ? { "Content-Type": "application/x-www-form-urlencoded" } : {}), ...headers },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  const env = loadEnv(path.resolve(__dirname, "..", ".env"));
  const cid = env.VITE_SPOTIFY_CLIENT_ID;
  const csec = env.VITE_SPOTIFY_CLIENT_SECRET;
  const b64 = Buffer.from(`${cid}:${csec}`).toString("base64");

  // 1) Get token
  const tr = await request("POST", "https://accounts.spotify.com/api/token", {
    Authorization: `Basic ${b64}`,
  });
  const tok = JSON.parse(tr.body).access_token;
  console.log("Token:", tok.slice(0, 30) + "...");

  // 2) Try each endpoint with detailed output
  const endpoints = [
    { path: "/v1/search?q=test&type=track&limit=1", label: "search" },
    { path: "/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", label: "album" },
    { path: "/v1/artists/1dfeR4HaWDbWqFHLkxsg1d", label: "artist" },
    { path: "/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&limit=1", label: "recommendations" },
  ];

  for (const ep of endpoints) {
    const r = await request("GET", `https://api.spotify.com${ep.path}`, {
      Authorization: `Bearer ${tok}`,
    });
    console.log(`\n--- ${ep.label} ---`);
    console.log(`HTTP ${r.status}`);
    try {
      const parsed = JSON.parse(r.body);
      console.log(JSON.stringify(parsed, null, 2).slice(0, 500));
    } catch {
      console.log(r.body.slice(0, 500));
    }
  }
}

main().catch(console.error);
