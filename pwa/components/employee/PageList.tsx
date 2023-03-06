import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Employee } from "../../types/Employee";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getEmployeesPath = (page?: string | string[] | undefined) =>
  `/employees${typeof page === "string" ? `?page=${page}` : ""}`;
export const getEmployees =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Employee>>(getEmployeesPath(page));
const getPagePath = (path: string) =>
  `/employees/page/${parsePage("employees", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: employees, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Employee>> | undefined
  >(getEmployeesPath(page), getEmployees(page));
  const collection = useMercure(employees, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Employee List</title>
        </Head>
      </div>
      <List employees={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
