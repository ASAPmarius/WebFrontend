// deno-lint-ignore-file no-unused-vars
// Frontend configuration module
const config = (function() {
  // Detect if we're in production based on the URL
  const isProduction = 
    globalThis.location.hostname !== 'localhost' && 
    !globalThis.location.hostname.includes('127.0.0.1');
  
  // Base domain - use current domain in production, localhost in development
  const domain = isProduction ? globalThis.location.hostname : 'localhost';
  
  // Port configuration
  const frontendPort = isProduction ? globalThis.location.port || '' : '8080';
  const backendPort = isProduction ? '' : '3000'; // In production, the backend might not have a specific port
  
  // Protocol (http/https)
  const protocol = isProduction || globalThis.location.protocol === 'https:' ? 'https' : 'http';
  const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
  
  // Build the complete URLs
  const frontendUrl = `${protocol}://${domain}${frontendPort ? ':' + frontendPort : ''}`;
  
  // Allow overriding the backend URL via a global variable that can be set by the server
  // This lets Dokku environment vars get passed to the frontend
  const backendUrl = isProduction 
    ? (globalThis.BACKEND_URL || `https://caracaca-backend.cluster-ig3.igpolytech.fr`)
    : `http://localhost:3000`;
  
  // WebSocket URL is derived from the backend URL
  const websocketUrl = backendUrl.replace(/^http/, 'ws').replace(/^https/, 'wss');
  
  console.log('Frontend Config:', {
    environment: isProduction ? 'production' : 'development',
    frontendUrl,
    backendUrl,
    websocketUrl
  });
  
  return {
    isProduction,
    frontendUrl,
    backendUrl,
    websocketUrl,
    apiEndpoint: function(path) {
      // Helper to build complete API URLs
      return `${backendUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };
})();

// Make the config globally available
globalThis.appConfig = config;