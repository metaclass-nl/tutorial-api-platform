import React, { ReactElement, useState, useEffect } from "react";
import {
  FormattedMessage,
  useIntl,
  FormattedNumber as IntlFormattedNumber,
  FormattedDate as IntlFormattedDate,
  FormattedTime as IntlFormattedTime,
} from "react-intl";
import DefaultErrorPage, { ErrorProps } from "next/error";

/**
 *  Some components that render null if value===undefined
 */

/** If value defined, render localized representation */
export function LocalizedBool(props: { value?: boolean | null }) {
  if (props.value === undefined || props.value === null) {
    return null;
  }
  return props.value ? (
    <FormattedMessage id="true" defaultMessage={"Yes"} />
  ) : (
    <FormattedMessage id="false" defaultMessage={"No"} />
  );
}

/** Do not render 'NaN' if value===undefined */
export function FormattedNumber(props: { value: number | undefined }) {
  if (props.value === undefined || props.value === null) {
    return null;
  }
  return <IntlFormattedNumber {...(props as { value: number })} />;
}

/** Do not format the current date if value===undefined */
export function FormattedDate(props: {
  value: string | number | Date | undefined;
}) {
  if (props.value === undefined || props.value === null) {
    return null;
  }
  return WithTimeZoneOnServer(<IntlFormattedDate {...props} />);
}

/** Do not format the current date if value===undefined */
export function FormattedLocalDate(props: {
  value: string | undefined;
  trimTime?: boolean;
  weekday?: "long" | "short" | "narrow";
}) {
  if (props.value === undefined || props.value === null) {
    return null;
  }
  const copy = { ...props };
  if (props.trimTime) {
    copy.value = (props.value as string).substring(0, 10);
  }
  return <IntlFormattedDate {...copy} />;
}

/** Do not format the current time if value===undefined.
 * With PUT the server ignores time zone offset of the value, but with GET it does
 * concatenate the offset of the time zone of the server, resulting in a
 * different time then was supplied to PUT.
 */
export function FormattedTime(props: {
  value: string | undefined;
  weekday?: "long" | "short" | "narrow";
}) {
  if (props.value === undefined || props.value === null) {
    return null;
  }

  return WithTimeZoneOnServer(<IntlFormattedTime {...props} />);
}

/** Do not format the current time if value===undefined.
 * With PUT the server ignores time zone offset of the value, but with GET it does
 * concatenate the offset of the time zone of the server, resulting in a
 * different time then was supplied to PUT.
 */
export function FormattedLocalTime(props: {
  value: string | undefined;
}) {
  if (props.value === undefined || props.value === null) {
    return null;
  }
  // Remove the time zone offset
  const copy = { ...props };
  copy.value = (props.value as string).substring(0, 19);

  return <IntlFormattedTime {...copy} />;
}

/**
 * Allways format both date and time, except:
 * Do not format the current date and time if value===undefined */
export function FormattedDateTime(props: {
  value: string | undefined;
  year?: "numeric" | "2-digit" | undefined;
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  day?: "numeric" | "2-digit" | undefined;
  hour?: "numeric" | "2-digit" | undefined;
  minute?: "numeric" | "2-digit" | undefined;
}) {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [])

  if (props.value === undefined || props.value === null) {
    return null;
  }
  const extensible = { ...props };
  if (props.hour === undefined) {
    extensible.hour = "numeric";
  }
  if (props.minute === undefined) {
    extensible.minute = "numeric";
  }
  if (props.year === undefined) {
    extensible.year = "numeric";
  }
  if (props.month === undefined) {
    extensible.month = "numeric";
  }
  if (props.day === undefined) {
    extensible.day = "numeric";
  }

  return WithTimeZoneOnServer(<IntlFormattedDate {...extensible} />);
}

/**
 * On the server the client's timezone is unkown. To avaod confusion and
 * to support clients that do not support javascript (and some search engines)
 * the time zone is shown explicitly. When client side rendering occurs the
 * correct time zone wil be used and the time zone can be implicit.
 * @param component
 */
function WithTimeZoneOnServer(component: ReactElement<any, any>) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [])

  return (
    <span suppressHydrationWarning={true} >
      {component} {isClient ? "" : " "+Intl.DateTimeFormat().resolvedOptions().timeZone}
    </span>
  );
}

export function LocalizedDefaultErrorPage(props: ErrorProps) {
  const intl = useIntl();
  const titleUnexpected = intl.formatMessage({ id: "error.unexpected" });
  const propsCopy = { ...props };
  if (props.title === undefined) {
    propsCopy.title = intl.formatMessage({
      id: `error.${props.statusCode}`,
      defaultMessage: titleUnexpected,
    });
  }
  return <DefaultErrorPage {...propsCopy} />;
}
