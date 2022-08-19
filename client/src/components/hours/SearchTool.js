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
    const {page, order, description, employee, nHours, start} = this.values;
    const req = {};
    req[pageParameterName] = page;
    req[orderParameterName] = order;

    req.description = description;
    if (employee) {
      if (employee.id) {
        // need to strip /employees/
        req.employee = employee.id.substring(11);
      }
      if (employee.job) {
        req["employee.job"] = employee.job;
      }
    }
    if (nHours) {
      req.nHours = {gte: nHours-0.05, lt: nHours+0.05};
    }
    if (start) {
      // convert local date to UTC after & before
      const y =  parseInt(start.substring(0, 4), 10);
      const m = parseInt(start.substring(5, 7), 10) - 1;
      const d = parseInt(start.substring(8, 10), 10);
      req.start = {
        after: new Date(y, m, d, 0, 0, 0).toISOString(),
        before: new Date(y, m, d, 23, 59, 59).toISOString()
      }
    }

    return req;
  }

  shouldProcessChange(values, oldValues) {
    if (get(values, 'employee.id') !== get(oldValues, 'employee.id')) return true;
    if (values.start !== oldValues.start
      && (!values.start || values.start.substring(0, 4) > "1900")
    ) return true;
    return false;
  }

  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
    if (this.values.nHours)
      this.values.nHours = parseFloat(this.values.nHours);
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
