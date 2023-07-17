import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Hours } from "../../types/Hours";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

import Navigation from "../Navigation";
import { RawIntlProvider } from "react-intl";
import createIntl from "../../utils/intlProvider";
import messages from "../../messages/hours_all";

export const getHourssPath = (page?: string | string[] | undefined) =>
  `/hours${typeof page === "string" ? `?page=${page}` : ""}`;
export const getHourss = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Hours>>(getHourssPath(page));
const getPagePath = (path: string) =>
  `/hourss/page/${parsePage("hours", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const {
    query: { page },
  } = router;
  const { data: { data: hourss, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Hours>> | undefined
  >(getHourssPath(page), getHourss(page));
  const collection = useMercure(hourss, hubURL);
  const intl = createIntl(router.locale, messages);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <RawIntlProvider value={intl}>
      <div>
        <Navigation/>
        <div>
          <Head>
            <title>
              {intl.formatMessage({
                id: "hours.list",
                defaultMessage: "Hours List",
              })}
            </title>
          </Head>
        </div>
        <List hourss={collection["hydra:member"]} />
        <Pagination collection={collection} getPagePath={getPagePath} />
      </div>
    </RawIntlProvider>
  );
};
