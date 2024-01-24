import { fetcher } from "@/utils";
import { Site } from "@prisma/client";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function useSite() {
  const { id } = useParams() as { id?: string };

  const { data: site, error } = useSWR<Site>(
    id && `/api/sites/${id}`,
    fetcher,
    {
      dedupingInterval: 30000,
    },
  );

  return {
    ...site,
    error,
    loading: id && !site && !error,
  };
}
