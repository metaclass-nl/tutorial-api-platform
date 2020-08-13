import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { retrieve, update, reset } from '../../actions/hours/update';
import { del } from '../../actions/hours/delete';
import {FormattedMessage, injectIntl} from "react-intl";
import * as defined from '../common/intlDefined';

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
    if (window.confirm(intl.formatMessage({id:"hours.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"})))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage
          id="hours.update"
          defaultMessage="Edit {start} {description}"
          values={ {start: <defined.FormattedDateTime value={item && item['start']} />, description: item && item['description']} }
        /></h1>

        {this.props.created && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="hours.created" defaultMessage="{label} created." values={ {label: this.props.created['@id']} } />
          </div>
        )}
        {this.props.updated && (
          <div className="alert alert-success" role="status">
            <FormattedMessage id="hours.updated" defaultMessage="{label} updated." values={ {label: this.props.updated['@id']} } />
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
  retrieved: state.hours.update.retrieved,
  retrieveError: state.hours.update.retrieveError,
  retrieveLoading: state.hours.update.retrieveLoading,
  updateError: state.hours.update.updateError,
  updateLoading: state.hours.update.updateLoading,
  deleteError: state.hours.del.error,
  deleteLoading: state.hours.del.loading,
  eventSource: state.hours.update.eventSource,
  created: state.hours.create.created,
  deleted: state.hours.del.deleted,
  updated: state.hours.update.updated
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  update: (item, values) => dispatch(update(item, values)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Update));
