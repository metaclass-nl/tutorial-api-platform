import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { retrieve, update, reset } from '../../actions/employee/update';
import { del } from '../../actions/employee/delete';
import {FormattedMessage, injectIntl} from "react-intl";

class Update extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    retrieveLoading: PropTypes.bool.isRequired,
    retrieveError: PropTypes.string,
    updateLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    updated: PropTypes.object,
    deleted: PropTypes.object,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    const {intl} = this.props;
    if (window.confirm(intl.formatMessage({id:"employee.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"})))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="employee.update" defaultMessage="Edit {label}" values={ {label: item && item['@id']} }/></h1>

        {this.props.created && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="employee.created" defaultMessage="{label} created." values={ {label: this.props.created['@id']} } />
          </div>
        )}
        {this.props.updated && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="employee.updated" defaultMessage="{label} updated." values={ {label: this.props.updated['@id']} } />
          </div>
        )}
        {(this.props.retrieveLoading ||
          this.props.updateLoading ||
          this.props.deleteLoading) && (
          <div className="alert alert-info" role="status">
            <FormattedMessage id="loading" defaultMessage="Loading..."/>
          </div>
        )}
        {this.props.retrieveError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.retrieveError}
          </div>
        )}
        {this.props.updateError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.updateError}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <Form
            onSubmit={values => this.props.update(item, values)}
            initialValues={item}
          />
        )}
        <Link to=".." className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list"/>
        </Link>
        <button onClick={this.del} className="btn btn-danger">
          <FormattedMessage id="delete" defaultMessage="Delete"/>
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  retrieved: state.employee.update.retrieved,
  retrieveError: state.employee.update.retrieveError,
  retrieveLoading: state.employee.update.retrieveLoading,
  updateError: state.employee.update.updateError,
  updateLoading: state.employee.update.updateLoading,
  deleteError: state.employee.del.error,
  deleteLoading: state.employee.del.loading,
  eventSource: state.employee.update.eventSource,
  created: state.employee.create.created,
  deleted: state.employee.del.deleted,
  updated: state.employee.update.updated
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  update: (item, values) => dispatch(update(item, values)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Update));
