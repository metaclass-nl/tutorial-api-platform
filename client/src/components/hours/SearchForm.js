import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import * as inputLoc from '../../utils/inputLocalization';
import {FormattedMessage} from 'react-intl';
import getIntl from '../../utils/intlProvider';
import ReduxFormRow from '../common/ReduxFormRow.js';
import SelectEntity from '../common/SelectEntity.js';

class SearchForm extends Component {
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
      <form className="search" onSubmit={this.props.handleSubmit}>
        <Field
          component={this.renderField}
          name="employee.id"
          label=<FormattedMessage id="hours.employee" defaultMessage="employee" />
          placeholder=""
          widget={SelectEntity}
          labelProp="label"
          fetchUrl="employees?pagination=false"
          />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          label=<FormattedMessage id="hours.description" defaultMessage="description" />
          placeholder=""
          />
        <Field
          component={this.renderField}
          name="start"
          type="date"
          label=<FormattedMessage id="hours.start" defaultMessage="start" />
          placeholder=""
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
          />
        <Field
          component={this.renderField}
          name="nHours"
          type="number"
          label=<FormattedMessage id="hours.nHours" defaultMessage="nHours" />
          step="0.1"
          placeholder={ intl.formatMessage({id:"hours.nHours.placeholder", defaultMessage:"Mumber"}) }
          format={inputLoc.formatNumber}
          normalize={inputLoc.normalizeNumber}
          />
        <Field
          component={this.renderField}
          name="employee.function"
          type="text"
          label=<FormattedMessage id="employee.function" defaultMessage="function" />
          placeholder=""
          />
        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'search_hours',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(SearchForm);
