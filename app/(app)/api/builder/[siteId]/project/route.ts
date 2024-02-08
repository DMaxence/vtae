import { getProject } from "@/lib/builder/project";

import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  const projectId = _req.nextUrl.searchParams.get("projectId") || undefined;
  const project = await getProject(params.siteId, projectId);

  return Response.json(project);
}
