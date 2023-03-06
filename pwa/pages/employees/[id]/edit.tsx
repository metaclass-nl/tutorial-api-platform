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

import { Form } from "../../../components/employee/Form";
import { PagedCollection } from "../../../types/collection";
import { Employee } from "../../../types/Employee";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getEmployee = async (id: string | string[] | undefined) =>
  id ? await fetch<Employee>(`/employees/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: employee } = {} } = useQuery<
    FetchResponse<Employee> | undefined
  >(["employee", id], () => getEmployee(id));

  if (!employee) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{employee && `Edit Employee ${employee["@id"]}`}</title>
        </Head>
      </div>
      <Form employee={employee} />
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
  const paths = await getItemPaths(
    response,
    "employees",
    "/employees/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
