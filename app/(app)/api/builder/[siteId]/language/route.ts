import { getLanguage } from "@/lib/builder/language";

import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  const languageId = _req.nextUrl.searchParams.get("languageId") || undefined;
  const personalInfos = await getLanguage(params.siteId, languageId);

  return Response.json(personalInfos);
}
