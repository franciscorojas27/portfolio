export async function onRequest(context, next) {
  const response = await next();

  const newHeaders = new Headers(response.headers);
  newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; require-trusted-types-for 'script'");
  newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
