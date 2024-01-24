import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/sites/[siteId] – get site's data
export const GET = withAuth(
  async ({ params }: { params: Record<string, string> | undefined }) => {
    const data = await prisma.site.findUnique({
      where: {
        id: params?.siteId,
      },
    });
    if (!data) {
      return new Response("Site not found", { status: 404 });
    }
    return NextResponse.json({
      ...data,
    });
  },
);
