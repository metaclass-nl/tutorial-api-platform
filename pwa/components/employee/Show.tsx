import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import { FormattedMessage, useIntl } from "react-intl";
import * as defined from "../common/intlDefined";

interface Props {
  employee: Employee;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ employee, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const intl = useIntl();

  const handleDelete = async () => {
    if (!employee["@id"]) return;
    if (
      !window.confirm(
        intl.formatMessage({
          id: "employee.delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;

    try {
      await fetch(employee["@id"], { method: "DELETE" });
      router.push("/employees");
    } catch (error) {
      setError(
        intl.formatMessage(
          {
            id: "employee.delete.error",
            defaultMessage: "Error when deleting the Employee.",
          },
          { error: (error as Error).message }
        )
      );
      console.error(error);
    }
  };

  const title = intl.formatMessage(
    {
      id: "employee.show",
      defaultMessage: "Show {label}",
    },
    { label: employee && employee["@id"] }
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
        href="/employees"
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
              <FormattedMessage
                id="employee.firstName"
                defaultMessage="firstName"
              />
            </th>
            <td>{employee["firstName"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="employee.lastName"
                defaultMessage="lastName"
              />
            </th>
            <td>{employee["lastName"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="employee.job" defaultMessage="job" />
            </th>
            <td>{employee["job"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="employee.address"
                defaultMessage="address"
              />
            </th>
            <td>{employee["address"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="employee.zipcode"
                defaultMessage="zipcode"
              />
            </th>
            <td>{employee["zipcode"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="employee.city" defaultMessage="city" />
            </th>
            <td>{employee["city"]}</td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="employee.birthDate"
                defaultMessage="birthDate"
              />
            </th>
            <td>
              <defined.FormattedLocalDate value={employee["birthDate"]} />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage
                id="employee.arrival"
                defaultMessage="arrival"
              />
            </th>
            <td>
              <defined.FormattedLocalTime value={employee["arrival"]} />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="employee.hours" defaultMessage="hours" />
            </th>
            <td>
              {employee["hours"] && (
                <ReferenceLinks
                  items={employee["hours"].map((ref: any) => ({
                    href: getItemPath(ref, "/hourss/[id]"),
                    name: ref,
                  }))}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">
              <FormattedMessage id="employee.label" defaultMessage="label" />
            </th>
            <td>{employee["label"]}</td>
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
          href={getItemPath(employee["@id"], "/employees/[id]/edit")}
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
