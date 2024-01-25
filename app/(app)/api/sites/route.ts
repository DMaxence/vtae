import { Session, withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

// GET /api/sites – get user's sites
export const GET = withAuth(async ({ session }: { session: Session }) => {
  const data = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
  });
  if (!data) {
    return new Response("Site not found", { status: 404 });
  }
  return NextResponse.json(data);
});
