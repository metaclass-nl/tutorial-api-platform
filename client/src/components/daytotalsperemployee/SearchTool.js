import React from "react";
import ListTool from "../common/ListTool";
import PropTypes from "prop-types";
import { buildQuery, parseQuery } from "../../utils/dataAccess";
import SearchForm from "./SearchForm";
import isEqual from "lodash/isEqual";
import get from "lodash/get";

const pageParameterName="page";
const orderParameterName="order";

class SearchTool extends ListTool {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isUserAdmin: PropTypes.bool
  };

  apiRequest() {
    const {page, order, employee, start} = this.values;
    const req = {};
    req[pageParameterName] = page;
    req[orderParameterName] = order;

    if (employee) {
      if (employee.id) {
        // need to strip /employees/
        req.employee = employee.id.substring(11);
      }
      if (employee.function) {
        req["employee.function"] = employee.function;
      }
    }

    if (get(this.values, 'start.after')) {
      req.start = { after: this.convertToISOString(start.after) };
    } else {
      // one week ago at 00:00, local time
      const dt = new Date(Date.now() - 7 * 86400);
      const localDateString = dt.getFullYear()+ '-' + ('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      req.start = { after: this.convertToISOString(localDateString + + 'T00:00:00') };
    }
    if (get(this.values, 'start.strictly_before')) {
      req.start.strictly_before = this.convertToISOString(start.strictly_before);
    }

    return req;
  }

  convertToISOString(localDateString) {
    // convert local date to UTC after & before
    const y =  parseInt(localDateString.substring(0, 4), 10);
    const m = parseInt(localDateString.substring(5, 7), 10) - 1;
    const d = parseInt(localDateString.substring(8, 10), 10);
    return new Date(y, m, d, 0, 0, 0).toISOString();
  }

  shouldProcessChange(values, oldValues) {
    if (get(values, 'employee.id') !== get(oldValues, 'employee.id')) return true;

    const from = get(values, 'start.after');
    if (from !== get(oldValues, 'start.after')
      && (!from || from.substring(0, 4) > "1900")
    ) return true;

    const to = get(values, 'start.strictly_before');
    if (to !== get(oldValues, 'start.strictly_before')
      && (!to || to.substring(0, 4) > "1900")
    ) return true;

    return false;
  }

  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
  }

  /**
   * Event handler for changes in the search form.
   * Reset page.
   * Only process changes from fields that do not react to Enter key.
   * @param {} values
   */
  formChange(values) {
    if (this.shouldProcessChange(values, this.values)) {
      values.page=undefined;
      this.props.history.push(
        "?" + buildQuery(values)
      );
    }
  }

  /**
   * Event handler for submission of the search form.
   * If values have changed, reset page and push query to history.
   * @param {} values
   */
  formSubmit(values) {
    if (isEqual(values, this.values)) return;

    values.page=undefined;
    this.props.history.push(
      "?" + buildQuery(values)
    );
  }

  render() {
    console.log('initial values: ' + JSON.stringify(this.values))
    return (
      <SearchForm
        onSubmit={values => this.formSubmit(values)}
        onChange={values => this.formChange(values)}
        initialValues={ this.values }
        isUserAdmin={this.props.isUserAdmin}
      />
    );
  }
}

export default SearchTool;