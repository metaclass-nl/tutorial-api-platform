import React from "react";
import getIntl from "../../utils/intlProvider";

export default function SelectThreeState(props) {
  const intl = getIntl();
  return (
    <select
      {...props.input}
      id={props.meta.form + "_" + props.input.name}
    >
      <option value={null}></option>
      <option value={true}>
        {intl.formatMessage({id:"true", defaultMessage:"Yes"}) }
      </option>
      <option value={false}>
        {intl.formatMessage({id:"false", defaultMessage:"no"}) }
      </option>
    </select>
  );
}