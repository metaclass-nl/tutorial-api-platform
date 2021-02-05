import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset, query } from '../../actions/hours/list';
import {FormattedMessage} from "react-intl";
import * as defined from '../common/intlDefined';
import EntityLinks from '../common/EntityLinks';
import Pagination from "../common/Pagination";
import SearchTool from "./SearchTool";
import {buildQuery} from "../../utils/dataAccess";
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
    isUserAdmin: PropTypes.bool
  };

  values = {};

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  list(values, apiQuery) {
    this.values = values;
    this.props.query(this.props.location.search);
    this.props.list("hours?" + apiQuery);
  }

  /**
   * Event handler for pagination buttons
   * @param string page (numeric)
   */
  page(page) {
    this.values.page = page;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }

  /**
   * Event handler for sort headers
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
        <h1><FormattedMessage id="hours.list" defaultMessage="Hours List"/></h1>

        {this.props.loading && (
          <div className="alert alert-info"><FormattedMessage id="loading" defaultMessage="Loading..."/></div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            <FormattedMessage id="hours.deleted" defaultMessage="{label} deleted" values={ {label: this.props.deletedItem['label']} }/>
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
            isUserAdmin={this.props.isUserAdmin}
          />
          <div className="toolbar-buttons form-group">
            <Link to="create" className="btn btn-primary">
              <FormattedMessage id="hours.create" defaultMessage="Create"/>
            </Link>
          </div>
        </div>

        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <ThSort orderBy={ {"start": "desc"} } isDefault={true} order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.start" defaultMessage="start"/>
              </ThSort>
              <th>
                <FormattedMessage id="hours.day" defaultMessage="day"/>
              </th>
              <ThSort orderBy={ {"description": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.description" defaultMessage="description"/>
              </ThSort>
              <ThSort orderBy={ {"nHours": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.nHours" defaultMessage="nHours"/>
              </ThSort>
              <ThSort orderBy={ {"employee.lastName": "asc", "employee.firstName": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.employee" defaultMessage="employee"/>
              </ThSort>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved['hydra:member'].map(item => (
                <tr key={item['@id']}>
                  <th scope="row">
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      <defined.FormattedDateTime value={item['start']} />
                    </Link>
                  </th>
                  <td>
                    <defined.FormattedDate value={item['start']} weekday="short"/>
                  </td>
                  <td>
                  {item['description']}
                  </td>
                  <td>
                    <defined.FormattedNumber value={item['nHours']}/>
                  </td>
                  <td><EntityLinks type="employees" items={item['employee']} labelProp="label" /></td>
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
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination retrieved={this.props.retrieved} onClick={page=>this.page(page)}/>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.hours.list;
  const { isUserAdmin } = state.login;
  return { retrieved, loading, error, eventSource, deletedItem, isUserAdmin };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource)),
  query: queryString => dispatch(query(queryString))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
