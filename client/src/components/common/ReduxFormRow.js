import React from "react";

function ReduxFieldInput(data) {
  return (
    <input
      {...data.input}
      type={data.type}
      step={data.step}
      required={data.required}
      placeholder={data.placeholder}
      id={data.meta.form + "_" + data.input.name}
    />
  );
}

export default function ReduxFormRow(data) {
  data.input.className = "form-control";

  const isInvalid = data.meta.touched && !!data.meta.error;
  if (isInvalid) {
    data.input.className += " is-invalid";
    data.input["aria-invalid"] = true;
  }

  if (data.apiError && data.meta.touched && !data.meta.error) {
    data.input.className += " is-valid";
  }

  return (
    <div className={`form-group`}>
      <label
        htmlFor={`${data.meta.form}_${data.input.name}`}
        className="form-control-label"
      >
        {data.label === undefined ? data.input.name : data.label}
      </label>
      <ReduxFieldInput {...data} />
      {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
    </div>
  );
}
