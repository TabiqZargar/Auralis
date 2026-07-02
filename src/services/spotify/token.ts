import { config } from "@/config";

let cachedToken: { accessToken: string; expiresAt: number } | null = null;
let pendingFetch: Promise<string> | null = null;

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  if (pendingFetch) {
    return pendingFetch;
  }

  const { clientId, clientSecret, accountsBaseUrl, tokenEndpoint } = config.spotify;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify Client ID and Client Secret must be set in environment variables. " +
      "Create a .env file with VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET.",
    );
  }

  pendingFetch = (async () => {
    const response = await fetch(`${accountsBaseUrl}${tokenEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      pendingFetch = null;
      throw new Error(
        `Spotify token request failed (${response.status}): ${errorBody}`,
      );
    }

    const data = await response.json();
    const expiresIn = (data.expires_in as number) ?? 3600;

    cachedToken = {
      accessToken: data.access_token as string,
      expiresAt: Date.now() + (expiresIn - 60) * 1000,
    };

    pendingFetch = null;
    return cachedToken.accessToken;
  })();

  return pendingFetch;
}

export function clearSpotifyToken() {
  cachedToken = null;
}
