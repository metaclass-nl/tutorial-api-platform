import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import * as inputLoc from '../../utils/inputLocalization';
import {FormattedMessage} from 'react-intl';
import ReduxFormRow from '../common/ReduxFormRow.js';
import SelectEntity from '../common/SelectEntity.js';
import getIntl from "../../utils/intlProvider";

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
          name="nHours"
          type="number"
          label=<FormattedMessage id="hours.nHours" defaultMessage="nHours" />
          step="0.1"
          placeholder={ intl.formatMessage({id:"hours.nHours.placeholder", defaultMessage:"Mumber"}) }
          required={true}
          format={inputLoc.formatNumber}
          normalize={inputLoc.normalizeNumber}
          />
        <Field
          component={this.renderField}
          name="start"
          type="datetime-local"
          label=<FormattedMessage id="hours.start" defaultMessage="start" />
          placeholder=""
          required={true}
          format={inputLoc.formatDateTime}
          normalize={inputLoc.normalizeDateTime}
          />
        <Field
          component={this.renderField}
          name="onInvoice"
          type="checkbox"
          label=<FormattedMessage id="hours.onInvoice" defaultMessage="onInvoice" />
          placeholder=""/>
        <Field
          component={this.renderField}
          name="description"
          type="text"
          label=<FormattedMessage id="hours.description" defaultMessage="description" />
          placeholder=""
          required={true}/>
        <Field
          component={this.renderField}
          name="employee"
          label=<FormattedMessage id="hours.employee" defaultMessage="employee" />
          placeholder=""
          required={true}
          widget={SelectEntity}
          labelProp="label"
          fetchUrl="employees?pagination=false"
          />

        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'hours',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
