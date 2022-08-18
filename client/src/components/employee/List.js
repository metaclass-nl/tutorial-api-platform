import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/employee/list';
import {FormattedMessage} from "react-intl";
import * as defined from '../common/intlDefined';
import EntityLinks from '../common/EntityLinks';
import Pagination from "../common/Pagination";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page)
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.page !== prevProps.match.params.page)
      this.props.list(
        this.props.match.params.page &&
          decodeURIComponent(this.props.match.params.page)
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
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
            <FormattedMessage id="employee.deleted" defaultMessage="{label} deleted" values={ {label: this.props.deletedItem['@id']} }/>
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link to="create" className="btn btn-primary">
            <FormattedMessage id="employee.create" defaultMessage="Create"/>
          </Link>
        </p>

        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th><FormattedMessage id="employee.firstName" default="firstName"/></th>
              <th><FormattedMessage id="employee.lastName" default="lastName"/></th>
              <th><FormattedMessage id="employee.job" default="function"/></th>
              <th><FormattedMessage id="employee.address" default="address"/></th>
              <th><FormattedMessage id="employee.zipcode" default="zipcode"/></th>
              <th><FormattedMessage id="employee.city" default="city"/></th>
              <th><FormattedMessage id="employee.birthDate" default="birthDate"/></th>
              <th><FormattedMessage id="employee.arrival" default="arrival"/></th>
              <th><FormattedMessage id="employee.hours" default="hours"/></th>
              <th><FormattedMessage id="employee.label" default="label"/></th>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved['hydra:member'].map(item => (
                <tr key={item['@id']}>
                  <th scope="row">
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      {item['@id']}
                    </Link>
                  </th>
                  <td>
                  {item['firstName']}
                  </td>
                  <td>
                  {item['lastName']}
                  </td>
                  <td>
                  {item['job']}
                  </td>
                  <td>
                  {item['address']}
                  </td>
                  <td>
                  {item['zipcode']}
                  </td>
                  <td>
                  {item['city']}
                  </td>
                  <td>
                  <defined.FormattedLocalDate value={item['birthDate']} />
                  </td>
                  <td>
                  <defined.FormattedLocalTime value={item['arrival']} />
                  </td>
                  <td><EntityLinks type="hours" items={item['hours']} /></td>
                  <td>
                  {item['label']}
                  </td>
                  <td>
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-search" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="show" default="Show"/></span>
                    </Link>
                  </td>
                  <td>
                    <Link to={`edit/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-pencil fa-pencil-alt" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="edit" default="Edit"/></span>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination retrieved={this.props.retrieved} />
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
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
