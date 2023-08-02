import { FunctionComponent, useState,  } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik, FormikValues } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Hours } from "../../types/Hours";
import * as inputLoc from "../../utils/inputLocalization";
import { FormattedMessage, useIntl } from "react-intl";
import FormRow from "../common/FormRow";
import * as defined from '../common/intlDefined';
import SelectItem from '../common/SelectItem';
import { useMessageService } from "../../services/MessageService";
import MessageDisplay from "../common/MessageDisplay";
import DeleteButton from "../common/DeleteButton";

interface Props {
  hours?: Hours;
}

interface SaveParams {
  values: FormikValues;  // Hours.employee is incompatible
}

interface DeleteParams {
  id: string;
}

const saveHours = async ({ values }: SaveParams) =>
  await fetch<Hours>(!values["@id"] ? "/hours" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteHours = async (id: string) =>
  await fetch<Hours>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ hours }) => {
  const messageService = useMessageService();
  const intl = useIntl();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Hours> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveHours(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Hours> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteHours(id), {
    onSuccess: () => {
      router.push("/hourss");
    },
    onError: (error) => {
      setError(
        intl.formatMessage(
          {
            id: "hours.delete.error",
            defaultMessage: "Error when deleting the Hours: {error}.",
          },
          { error: error.message }
        )
      );
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!hours || !hours["@id"]) return;
    if (
      !window.confirm(
        intl.formatMessage({
          id: "hours.delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;
    deleteMutation.mutate({ id: hours["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/hourss"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {"< "}
        <FormattedMessage id="backToList" defaultMessage="Back to list" />
      </Link>
      <h1 className="text-3xl my-2">
        {hours
          ? intl.formatMessage(
              { id: "hours.update", defaultMessage: "Edit {start} {description}" },
              {start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"]}
            )
          : intl.formatMessage({
              id: "hours.new",
              defaultMessage: "Create Hours",
            })}
      </h1>
      <Formik
        initialValues={
          hours
            ? {
                ...hours,
                employee: hours.employee ? hours.employee["@id"] : "",
              }
            : new Hours()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                messageService.success("hours", (isCreation
                    ? intl.formatMessage(
                      { id: "hours.created", defaultMessage: "Element created" },
                      { label: "Hours" }
                    )
                    : intl.formatMessage(
                      { id: "hours.updated", defaultMessage: "Element updated" },
                      { start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"] }
                    ))
                );
                router.push("/hourss");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <FormRow
              name="nHours"
              label={
                <FormattedMessage id="hours.nHours" defaultMessage="nHours" />
              }
              type="number"
              placeholder={intl.formatMessage({
                id: "hours.nHours.placeholder",
                defaultMessage: "number of hours",
              })}
              required={true}
              render={(field) => <input step="0.1" {...field} />}
              format={inputLoc.formatNumber}
              normalize={inputLoc.normalizeNumber}
            />
            <FormRow
              name="start"
              label={
                <FormattedMessage id="hours.start" defaultMessage="start" />
              }
              type="datetime-local"
              placeholder=""
              required={true}
              format={inputLoc.formatDateTime}
              normalize={inputLoc.normalizeDateTime}
            />
            <FormRow
              name="onInvoice"
              label={
                <FormattedMessage
                  id="hours.onInvoice"
                  defaultMessage="onInvoice"
                />
              }
              type="checkbox"
              placeholder=""
              render={(field) => <input {...field} checked={field.value} />}
            />
            <FormRow
              name="description"
              label={
                <FormattedMessage
                  id="hours.description"
                  defaultMessage="description"
                />
              }
              type="text"
              placeholder=""
              required={true}
            />
            <FormRow
              name="employee"
              label={
                <FormattedMessage
                  id="hours.employee"
                  defaultMessage="employee"
                />
              }
              type="text"
              placeholder=""
              required={true}
              render={(renderProps) => (
                <SelectItem
                  labelProp="label"
                  fetchUrl="/employees?pagination=false"
                  input={renderProps}
                />
              )}
              normalize={(v) => (v ? v : null)}
            />
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}

            <MessageDisplay topic="hours_form" />

            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              <FormattedMessage id="submit" defaultMessage="Submit" />
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {hours && (
          <DeleteButton type="hours" item={hours} redirect="/hourss" parentTopic="hours_form" deletedMessage={
            intl.formatMessage(
              { id: "hours.deleted", defaultMessage: "Item deleted" },
              { start: <defined.FormattedDateTime value={hours["start"]} />, description: hours["description"] }
            )
          }/>
        )}
      </div>
    </div>
  );
};
