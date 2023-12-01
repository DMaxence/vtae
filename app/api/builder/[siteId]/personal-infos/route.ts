import { getPersonalInfos } from "@/lib/builder/personal-infos";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  console.log("GET /api/builder/personal-infos", _req.nextUrl.searchParams, params);
  const personalInfos = await getPersonalInfos(params.siteId);

  return Response.json(personalInfos);
}
