import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/hours/Show";
import { PagedCollection } from "../../../types/collection";
import { Hours } from "../../../types/Hours";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getHours = async (id: string | string[] | undefined) =>
  id ? await fetch<Hours>(`/hours/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: hours, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Hours> | undefined>(["hours", id], () =>
      getHours(id)
    );
  const hoursData = useMercure(hours, hubURL);

  if (!hoursData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Hours ${hoursData["@id"]}`}</title>
        </Head>
      </div>
      <Show hours={hoursData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["hours", id], () => getHours(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Hours>>("/hours");
  const paths = await getItemPaths(response, "hours", "/hourss/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
