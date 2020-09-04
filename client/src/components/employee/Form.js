import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import * as inputLoc from '../../utils/inputLocalization';
import {FormattedMessage} from 'react-intl';
import ReduxFormRow from '../common/ReduxFormRow.js';
import getIntl from "../../utils/intlProvider";
import SelectEntity from "../common/SelectEntity";

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    isUserAdmin: PropTypes.bool
  };

    renderField = data => {
      return <ReduxFormRow {...data} apiError={this.props.error}/>;
    }

  render() {
    const intl = getIntl();
    return (
      <form onSubmit={this.props.handleSubmit}>
        {this.props.isUserAdmin && (
          <Field
            component={this.renderField}
            name="user"
            label={<FormattedMessage id="employee.user" defaultMessage="user" />}
            placeholder=""
            required={true}
            widget={SelectEntity}
            labelProp="label"
            fetchUrl="users?pagination=false" />
        )}
        <Field
          component={this.renderField}
          name="firstName"
          type="text"
          label={<FormattedMessage id="employee.firstName" defaultMessage="firstName" />}
          placeholder=""/>
        <Field
          component={this.renderField}
          name="lastName"
          type="text"
          label={<FormattedMessage id="employee.lastName" defaultMessage="lastName" />}
          placeholder=""
          required={true}/>
        <Field
          component={this.renderField}
          name="function"
          type="text"
          label={<FormattedMessage id="employee.function" defaultMessage="function" />}
          placeholder=""
          required={true}/>
        <Field
          component={this.renderField}
          name="address"
          type="text"
          label={<FormattedMessage id="employee.address" defaultMessage="address" />}
          placeholder=""
          required={true}/>
        <Field
          component={this.renderField}
          name="zipcode"
          type="text"
          label={<FormattedMessage id="employee.zipcode" defaultMessage="zipcode" />}
          placeholder=""/>
        <Field
          component={this.renderField}
          name="city"
          type="text"
          label={<FormattedMessage id="employee.city" defaultMessage="city" />}
          placeholder=""
          required={true}/>
        <Field
          component={this.renderField}
          name="birthDate"
          type="date"
          label={<FormattedMessage id="employee.birthDate" defaultMessage="birthDate" />}
          placeholder={intl.formatMessage({id:"employee.birthDate.placeholder", defaultMessage:"Date of birth"}) }
          required={true}
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
          />
        <Field
          component={this.renderField}
          name="arrival"
          type="time"
          label={<FormattedMessage id="employee.arrival" defaultMessage="arrival" />}
          placeholder={intl.formatMessage({id:"employee.arrival.placeholder", defaultMessage:"Time the employee usually arrives at work"}) }
          format={inputLoc.formatTime}
          normalize={inputLoc.normalizeTime}
          />

        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
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
