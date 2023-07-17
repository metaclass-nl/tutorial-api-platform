import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { Hours } from "../../types/Hours";
import { FormattedMessage, useIntl } from "react-intl";
import * as defined from "../common/intlDefined";

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
      id: "hours.show",
      defaultMessage: "Show {label}",
    },
    { label: hours && hours["@id"] }
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
      <h1 className="text-3xl mb-2">{title}</h1>
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
              <ReferenceLinks
                items={{
                  href: getItemPath(hours["employee"], "/employees/[id]"),
                  name: hours["employee"],
                }}
              />
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
      {error && (
        <div
          className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(hours["@id"], "/hourss/[id]/edit")}
          className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </Link>
        <button
          className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          <FormattedMessage id="delete" defaultMessage="Delete" />
        </button>
      </div>
    </div>
  );
};
