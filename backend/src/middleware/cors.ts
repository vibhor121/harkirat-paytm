const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function withCors(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const res = await handler(req);

    const headers = new Headers(res.headers);
    for (const [key, val] of Object.entries(CORS_HEADERS)) {
      headers.set(key, val);
    }

    return new Response(res.body, { status: res.status, headers });
  };
}
