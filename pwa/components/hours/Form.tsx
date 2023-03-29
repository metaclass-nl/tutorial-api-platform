import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Hours } from "../../types/Hours";

interface Props {
  hours?: Hours;
}

interface SaveParams {
  values: Hours;
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
  const [, setError] = useState<string | null>(null);
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
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!hours || !hours["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: hours["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/hourss"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {hours ? `Edit Hours ${hours["@id"]}` : `Create Hours`}
      </h1>
      <Formik
        initialValues={
          hours
            ? {
                ...hours,
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
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
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
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_nHours"
              >
                nHours
              </label>
              <input
                name="nHours"
                id="hours_nHours"
                value={values.nHours ?? ""}
                type="number"
                step="0.1"
                placeholder="number of hours"
                required={true}
                className={`mt-1 block w-full ${
                  errors.nHours && touched.nHours ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.nHours && touched.nHours ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="nHours"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_start"
              >
                start
              </label>
              <input
                name="start"
                id="hours_start"
                value={values.start?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.start && touched.start ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.start && touched.start ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="start"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_onInvoice"
              >
                onInvoice
              </label>
              <input
                name="onInvoice"
                id="hours_onInvoice"
                checked={values.onInvoice}
                type="checkbox"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.onInvoice && touched.onInvoice ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.onInvoice && touched.onInvoice ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="onInvoice"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_description"
              >
                description
              </label>
              <input
                name="description"
                id="hours_description"
                value={values.description ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.description && touched.description ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="description"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_employee"
              >
                employee
              </label>
              <input
                name="employee"
                id="hours_employee"
                value={values.employee ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.employee && touched.employee ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.employee && touched.employee ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="employee"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_label"
              >
                label
              </label>
              <input
                name="label"
                id="hours_label"
                value={values.label ?? ""}
                type="text"
                placeholder="Represent the entity to the user in a single string"
                className={`mt-1 block w-full ${
                  errors.label && touched.label ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.label && touched.label ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="label"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="hours_day"
              >
                day
              </label>
              <input
                name="day"
                id="hours_day"
                value={values.day ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.day && touched.day ? "border-red-500" : ""
                }`}
                aria-invalid={errors.day && touched.day ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="day"
              />
            </div>
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
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {hours && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
