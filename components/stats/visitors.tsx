import useRouterStuff from "@/lib/hooks/use-router-stuff";
import { VALID_STATS_FILTERS } from "@/lib/stats";
import { fetcher } from "@/lib/utils";
import { COUNTRIES, capitalize, linkConstructor } from "@/utils";
import { AreaChart, Card, Title } from "@tremor/react";
import { X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useContext } from "react";
import useSWR from "swr";
import { StatsContext } from ".";
import LoadingSpinner from "../icons/loading-spinner";

export default function Visitors() {
  const { baseApiPath, queryString, interval } = useContext(StatsContext);

  const { data } = useSWR<{ start: Date; clicks: number }[]>(
    `${baseApiPath}/timeseries?${queryString}`,
    fetcher,
  );
  const { slug = "test" } = useParams() as { slug?: string };
  const searchParams = useSearchParams();
  const domain = searchParams?.get("domain");
  const key = searchParams?.get("key");
  const { queryParams } = useRouterStuff();

  const formatTimestamp = useCallback(
    (e: Date) => {
      switch (interval) {
        case "1h":
          return new Date(e).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
          });
        case "24h":
          return new Date(e)
            .toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              hour: "numeric",
            })
            .replace(",", " ");
        case "90d":
        case "180d":
        case "365d":
        case "all":
          return new Date(e).toLocaleDateString("en-us", {
            month: "short",
            year: "numeric",
          });
        default:
          return new Date(e).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
          });
      }
    },
    [data, interval],
  );

  const visitors = data?.map((d) => ({
    date: formatTimestamp(d.start),
    Visitors: d.clicks,
  }));

  return (
    <Card>
      <Title>Visitors</Title>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {slug &&
          domain &&
          (key ? (
            <button
              onClick={() => {
                queryParams({
                  del: ["domain", "key"],
                });
              }}
              className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-500 transition-all duration-75 hover:bg-gray-100 active:scale-[0.98] sm:px-3"
            >
              <p>Link</p>
              <strong className="text-gray-800">
                {linkConstructor({ domain, key, pretty: true })}
              </strong>
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                queryParams({
                  del: "domain",
                });
              }}
              className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-500 transition-all duration-75 hover:bg-gray-100 active:scale-[0.98] sm:px-3"
            >
              <p>Domain</p>
              <strong className="text-gray-800">{domain}</strong>
              <X className="h-4 w-4" />
            </button>
          ))}
        {VALID_STATS_FILTERS.map((filter) => {
          const value = searchParams?.get(filter);
          if (!value) return null;
          return (
            <button
              key={filter}
              onClick={() => {
                queryParams({
                  del: filter,
                });
              }}
              className="flex items-center space-x-1 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-500 transition-all duration-75 hover:bg-gray-100 active:scale-[0.98] sm:px-3"
            >
              <p>{capitalize(filter)}</p>
              <strong className="text-gray-800">
                {filter === "country" ? COUNTRIES[value] : value}
              </strong>
              <X className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      {data && data.length > 0 ? (
        <AreaChart
          className="mt-4 h-72"
          data={visitors || []}
          index="date"
          categories={["Visitors"]}
          colors={["indigo"]}
          valueFormatter={(number: number) =>
            Intl.NumberFormat("us").format(number).toString()
          }
        />
      ) : (
        <LoadingSpinner />
      )}
    </Card>
  );
}
