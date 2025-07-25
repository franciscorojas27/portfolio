export async function onRequest(context, next) {
  const response = await next();

  const newHeaders = new Headers(response.headers);
  newHeaders.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data:; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "frame-ancestors 'none'; " +
      "connect-src 'self'; " +
      "base-uri 'self';"
  );

  newHeaders.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
