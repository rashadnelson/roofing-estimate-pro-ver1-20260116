import { createAuthClient } from "better-auth/react";

// Determine the base URL for the auth API
// In development, use relative URL to go through Vite proxy (which forwards to port 3001)
// In production, API routes are proxied through Netlify
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // Development: use relative URL to go through Vite proxy
    // Vite proxy forwards /api/* to http://localhost:3001/api/*
    return window.location.origin;
  }
  // Production: use same origin (Netlify proxies /api/* to functions)
  return window.location.origin;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  // Ensure cookies are sent with all auth requests
  // This is critical for session management to work correctly
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },
});

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
