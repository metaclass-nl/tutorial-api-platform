import React from "react";
import ListTool from "../common/ListTool";
import PropTypes from "prop-types";
import { buildQuery } from "../../utils/dataAccess";
import SearchForm from "./SearchForm";
import isEqual from "lodash/isEqual";
import get from "lodash/get";

const pageParameterName = "page";
const orderParameterName = "order";

class SearchTool extends ListTool {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  /**
   * Please correct this method manually depending on the
   * actual fields of the SearchForm
   */
  apiRequest() {
    const { page, order } = this.values;
    const req = {};
    req[pageParameterName] = page;
    req[orderParameterName] = order;

    if (get(this.values, "employee.id")) {
      // need to strip /employee/
      req.employee = this.values.employee.id.substring("employee".length + 3);
    }
    if (this.values.from) {
      req.from = { after: this.values.from, before: this.values.from };
    }
    return req;
  }

  /**
   * Please correct this method manually depending on the
   * actual fields of the SearchForm
   */
  shouldProcessChange(values, oldValues) {

    if (get(values, "employee.id") !== get(oldValues, "employee.id")) return true;
    
    if (values.from !== oldValues.from
      && (!values.from || values.from.substring(0, 4) >= "1000")
    ) return true;
    return false;
  }

  /**
   * Please correct this method manually depending on the
   * actual fields of the SearchForm
   */
  valuesFromQuery() {
    super.valuesFromQuery();
  }

  /**
   * Event handler for changes in the search form.
   * Reset page.
   * Only process changes from fields that do not react to Enter key.
   * @param {} values
   */
  formChange(values) {
    if (this.shouldProcessChange(values, this.values)) {
      values.page = undefined;
      this.props.history.push("?" + buildQuery(values));
    }
  }

  /**
   * Event handler for submission of the search form.
   * If values have changed, reset page and push query to history.
   * @param {} values
   */
  formSubmit(values) {
    if (isEqual(values, this.values)) return;

    values.page = undefined;
    this.props.history.push("?" + buildQuery(values));
  }

  render() {
    return (
      <SearchForm
        onSubmit={values => this.formSubmit(values)}
        onChange={values => this.formChange(values)}
        initialValues={this.values}
        className="search"
      />
    );
  }
}

export default SearchTool;
