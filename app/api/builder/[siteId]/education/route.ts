import { getEducation } from "@/lib/builder/education";

import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  const educationId = _req.nextUrl.searchParams.get("educationId") || undefined;
  const personalInfos = await getEducation(params.siteId, educationId);

  return Response.json(personalInfos);
}
