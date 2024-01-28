import BlurImage from "@/components/blur-image";
import { Modal } from "@/components/radix-modal";
import useRouterStuff from "@/lib/hooks/use-router-stuff";
import { LoadingSpinner } from "@/lib/icons";
import { GOOGLE_FAVICON_URL, fetcher } from "@/utils";
import { BarList, Bold, Card, Flex, Text, Title } from "@tremor/react";
import { Link2, Maximize } from "lucide-react";
import { useContext, useState } from "react";
import useSWR from "swr";
import { StatsContext } from ".";

export default function Referer() {
  const { baseApiPath, queryString, totalVisitors, modal } =
    useContext(StatsContext);

  const { data } = useSWR<{ referer: string; clicks: number }[]>(
    `${baseApiPath}/referer?${queryString}`,
    fetcher,
  );

  const { queryParams } = useRouterStuff();
  const [showModal, setShowModal] = useState(false);

  const barList = (limit?: number) => (
    <BarList
      // @ts-ignore
      data={data?.map(({ clicks, referer }) => ({
        name: referer,
        value: clicks,
        icon: () =>
          referer === "(direct)" ? (
            <Link2 className="mr-2.5 h-4 w-4 self-center" />
          ) : (
            <BlurImage
              src={`${GOOGLE_FAVICON_URL}${referer}`}
              alt={referer}
              width={20}
              height={20}
              className="mr-2.5 h-4 w-4 self-center rounded-full"
            />
          ),
        href: queryParams({
          set: {
            referer: referer,
          },
          getNewPath: true,
        }),
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
          <h1 className="text-lg font-semibold">Referrers</h1>
        </div>
        {barList()}
      </Modal>
      <Card>
        <Title>Referrers</Title>
        <Flex className="mt-4">
          <Text>
            <Bold>Source</Bold>
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
