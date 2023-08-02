import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import * as inputLoc from "../../utils/inputLocalization";
import { FormattedMessage, useIntl } from "react-intl";
import FormRow from "../common/FormRow";
import MessageDisplay from "../common/MessageDisplay";
import { useMessageService } from "../../services/MessageService";
import DeleteButton from "../common/DeleteButton";

interface Props {
  employee?: Employee;
}

interface SaveParams {
  values: Employee;
}

const saveEmployee = async ({ values }: SaveParams) =>
  await fetch<Employee>(!values["@id"] ? "/employees" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

export const Form: FunctionComponent<Props> = ({ employee }) => {
  const messageService = useMessageService();
  const intl = useIntl();
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Employee> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveEmployee(saveParams));

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
              { label: employee["label"] }
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
                messageService.success("employee",
                  isCreation
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
                      { label: values["label"] }
                    )
                  );
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

            <MessageDisplay topic="employee_form" />

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
          <DeleteButton
            type="employee"
            item={employee}
            redirect="/employees"
            parentTopic="employee_form" />
        )}
      </div>
    </div>
  );
};
