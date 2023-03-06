import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/employee/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Employee</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
