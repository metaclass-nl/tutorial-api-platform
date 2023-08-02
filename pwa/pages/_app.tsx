import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type { AppProps } from "next/app"
import type { DehydratedState } from "react-query"

import { MessageService, MessageServiceContext } from "../services/MessageService";

const msgService = new MessageService();

function MyApp({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) {
  return <Layout dehydratedState={pageProps.dehydratedState}>
    <MessageServiceContext.Provider value={msgService}>
      <Component {...pageProps} />
    </MessageServiceContext.Provider>
  </Layout>
}

export default MyApp
