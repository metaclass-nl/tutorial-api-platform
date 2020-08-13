import React from 'react';
import ListTool from "../common/ListTool";
import PropTypes from "prop-types";
import {buildQuery} from "../../utils/dataAccess";
import {FormattedMessage} from "react-intl";

class SearchTool extends ListTool {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  searchInput;

  apiRequest() {
    const req = super.apiRequest();
    req.search = this.values.search;
    return req;
  }

  /**
   * Event handler for submission of the search form.
   * If values have changed, reset page and push query to history.
   * @param {} e event from form submit
   */
  formSubmit(e) {
    e.preventDefault();

    if (this.searchInput.value === this.values.search) return;

    this.values.search = this.searchInput.value;
    this.values.page=undefined;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }

  render() {
    return (
      <form className="search" onSubmit={this.formSubmit.bind(this)}>
        <div className={`form-group`}>
          <input type="text" name="search" defaultValue={this.values.search} className="form-control" ref={ref=>this.searchInput=ref} id="search_employees_search"/>
        </div>
        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
        </button>
      </form>
    );
  }
}

export default SearchTool;