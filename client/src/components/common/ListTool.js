import { Component } from 'react';
import PropTypes from "prop-types";
import {buildQuery, parseQuery} from "../../utils/dataAccess";

class ListTool extends Component {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired
  };

  values = {};

  componentDidMount() {
    this.valuesFromQuery();
    this.props.list(this.values, buildQuery(this.apiRequest()));
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.valuesFromQuery();
      this.props.list(this.values, buildQuery(this.apiRequest()));
    }
  }

  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
  }

  apiRequest() {
    const {pageParameterName="page", orderParameterName="order"} = this.props;
    const req = {};
    req[pageParameterName] = this.values.page;
    req[orderParameterName] = this.values.order;

    return req;
  }

  render() {
    return null;
  }
}

export default ListTool;