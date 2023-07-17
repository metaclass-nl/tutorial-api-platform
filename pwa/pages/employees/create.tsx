import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/employee/Form";
import { useRouter } from "next/router";
import { RawIntlProvider } from "react-intl";
import createIntl from "../../utils/intlProvider";
import messages from "../../messages/employee_all";

const Page: NextComponentType<NextPageContext> = () => {
  const intl = createIntl(useRouter().locale, messages);

  return (
    <RawIntlProvider value={intl}>
      <div>
        <div>
          <Head>
            <title>
              {intl.formatMessage({
                id: "employee.new",
                defaultMessage: "Create Employee",
              })}
            </title>
          </Head>
        </div>
        <Form />
      </div>
    </RawIntlProvider>
  );
};

export default Page;
