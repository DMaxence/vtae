"use client";
import { LoadingCircle } from "@/lib/icons";
import useSites from "@/lib/swr/use-sites";
import { cn, fetcher } from "@/lib/utils";
import { SUB_DOMAIN } from "@/utils";
import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from "@tremor/react";
import useSWR from "swr";

export default function OverviewStats() {
  const { sites } = useSites();

  const domains = sites?.map((site) => {
    const names = [
      ...(site.customDomain ? [site.customDomain] : []),
      SUB_DOMAIN(site.subdomain as string),
    ];
    return names;
  });

  const { data, isLoading } = useSWR<
    Array<Array<{ start: string; clicks: number }>>
  >(
    `/api/edge/stats/timeseries?domains=${domains
      ?.flat()
      .join(",")}&interval=365d`,
    fetcher,
  );

  const flatDomains =
    data?.reduce((acc, curr, idx) => {
      acc = curr.map((d, i) => {
        return {
          start: d.start,
          clicks: d.clicks + (acc[i]?.clicks || 0),
        };
      });
      return acc;
    }, []) || [];

  const lastSixMonths = flatDomains.slice(-7);
  const previousSixMonths = flatDomains.slice(0, 6);

  const totalVisitorsPrevious = previousSixMonths?.reduce((acc, curr) => {
    return acc + curr.clicks;
  }, 0);

  const totalVisitorsLastSixMonths = lastSixMonths?.reduce((acc, curr) => {
    return acc + curr.clicks;
  }, 0);

  const totalVisitorsDifferencePercentage =
    ((totalVisitorsLastSixMonths - totalVisitorsPrevious) /
      (totalVisitorsPrevious || 1)) *
    100;

  const increase = totalVisitorsDifferencePercentage > 0;
  const decrease = totalVisitorsDifferencePercentage < 0;
  const unchanged = totalVisitorsDifferencePercentage === 0;

  const visitors = lastSixMonths?.map((d) => ({
    Month: new Date(d.start).toLocaleDateString("en-us", {
      month: "short",
      year: "numeric",
    }),
    "Total Visitors": d.clicks,
  }));

  return (
    <div className="grid gap-6">
      <Card className="dark:!bg-stone-900">
        <Text>Total Visitors</Text>
        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">{totalVisitorsLastSixMonths}</Metric>
          {!isLoading && (
            <BadgeDelta
              deltaType={
                increase
                  ? "moderateIncrease"
                  : decrease
                    ? "moderateDecrease"
                    : "unchanged"
              }
              className={cn({
                "dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400":
                  increase,
                "dark:bg-red-900 dark:bg-opacity-50 dark:text-red-400":
                  decrease,
                "dark:bg-gray-900 dark:bg-opacity-50 dark:text-gray-400":
                  unchanged,
              })}
            >
              {(totalVisitorsDifferencePercentage / 10).toFixed(0)}%
            </BadgeDelta>
          )}
        </Flex>
        {isLoading ? (
          <div className="flex p-5 justify-center">
          <LoadingCircle className="h-7 w-7" />
            </div>
        ) : (
          <AreaChart
            className="mt-6 h-28"
            data={visitors}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        )}
      </Card>
    </div>
  );
}
