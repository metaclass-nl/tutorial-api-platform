import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/employee/Show";
import { PagedCollection } from "../../../types/collection";
import { Employee } from "../../../types/Employee";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

import { RawIntlProvider } from "react-intl";
import createIntl from "../../../utils/intlProvider";
import messages from "../../../messages/employee_all";
import { LocalizedDefaultErrorPage } from "../../../components/common/intlDefined";

const getEmployee = async (id: string | string[] | undefined) =>
  id ? await fetch<Employee>(`/employees/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;
  const intl = createIntl(router.locale, messages);

  const {
    data: { data: employee, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Employee> | undefined>(["employee", id], () =>
    getEmployee(id)
  );
  const employeeData = useMercure(employee, hubURL);

  if (!employeeData) {
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
            <title>{`Show Employee ${employeeData["@id"]}`}</title>
          </Head>
        </div>
        <Show employee={employeeData} text={text} />
      </div>
    </RawIntlProvider>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["employee", id], () => getEmployee(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Employee>>("/employees");
  const paths = await getItemPaths(response, "employees", "/employees/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
