import { config } from "@/config";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;
let pendingFetch: Promise<string> | null = null;

function isTokenResponse(data: unknown): data is TokenResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).access_token === "string" &&
    typeof (data as Record<string, unknown>).expires_in === "number"
  );
}

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

    const data: unknown = await response.json();

    if (!isTokenResponse(data)) {
      pendingFetch = null;
      throw new Error("Invalid token response from Spotify API");
    }

    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    pendingFetch = null;
    return cachedToken.accessToken;
  })();

  return pendingFetch;
}

export function clearSpotifyToken() {
  cachedToken = null;
}
