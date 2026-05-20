export async function parseBody(req: Request): Promise<{ data: any; error: Response | null }> {
  try {
    const data = await req.json();
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: Response.json({ message: "Invalid or missing JSON body" }, { status: 400 }),
    };
  }
}
