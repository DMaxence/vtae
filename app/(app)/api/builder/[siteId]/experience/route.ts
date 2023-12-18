import { getExperience } from "@/lib/builder/experience";

import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  const experienceId =
    _req.nextUrl.searchParams.get("experienceId") || undefined;
  const personalInfos = await getExperience(params.siteId, experienceId);

  return Response.json(personalInfos);
}
