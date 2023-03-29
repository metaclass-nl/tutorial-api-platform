import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getHourss,
  getHourssPath,
} from "../../../components/hours/PageList";
import { PagedCollection } from "../../../types/collection";
import { Hours } from "../../../types/Hours";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getHourssPath(page), getHourss(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Hours>>("/hours");
  const paths = await getCollectionPaths(
    response,
    "hours",
    "/hourss/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
