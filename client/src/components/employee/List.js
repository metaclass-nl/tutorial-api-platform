import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset, query } from '../../actions/employee/list';
import {FormattedMessage} from "react-intl";
import * as defined from '../common/intlDefined';
import Pagination from "../common/Pagination";
import {buildQuery} from "../../utils/dataAccess";
import SearchTool from "./SearchTool";
import ThSort from "../common/ThSort";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired
  };

  values = {};

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  list(values, apiQuery) {
    this.values = values;
    this.props.query(this.props.location.search);
    this.props.list("employees?" + apiQuery);
  }

  /**
   * Call back for pagination buttons
   * @param string page (numeric)
   */
  page(page) {
    this.values.page = page;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }

  /**
   * Call back for sort headers
   * @param {} order
   */
  order(order) {
    this.values.order = order;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }

  render() {
    return (
      <div>
        <h1><FormattedMessage id="employee.list" defaultMessage="Employee List"/></h1>

        {this.props.loading && (
          <div className="alert alert-info"><FormattedMessage id="loading" defaultMessage="Loading..."/></div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            <FormattedMessage id="employee.deleted" defaultMessage="{label} deleted" values={ {label: this.props.deletedItem['label']} }/>
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <div className="toolbar">
          <SearchTool
            query={this.props.location.search}
            list={this.list.bind(this)}
            history={this.props.history}
          />
          <div className="toolbar-buttons form-group">
            <Link to="create" className="btn btn-primary">
              <FormattedMessage id="employee.create" defaultMessage="Create"/>
            </Link>
          </div>
        </div>

        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <ThSort orderBy={ {"lastName": "asc", "firstName": "asc"} }  isDefault={true} order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.item" default="Employee"/>
              </ThSort>
              <ThSort orderBy={ {"function": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.function" default="function"/>
              </ThSort>
              <ThSort orderBy={ {"birthDate": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.birthDate" default="birthDate"/>
              </ThSort>
              <ThSort orderBy={ {"arrival": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.arrival" default="arrival"/>
              </ThSort>
              <th colSpan={3} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved['hydra:member'].map(item => (
                <tr key={item['@id']}>
                  <th scope="row">
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      {item['label']}
                    </Link>
                  </th>
                  <td>
                  {item['function']}
                  </td>
                  <td>
                  <defined.FormattedLocalDate value={item['birthDate']} />
                  </td>
                  <td>
                  <defined.FormattedLocalTime value={item['arrival']} />
                  </td>
                  <td>
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-search" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="show" defaultMessage="Show"/></span>
                    </Link>
                  </td>
                  <td>
                    <Link to={`edit/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-pencil fa-pencil-alt" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="edit" defaultMessage="Edit"/></span>
                    </Link>
                  </td>
                  <td>
                    <Link to={`../hours/?employee[id]=${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-clock" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="employee.hours" defaultMessage="Hours"/></span>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination retrieved={this.props.retrieved} onClick={page=>this.page(page)} />
      </div>
    );
  }

}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource
  } = state.employee.list;
  const deletedItem = state.employee.del.deleted;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource)),
  query: queryString => dispatch(query(queryString))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
