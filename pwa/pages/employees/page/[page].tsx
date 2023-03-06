import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getEmployees,
  getEmployeesPath,
} from "../../../components/employee/PageList";
import { PagedCollection } from "../../../types/collection";
import { Employee } from "../../../types/Employee";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getEmployeesPath(page), getEmployees(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Employee>>("/employees");
  const paths = await getCollectionPaths(
    response,
    "employees",
    "/employees/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
