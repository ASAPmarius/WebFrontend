import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const app = new Application();
// Update the ROOT to point to the frontend directory
const ROOT = `${Deno.cwd()}/frontend/`;

// Configure PORT to use environment variable or default to 8080
const PORT = parseInt(Deno.env.get("PORT") || "8080");

// Log startup information
console.log(`Starting server on port ${PORT}`);
console.log(`Serving static files from ${ROOT}`);

// Middleware to serve static files
app.use(async (ctx, next) => {
  try {
    await send(ctx, ctx.request.url.pathname, {
      root: ROOT,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// 404 handler
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = "404 File not found";
});

// Error handler
app.addEventListener("error", (evt) => {
  console.error("Server error:", evt.error);
});

// Start the server with environment variable PORT
console.log(`Oak static server running on port ${PORT} for the files in ${ROOT}`);
await app.listen({ port: PORT });