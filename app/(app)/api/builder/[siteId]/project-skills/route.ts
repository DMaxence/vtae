import { getSkillsFromProjects } from "@/lib/builder/skill";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } },
) {
  try {
    const skills = await getSkillsFromProjects(params.siteId);

    return Response.json(skills);
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
