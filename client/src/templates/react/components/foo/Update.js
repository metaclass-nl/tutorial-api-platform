import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { retrieve, update, reset } from '../../actions/{{{lc}}}/update';
import { del } from '../../actions/{{{lc}}}/delete';
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
    if (window.confirm(intl.formatMessage({id:"{{{lc}}}.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"}))) {
      this.deleting = true;
      this.props.del(this.props.retrieved);
    }
  };

  render() {
    // It happened that this.props.deleted was still set when user was returning after redirect
    if (this.deleting && this.props.deleted) return <Redirect to=".." />;

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="{{{lc}}}.update" defaultMessage="Edit {label}" values={ {label: item && item['@id']} }/></h1>

        {this.props.created && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="{{{lc}}}.created" defaultMessage="{label} created." values={ {label: this.props.created['@id']} } />
          </div>
        )}
        {this.props.updated && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="{{{lc}}}.updated" defaultMessage="{label} updated." values={ {label: this.props.updated['@id']} } />
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
  retrieved: state.{{{lc}}}.update.retrieved,
  retrieveError: state.{{{lc}}}.update.retrieveError,
  retrieveLoading: state.{{{lc}}}.update.retrieveLoading,
  updateError: state.{{{lc}}}.update.updateError,
  updateLoading: state.{{{lc}}}.update.updateLoading,
  deleteError: state.{{{lc}}}.del.error,
  deleteLoading: state.{{{lc}}}.del.loading,
  eventSource: state.{{{lc}}}.update.eventSource,
  created: state.{{{lc}}}.create.created,
  deleted: state.{{{lc}}}.del.deleted,
  updated: state.{{{lc}}}.update.updated
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  update: (item, values) => dispatch(update(item, values)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Update));
