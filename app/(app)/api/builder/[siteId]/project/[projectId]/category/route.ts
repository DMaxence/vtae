import { getProjectCategories } from "@/lib/builder/project-category";

import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const query = _req.nextUrl.searchParams.get("q") || undefined;
  const projectCategories = await getProjectCategories(query);

  return Response.json(projectCategories);
}
