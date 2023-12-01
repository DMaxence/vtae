import { getLink } from "@/lib/builder/link";

import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  const linkId = _req.nextUrl.searchParams.get("linkId") || undefined;
  const personalInfos = await getLink(params.siteId, linkId);

  return Response.json(personalInfos);
}
