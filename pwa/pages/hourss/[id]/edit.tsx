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

import { Form } from "../../../components/hours/Form";
import { PagedCollection } from "../../../types/collection";
import { Hours } from "../../../types/Hours";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

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

  const { data: { data: hours } = {} } = useQuery<
    FetchResponse<Hours> | undefined
  >(["hours", id], () => getHours(id));

  if (!hours) {
    return (
      <RawIntlProvider value={intl}>
        <LocalizedDefaultErrorPage statusCode={404} />
      </RawIntlProvider>
    );
  }

  return (
    <RawIntlProvider value={intl}>
      <div>
        <div>
          <Head>
            <title>
              {intl.formatMessage(
                {
                  id: "hours.update",
                  defaultMessage: "Edit {label}",
                },
                { label: hours && hours["@id"] }
              )}
            </title>
          </Head>
        </div>
        <Form hours={hours} />
      </div>
    </RawIntlProvider>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param"); // MetaClass: Error message not meaningfull for the user so no need to translate
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
  const paths = await getItemPaths(response, "hours", "/hourss/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
