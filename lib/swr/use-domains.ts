import { DomainProps } from "@/lib/types";
import { SUB_DOMAIN, VTAE_DOMAINS, fetcher } from "@/utils";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

export default function useDomains({ domain }: { domain?: string } = {}) {
  const { siteId } = useParams() as {
    siteId: string;
  };

  const { data, error } = useSWR<DomainProps[]>(
    siteId && `/api/projects/${siteId}/domains`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  const domains = useMemo(() => {
    return siteId ? data : VTAE_DOMAINS;
  }, [siteId, data]) as DomainProps[];

  return {
    domains,
    primaryDomain: domains[0],
    verified: domain
      ? // If a domain is passed, check if it's verified
        domains?.find((d) => d.slug === domain)?.verified
      : // If no domain is passed, check if any of the domains are verified
        domains?.some((d) => d.verified),
    loading: !domains && !error,
    error,
  };
}
