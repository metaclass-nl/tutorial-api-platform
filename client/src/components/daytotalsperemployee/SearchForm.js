import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import * as inputLoc from '../../utils/inputLocalization';
import {FormattedMessage} from 'react-intl';
import ReduxFormRow from '../common/ReduxFormRow.js';
import SelectEntity from '../common/SelectEntity.js';

class SearchForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    isUserAdmin: PropTypes.bool
  };

  renderField = data => {
    return <ReduxFormRow {...data} apiError={this.props.error}/>;
  }

  render() {
    return (
      <form className="search" onSubmit={this.props.handleSubmit} id="search_daytotalsperemployee">
        {this.props.isUserAdmin && (
          <Field
            component={this.renderField}
            name="employee.id"
            label={<FormattedMessage id="hours.employee" defaultMessage="employee" />}
            placeholder=""
            widget={SelectEntity}
            labelProp="label"
            fetchUrl="employees?pagination=false"
            />
          )}
        <Field
          component={this.renderField}
          name="start.after"
          type="date"
          label={<span><FormattedMessage id="hours.start" defaultMessage="start" /> <FormattedMessage id="daytotalsperemployee.from" defaultMessage="From" /></span>}
          placeholder=""
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
          />
        <Field
          component={this.renderField}
          name="start.strictly_before"
          type="date"
          label={<FormattedMessage id="daytotalsperemployee.to" defaultMessage="To" />}
          placeholder=""
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
        />
        <Field
          component={this.renderField}
          name="employee.function"
          type="text"
          label={<FormattedMessage id="employee.function" defaultMessage="function" />}
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
  form: 'search_daytotalsperemployee',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(SearchForm);
