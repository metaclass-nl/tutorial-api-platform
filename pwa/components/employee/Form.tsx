import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import * as inputLoc from "../../utils/inputLocalization";
import { FormattedMessage, useIntl } from "react-intl";
import FormRow from "../common/FormRow";

interface Props {
  employee?: Employee;
}

interface SaveParams {
  values: Employee;
}

interface DeleteParams {
  id: string;
}

const saveEmployee = async ({ values }: SaveParams) =>
  await fetch<Employee>(!values["@id"] ? "/employees" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteEmployee = async (id: string) =>
  await fetch<Employee>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ employee }) => {
  const intl = useIntl();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Employee> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveEmployee(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Employee> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteEmployee(id), {
    onSuccess: () => {
      router.push("/employees");
    },
    onError: (error) => {
      setError(
        intl.formatMessage(
          {
            id: "employee.delete.error",
            defaultMessage: "Error when deleting the Employee: {error}.",
          },
          { error: error.message }
        )
      );
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!employee || !employee["@id"]) return;
    if (
      !window.confirm(
        intl.formatMessage({
          id: "employee.delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;
    deleteMutation.mutate({ id: employee["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/employees"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {"< "}
        <FormattedMessage id="backToList" defaultMessage="Back to list" />
      </Link>
      <h1 className="text-3xl my-2">
        {employee
          ? intl.formatMessage(
              { id: "employee.update", defaultMessage: "Edit {label}" },
              { label: employee["@id"] }
            )
          : intl.formatMessage({
              id: "employee.new",
              defaultMessage: "Create Employee",
            })}
      </h1>
      <Formik
        initialValues={
          employee
            ? {
                ...employee,
              }
            : new Employee()
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
                  msg: isCreation
                    ? intl.formatMessage(
                        {
                          id: "employee.created",
                          defaultMessage: "Element created",
                        },
                        { label: "Employee" }
                      )
                    : intl.formatMessage(
                        {
                          id: "employee.updated",
                          defaultMessage: "Element updated",
                        },
                        { label: values["@id"] }
                      ),
                });
                router.push("/employees");
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
              name="firstName"
              label={
                <FormattedMessage
                  id="employee.firstName"
                  defaultMessage="firstName"
                />
              }
              type="text"
              placeholder=""
            />
            <FormRow
              name="lastName"
              label={
                <FormattedMessage
                  id="employee.lastName"
                  defaultMessage="lastName"
                />
              }
              type="text"
              placeholder=""
              required={true}
            />
            <FormRow
              name="job"
              label={
                <FormattedMessage id="employee.job" defaultMessage="job" />
              }
              type="text"
              placeholder=""
              required={true}
            />
            <FormRow
              name="address"
              label={
                <FormattedMessage
                  id="employee.address"
                  defaultMessage="address"
                />
              }
              type="text"
              placeholder=""
              required={true}
            />
            <FormRow
              name="zipcode"
              label={
                <FormattedMessage
                  id="employee.zipcode"
                  defaultMessage="zipcode"
                />
              }
              type="text"
              placeholder=""
            />
            <FormRow
              name="city"
              label={
                <FormattedMessage id="employee.city" defaultMessage="city" />
              }
              type="text"
              placeholder=""
              required={true}
            />
            <FormRow
              name="birthDate"
              label={
                <FormattedMessage
                  id="employee.birthDate"
                  defaultMessage="birthDate"
                />
              }
              type="date"
              placeholder={intl.formatMessage({
                id: "employee.birthDate.placeholder",
                defaultMessage: "Date of birth",
              })}
              required={true}
              format={inputLoc.formatDate}
              normalize={inputLoc.normalizeDate}
            />
            <FormRow
              name="arrival"
              label={
                <FormattedMessage
                  id="employee.arrival"
                  defaultMessage="arrival"
                />
              }
              type="time"
              placeholder={intl.formatMessage({
                id: "employee.arrival.placeholder",
                defaultMessage: "Time the employee usually arrives at work",
              })}
              format={inputLoc.formatTime}
              normalize={inputLoc.normalizeTime}
            />
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">hours</div>
              <FieldArray
                name="hours"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="employee_hours">
                    {values.hours && values.hours.length > 0 ? (
                      values.hours.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`hours.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        <FormattedMessage id="add" defaultMessage="Add" />
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <FormRow
              name="label"
              label={
                <FormattedMessage id="employee.label" defaultMessage="label" />
              }
              type="text"
              placeholder={intl.formatMessage({
                id: "employee.label.placeholder",
                defaultMessage:
                  "Represent the entity to the user in a single string",
              })}
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

            {error && (
              <div
                className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                role="alert"
              >
                {error}
              </div>
            )}

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
        {employee && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            <FormattedMessage id="delete" defaultMessage="Delete" />
          </button>
        )}
      </div>
    </div>
  );
};
