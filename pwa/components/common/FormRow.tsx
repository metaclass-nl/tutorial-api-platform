// based on https://github.com/alexghenderson/formik-field
// MIT License

import React, { ReactNode, Component } from "react";
import { Field, ErrorMessage } from "formik";

function get(obj: { [key: string]: any }, key: string) {
  return obj === undefined ? undefined : obj[key];
}

export interface RenderProps {
  name: string;
  id?: string;
  onChange: (w?: any) => void;
  onBlur: () => void;
  value: any;
  touched: string;
  error: any;
  label: any;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  className: string;
}

export interface RenderFieldProps {
  name: string;
  onChange: (w?: any) => void;
  onBlur: () => void;
  value: any;
}

export interface FormRowProps {
  name: string;
  id?: string;
  label?: string | ReactNode;
  render?: (props: RenderProps) => ReactNode;
  format?: (value: any) => any;
  normalize?: (value: any) => any;
  className?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

class FormRow extends Component<FormRowProps, {}> {
  render() {
    const { render, name, label, format, normalize, className, ...field } =
      this.props;
    const r = render
      ? render
      : (inpprops: RenderFieldProps) => <input {...inpprops} />;
    const id = this.props.id ? field.id : `_${name}`;
    return (
      <Field>
        {(props: { form: HTMLFormElement }) => {
          const { form } = props;
          const handleChange = (e: any) => {
            let value: string | boolean;
            if (typeof e === "object" && e.target) {
              const target: HTMLInputElement = e.target as HTMLInputElement;
              value =
                target.type === "checkbox" ? target.checked : target.value;
            } else {
              value = e as string;
            }
            form.setFieldValue(name, normalize ? normalize(value) : value);
          };
          const handleBlur = () => {
            form.setFieldTouched(name, true);
          };
          const value = format
            ? format(get(form.values, name))
            : get(form.values, name);
          const touched = get(form.touched, name);
          const error = get(form.errors, name);

          return (
            <React.Fragment>
              <div className="mb-2">
                <label
                  className="text-gray-700 block text-sm font-bold"
                  htmlFor={id}
                >
                  {label}
                </label>
                {r({
                  name,
                  id,
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value,
                  touched: touched ? "true" : "false",
                  error,
                  label,
                  "aria-invalid": error && touched ? "true" : undefined,
                  className: className
                    ? className
                    : `mt-1 block w-full ${
                        error && touched ? "border-red-500" : ""
                      }`,
                  ...field,
                })}
              </div>
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name={name}
              />
            </React.Fragment>
          );
        }}
      </Field>
    );
  }
}

export default FormRow;
