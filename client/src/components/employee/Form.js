import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`employee_${data.input.name}`}
          className="form-control-label"
        >
          {data.input.name}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`employee_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          component={this.renderField}
          name="firstName"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="lastName"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="function"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="address"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="zipcode"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="city"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="birthDate"
          type="dateTime"
          placeholder="Date of birth"
          required={true}
        />
        <Field
          component={this.renderField}
          name="arrival"
          type="dateTime"
          placeholder="Tite the employee usually arrives at work"
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'employee',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
