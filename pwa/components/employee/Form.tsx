import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";

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
  const [, setError] = useState<string | null>(null);
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
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!employee || !employee["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: employee["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/employees"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {employee ? `Edit Employee ${employee["@id"]}` : `Create Employee`}
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
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
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
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_firstName"
              >
                firstName
              </label>
              <input
                name="firstName"
                id="employee_firstName"
                value={values.firstName ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.firstName && touched.firstName ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.firstName && touched.firstName ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="firstName"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_lastName"
              >
                lastName
              </label>
              <input
                name="lastName"
                id="employee_lastName"
                value={values.lastName ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.lastName && touched.lastName ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.lastName && touched.lastName ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="lastName"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_job"
              >
                job
              </label>
              <input
                name="job"
                id="employee_job"
                value={values.job ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.job && touched.job ? "border-red-500" : ""
                }`}
                aria-invalid={errors.job && touched.job ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="job"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_address"
              >
                address
              </label>
              <input
                name="address"
                id="employee_address"
                value={values.address ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.address && touched.address ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.address && touched.address ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="address"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_zipcode"
              >
                zipcode
              </label>
              <input
                name="zipcode"
                id="employee_zipcode"
                value={values.zipcode ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.zipcode && touched.zipcode ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.zipcode && touched.zipcode ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="zipcode"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_city"
              >
                city
              </label>
              <input
                name="city"
                id="employee_city"
                value={values.city ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.city && touched.city ? "border-red-500" : ""
                }`}
                aria-invalid={errors.city && touched.city ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="city"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_birthDate"
              >
                birthDate
              </label>
              <input
                name="birthDate"
                id="employee_birthDate"
                value={values.birthDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder="Date of birth"
                required={true}
                className={`mt-1 block w-full ${
                  errors.birthDate && touched.birthDate ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.birthDate && touched.birthDate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="birthDate"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_arrival"
              >
                arrival
              </label>
              <input
                name="arrival"
                id="employee_arrival"
                value={values.arrival?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder="Time the employee usually arrives at work"
                className={`mt-1 block w-full ${
                  errors.arrival && touched.arrival ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.arrival && touched.arrival ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="arrival"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="employee_label"
              >
                label
              </label>
              <input
                name="label"
                id="employee_label"
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
        {employee && (
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
