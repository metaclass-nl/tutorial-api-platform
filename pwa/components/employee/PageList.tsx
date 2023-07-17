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

import Navigation from "../Navigation";
import { RawIntlProvider } from "react-intl";
import createIntl from "../../utils/intlProvider";
import messages from "../../messages/employee_all";

export const getEmployeesPath = (page?: string | string[] | undefined) =>
  `/employees${typeof page === "string" ? `?page=${page}` : ""}`;
export const getEmployees =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Employee>>(getEmployeesPath(page));
const getPagePath = (path: string) =>
  `/employees/page/${parsePage("employees", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const {
    query: { page },
  } = router;
  const { data: { data: employees, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Employee>> | undefined
  >(getEmployeesPath(page), getEmployees(page));
  const collection = useMercure(employees, hubURL);
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
                id: "employee.list",
                defaultMessage: "Employee List",
              })}
            </title>
          </Head>
        </div>
        <List employees={collection["hydra:member"]} />
        <Pagination collection={collection} getPagePath={getPagePath} />
      </div>
    </RawIntlProvider>
  );
};
