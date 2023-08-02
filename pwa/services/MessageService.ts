import React, {FunctionComponent} from 'react'
import { intlFormatted } from "../components/common/intlDefined";

export class MessageData {
  constructor(
    public msg: intlFormatted ,
    public className: string = "",
    public role: string = "alert",
  ) {

  }
}

export interface subscriberFunction {
  (arg0: MessageData | undefined): void
}

/**
 * Service to pass messages to MessageDisplays.
 */
export class MessageService {
  stock: { [topic: string]: MessageData | undefined } = {} ;
  subscribed: { [topic: string]: subscriberFunction[] } = {};

  // Core functions

  /** Stores a function that will be called if a new message arrives.
   * Multiple functions can be subscribed for the same subject so that it will
   * be no problem if subscribtion and unsubscription happens in an unexpected order.
   * @param topic
   * @param subscriber
   */
  subscribe(topic: string, subscriber: subscriberFunction) {
    if (this.subscribed[topic] === undefined) {
      this.subscribed[topic] = [];
    }
    this.subscribed[topic].push(subscriber);;
    // console.debug(topic + " subscribed: " + this.subscribed[topic].length)
  }

  /** Removes a function so that it will no longer be called if a new message arrives.
   * @param topic
   * @param subscriber
   */
  unsubscribe(topic: string, subscriber: subscriberFunction) {
    if (! (topic in this.subscribed)) {
      return;
    }
    const index = this.subscribed[topic].indexOf(subscriber);
    if (index === -1) {
      return;
    }
    this.subscribed[topic].splice(index, 1);
  }

  /**
   * Stores new message data and calls eventual subscriber functions.
   * Existing message data will be replaced.
   * @param topic
   * @param messageData
   */
  set(topic: string, messageData: MessageData | undefined) {
    this.stock[topic] = messageData;
    // console.log(topic + " received " + typeof messageData)

    if (topic in this.subscribed) {
      this.subscribed[topic].forEach( (subscriber) => {
          subscriber(messageData);
          // console.log(topic + " dispatched " + typeof messageData)
        }
      );
    }
  }

  /**
   * Retieves previously stored message data, or undefined if none
   * @param topic
   */
  get(topic: string): MessageData | undefined {
    return this.stock[topic];
  }

  // Convenience functions

  info(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":info"})
  }

  success(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":success"})
  }

  danger(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":danger"})
  }

  warning(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":warning"})
  }

  clear(topic: string) {
    this.set(topic, undefined);
  }
}

/**
 * Context that may be used to provide the service to the consuming components.
 *
 * May be used in App to wrap the page Component:
 * <MessageServiceContext.Provider value={msgService}>
 *       <Component {...pageProps} />
 * </MessageServiceContext.Provider>
 * where msgService should contain an instance of MessageService.
 */
export const MessageServiceContext = React.createContext<MessageService | undefined>(undefined);

/**
 * Hook to easily obtain the message service from the above context
 */
export const useMessageService = () => {
  const messageService = React.useContext(MessageServiceContext);

  if (!messageService) {
    throw new Error('No MessageService availabe, use MessageServiceProvider to provide one')
  }

  return messageService;
}

