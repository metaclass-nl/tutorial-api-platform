import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { Hours } from "../../types/Hours";
import { FormattedMessage, useIntl } from "react-intl";
import * as defined from "../common/intlDefined";
import MessageDisplay from "../common/MessageDisplay";
import DeleteButton from "../common/DeleteButton";

interface Props {
  hours: Hours;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ hours, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const intl = useIntl();

  const handleDelete = async () => {
    if (!hours["@id"]) return;
    if (
      !window.confirm(
        intl.formatMessage({
          id: "hours.delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;

    try {
      await fetch(hours["@id"], { method: "DELETE" });
      router.push("/hourss");
    } catch (error) {
      setError(
        intl.formatMessage(
          {
            id: "hours.delete.error",
            defaultMessage: "Error when deleting the Hours.",
          },
          { error: (error as Error).message }
        )
      );
      console.error(error);
    }
  };

  const title = intl.formatMessage(
    {
      id: "hours.show.head",
      defaultMessage: "Show Hours",
    }
  );

  return (
    <div className="p-4">
      <Head>
        <title>{title}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <Link
        href="/hourss"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {"< "}
        <FormattedMessage id="backToList" defaultMessage="Back to list" />
      </Link>
      <h1 className="text-3xl mb-2">
        <FormattedMessage
          id="hours.show"
          defaultMessage="Show {start} {description}"
          values={ {start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"]} }
        />
      </h1>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
          <tr>
            <th>
              <FormattedMessage id="field" defaultMessage="Field" />
            </th>
            <th>
              <FormattedMessage id="value" defaultMessage="Value" />
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          <tr>
            <th scope="row">
              <FormattedMessage id="hours.nHours" defaultMessage="nHours" />
            </th>
            <td>
              <defined.FormattedNumber value={hours["nHours"]} />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="hours.start" defaultMessage="start" />
            </th>
            <td>
              <defined.FormattedDateTime value={hours["start"]} />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="hours.onInvoice"
                defaultMessage="onInvoice"
              />
            </th>
            <td>
              <defined.LocalizedBool value={hours["onInvoice"]} />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="hours.description"
                defaultMessage="description"
              />
            </th>
            <td>{hours["description"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="hours.employee" defaultMessage="employee" />
            </th>
            <td>
              {hours["employee"] &&
                <ReferenceLinks
                  items={{
                    href: getItemPath(hours["employee"]["@id"], "/employees/[id]"),
                    name: hours["employee"]["label"],
                  }}
                />
              }
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="hours.label" defaultMessage="label" />
            </th>
            <td>{hours["label"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="hours.day" defaultMessage="day" />
            </th>
            <td><defined.FormattedLocalDate value={hours['start']} weekday="short"/></td>
          </tr>
        </tbody>
      </table>
      <MessageDisplay topic="hours_show" />
      <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(hours["@id"], "/hourss/[id]/edit")}
          className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </Link>
        <DeleteButton type="hours" item={hours} redirect="/hourss" parentTopic="hours_show" deletedMessage={
          intl.formatMessage(
            { id: "hours.deleted", defaultMessage: "Item deleted" },
            { start: <defined.FormattedDateTime value={hours["start"]} />, description: hours["description"] }
          )
        }/>
      </div>
    </div>
  );
};
