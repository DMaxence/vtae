import { Modal } from "@/components/radix-modal";
import { TabSelect } from "@/components/tab-select";
import useRouterStuff from "@/lib/hooks/use-router-stuff";
import { LoadingSpinner } from "@/lib/icons";
import { LocationTabs } from "@/lib/stats";
import { COUNTRIES, fetcher } from "@/utils";
import { BarList, Bold, Card, Flex, Text, Title } from "@tremor/react";
import { Maximize } from "lucide-react";
import { useContext, useState } from "react";
import useSWR from "swr";
import { StatsContext } from ".";

export default function Locations() {
  const [tab, setTab] = useState<LocationTabs>("country");

  const { baseApiPath, queryString, modal } = useContext(StatsContext);

  const { data } = useSWR<{ country: string; city: string; clicks: number }[]>(
    `${baseApiPath}/${tab}?${queryString}`,
    fetcher,
  );

  const { queryParams } = useRouterStuff();
  const [showModal, setShowModal] = useState(false);

  const barList = (limit?: number) => (
    <BarList
      // @ts-ignore
      data={data?.map((d) => ({
        name: tab === "country" ? COUNTRIES[d.country] : d.city,
        value: d.clicks,
        icon: () => (
          <img
            alt={d.country}
            src={`https://flag.vercel.app/m/${d.country}.svg`}
            className="mr-2.5 h-3 w-5 self-center"
          />
        ),
        href: queryParams({
          set: {
            [tab]: d[tab as "country" | "city"],
          },
          getNewPath: true,
        }) as string,
        target: "_self",
      }))}
      className="mt-2"
    />
  );

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        className="max-w-lg"
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-semibold">Locations</h1>
        </div>
        {barList()}
      </Modal>
      <Card>
        <Flex>
          <Title>Locations</Title>
          <Text>
            <TabSelect
              options={["country", "city"]}
              selected={tab}
              // @ts-ignore
              selectAction={setTab}
            />
          </Text>
        </Flex>
        <Flex className="mt-4">
          <Text>
            <Bold className="capitalize">{tab}</Bold>
          </Text>
          <Text>
            <Bold>Visitors</Bold>
          </Text>
        </Flex>
        {data ? (
          data.length > 0 ? (
            barList(9)
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-gray-600">No data available</p>
            </div>
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!modal && data && data.length > 9 && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-b from-transparent to-white py-2 text-gray-500 transition-all hover:text-gray-800 active:scale-95"
          >
            <Maximize className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase">View all</p>
          </button>
        )}
      </Card>
    </>
  );
}
