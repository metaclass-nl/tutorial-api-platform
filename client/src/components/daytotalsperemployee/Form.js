import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import * as inputLoc from '../../utils/inputLocalization';
import {FormattedMessage} from 'react-intl';
import ReduxFormRow from '../common/ReduxFormRow.js';
import getIntl from "../../utils/intlProvider";
import SelectEntity from '../common/SelectEntity.js';

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

    renderField = data => {
      return <ReduxFormRow {...data} apiError={this.props.error}/>;
    }

  render() {
    const intl = getIntl();
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          component={this.renderField}
          name="employee"
          label={<FormattedMessage id="daytotalsperemployee.employee" defaultMessage="employee" />}
          placeholder=""
          widget={SelectEntity}
          labelProp="label"
          fetchUrl="employees?pagination=false"
          />
        <Field
          component={this.renderField}
          name="from"
          type="datetime-local"
          label={<FormattedMessage id="daytotalsperemployee.from" defaultMessage="from" />}
          placeholder=""
          format={inputLoc.formatDateTime}
          normalize={inputLoc.normalizeDateTime}
          />

        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'daytotalsperemployee',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
