import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/hours/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Hours</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
