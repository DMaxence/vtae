import { getSkill } from "@/lib/builder/skill";

import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const query = _req.nextUrl.searchParams.get("q") || undefined;
  const personalInfos = await getSkill(query);

  return Response.json(personalInfos);
}
