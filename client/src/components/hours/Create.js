import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, reset } from '../../actions/hours/create';
import {FormattedMessage} from "react-intl";
import {parseQuery} from "../../utils/dataAccess";

class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    listQuery: PropTypes.string,
    userEmployee: PropTypes.object
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    if (this.props.created)
      return (
        <Redirect
          to={`edit/${encodeURIComponent(this.props.created['@id'])}`}
        />
      );

    const initialValues = {start: new Date().toISOString()};
    const listValues = parseQuery(this.props.listQuery);
    if (listValues.employee) {
      initialValues.employee = listValues.employee.id;
    }
    if (this.props.userEmployee) {
      initialValues.employee = this.props.userEmployee["@id"];
    }

    return (
      <div>
        <h1><FormattedMessage id="hours.new" defaultMessage="New Hours"/></h1>
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

        <Form onSubmit={this.props.create} initialValues={initialValues} />
        <Link to={"./" + (this.props.listQuery ? this.props.listQuery : "")} className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list"/>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.hours.create;
  const listQuery = state.hours.list.query;
  const { userEmployee } = state.login;
  return { created, error, loading, listQuery, userEmployee };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: () => dispatch(reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
