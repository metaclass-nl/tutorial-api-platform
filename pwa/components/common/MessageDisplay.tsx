import React, { FunctionComponent, useState, useEffect } from "react";
import { MessageService, useMessageService, MessageData, subscriberFunction } from "../../services/MessageService";
import {useRouter} from "next/router";

interface Props {
  topic: string,
  clearOnRouteChange?: boolean,
}

const replaceClassNames: { [toReplace: string]: string } = {
  ":info": "border px-4 py-3 my-4 rounded text-gray-700 border-gray-400 bg-gray-100",
  ":success": "border px-4 py-3 my-4 rounded text-green-700 border-green-400 bg-green-100",
  ":danger": "border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100",
  ":warning": "border px-4 py-3 my-4 rounded text-amber-700 border-amber-400 bg-amber-100",
}

/**
 * Displays messages passed through a message service provided by MessageServiceContext.
 * For the class names used by the convenience functions of MessageService
 * to send common types of message data, like :succes, :warning and :danger,
 * it replaces those class names by the actual tailwind classes to be used.
 * @param topic Only messages with this topic will be displayed
 * @param clearOnRouteChange Wheather the component should be cleared if the user leaves the current route
 *     default is true
 */
const MessageDisplay: FunctionComponent<Props> = ({ topic, clearOnRouteChange= true}) => {

  const router = useRouter();
  const messageService: MessageService = useMessageService();
  const [messageData, setMessageData] = useState<MessageData | undefined>(messageService.get(topic));

  const receive: subscriberFunction = (messageData) => {
    setMessageData(messageData);
    // console.debug(topic + " received " + typeof messageData);
  }

  useEffect(() => {
      const routeChangeHandler = (url: string) => {
        // console.log(`routing to ${url}`);
        if (clearOnRouteChange) {
          messageService.clear(topic);
        }
      }

      messageService.subscribe(topic, receive);
      router.events.on('routeChangeStart', routeChangeHandler);

      return () => {
        router.events.off('routeChangeStart', routeChangeHandler);
        messageService.unsubscribe(topic, receive);
      }
    },
    [topic, messageService, clearOnRouteChange, router.events]
  );

  const className = messageData
    ? (messageData.className in replaceClassNames
      ? replaceClassNames[messageData.className]
      : messageData.className)
    : undefined;

  return (
    <div>
      {messageData && (
            <div key={topic} className={className} role={messageData.role}>
              {messageData.msg}
            </div>
        )}
    </div>
  );
}

export default MessageDisplay;
