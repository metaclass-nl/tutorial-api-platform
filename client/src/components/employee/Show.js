import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/employee/show';
import { del } from '../../actions/employee/delete';
import {FormattedMessage, injectIntl} from "react-intl";
import * as defined from '../common/intlDefined';

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleted: PropTypes.object,
    del: PropTypes.func.isRequired,
    listQuery: PropTypes.string
  };

  deleting = false;

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.deleting = false;
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    const {intl} = this.props;
    if (window.confirm(intl.formatMessage({id:"employee.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"}))) {
      this.deleting = true;
      this.props.del(this.props.retrieved);
    }
  };

  render() {
    if (this.deleting && this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="employee.show" defaultMessage="Show {label}" values={ {label: item && item['label']} }/></h1>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
              <FormattedMessage id="loading" defaultMessage="Loading..."/>
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <table className="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th><FormattedMessage id="field" defaultMessage="Field"/></th>
                <th><FormattedMessage id="value" defaultMessage="Value"/></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><FormattedMessage id="employee.firstName" defaultMessage="firstName"/></th>
                <td>
                    {item['firstName']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.lastName" defaultMessage="lastName"/></th>
                <td>
                    {item['lastName']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.function" defaultMessage="function"/></th>
                <td>
                    {item['function']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.address" defaultMessage="address"/></th>
                <td>
                    {item['address']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.zipcode" defaultMessage="zipcode"/></th>
                <td>
                    {item['zipcode']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.city" defaultMessage="city"/></th>
                <td>
                    {item['city']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.birthDate" defaultMessage="birthDate"/></th>
                <td>
                    <defined.FormattedLocalDate value={item['birthDate']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.arrival" defaultMessage="arrival"/></th>
                <td>
                    <defined.FormattedLocalTime value={item['arrival']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="employee.label" defaultMessage="label"/></th>
                <td>
                    {item['label']}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to={"../" + (this.props.listQuery ? this.props.listQuery : "")} className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list" />
        </Link>
        {item && (
          <Link to={`/employees/edit/${encodeURIComponent(item['@id'])}`}>
            <button className="btn btn-warning"><FormattedMessage id="edit" defaultMessage="Edit"/></button>
          </Link>
        )}
        <button onClick={this.del} className="btn btn-danger">
          <FormattedMessage id="delete" defaultMessage="Delete"/>
        </button>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  retrieved: state.employee.show.retrieved,
  error: state.employee.show.error,
  loading: state.employee.show.loading,
  eventSource: state.employee.show.eventSource,
  deleteError: state.employee.del.error,
  deleteLoading: state.employee.del.loading,
  deleted: state.employee.del.deleted,
  listQuery: state.employee.list.query
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Show));
