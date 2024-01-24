import { fetcher } from "@/utils";
import { Site } from "@prisma/client";
import useSWR from "swr";

export default function useSites() {
  const { data: sites, error } = useSWR<Site[]>(`/api/sites`, fetcher, {
    dedupingInterval: 30000,
  });

  return {
    sites,
    error,
    loading: !sites && !error,
  };
}
