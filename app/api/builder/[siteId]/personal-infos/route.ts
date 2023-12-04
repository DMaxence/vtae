import { getPersonalInfos } from "@/lib/builder/personal-infos";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  try {
    const personalInfos = await getPersonalInfos(params.siteId);

    return Response.json(personalInfos);
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
