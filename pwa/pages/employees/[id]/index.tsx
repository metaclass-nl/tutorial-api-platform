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

import { Show } from "../../../components/employee/Show";
import { PagedCollection } from "../../../types/collection";
import { Employee } from "../../../types/Employee";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getEmployee = async (id: string | string[] | undefined) =>
  id ? await fetch<Employee>(`/employees/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: employee, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Employee> | undefined>(["employee", id], () =>
    getEmployee(id)
  );
  const employeeData = useMercure(employee, hubURL);

  if (!employeeData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Employee ${employeeData["@id"]}`}</title>
        </Head>
      </div>
      <Show employee={employeeData} text={text} />
    </div>
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
