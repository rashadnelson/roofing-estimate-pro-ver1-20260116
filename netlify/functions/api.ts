import app from "../../server/index";

// Netlify Functions 2.0 with ESM support
// Export the Hono app's fetch handler as default export for web standard compatibility
export default async (request: Request, context: any) => {
  try {
    return await app.fetch(request, context);
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
