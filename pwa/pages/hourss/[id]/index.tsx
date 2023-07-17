import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/hours/Show";
import { PagedCollection } from "../../../types/collection";
import { Hours } from "../../../types/Hours";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

import { RawIntlProvider } from "react-intl";
import createIntl from "../../../utils/intlProvider";
import messages from "../../../messages/hours_all";
import { LocalizedDefaultErrorPage } from "../../../components/common/intlDefined";

const getHours = async (id: string | string[] | undefined) =>
  id ? await fetch<Hours>(`/hours/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;
  const intl = createIntl(router.locale, messages);

  const { data: { data: hours, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Hours> | undefined>(["hours", id], () =>
      getHours(id)
    );
  const hoursData = useMercure(hours, hubURL);

  if (!hoursData) {
    return (
      <RawIntlProvider value={intl}>
        <LocalizedDefaultErrorPage statusCode={404} />
      </RawIntlProvider>
    );
  }

  // MetaClass: title is overwritten by title from Show - no need to translate this one (?)
  return (
    <RawIntlProvider value={intl}>
      <div>
        <div>
          <Head>
            <title>{`Show Hours ${hoursData["@id"]}`}</title>
          </Head>
        </div>
        <Show hours={hoursData} text={text} />
      </div>
    </RawIntlProvider>
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
