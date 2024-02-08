import DashboardContentTitle from "@/components/dashboard-content-title";
import Stats from "@/components/stats";
import { TooltipProvider } from "@/components/tooltip";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SUB_DOMAIN } from "@/utils";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SiteAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <DashboardContentTitle site={data} title={`Analytics for ${data.name}`} />
      <Suspense fallback={<div className="h-screen w-full bg-gray-50" />}>
        <Stats
          staticDomain={data.customDomain || SUB_DOMAIN(data.subdomain || "")}
        />
      </Suspense>
    </>
  );
}
