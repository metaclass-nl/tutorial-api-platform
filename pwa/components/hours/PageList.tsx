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

export const getHourssPath = (page?: string | string[] | undefined) =>
  `/hours${typeof page === "string" ? `?page=${page}` : ""}`;
export const getHourss = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Hours>>(getHourssPath(page));
const getPagePath = (path: string) =>
  `/hourss/page/${parsePage("hours", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: hourss, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Hours>> | undefined
  >(getHourssPath(page), getHourss(page));
  const collection = useMercure(hourss, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <Navigation/>
      <div>
        <Head>
          <title>Hours List</title>
        </Head>
      </div>
      <List hourss={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
