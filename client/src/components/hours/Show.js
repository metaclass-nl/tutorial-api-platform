import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/hours/show';
import { del } from '../../actions/hours/delete';
import {FormattedMessage, injectIntl} from "react-intl";
import * as defined from '../common/intlDefined';
import EntityLinks from '../common/EntityLinks';

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
    del: PropTypes.func.isRequired
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

    const item = this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="hours.show" defaultMessage="Show {label}" values={ {label: item && item['@id']} }/></h1>

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
                <th scope="row"><FormattedMessage id="hours.nHours" defaultMessage="nHours"/></th>
                <td>
                    <defined.FormattedNumber value={item['nHours']}/>
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.start" defaultMessage="start"/></th>
                <td>
                    <defined.FormattedDateTime value={item['start']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.onInvoice" defaultMessage="onInvoice"/></th>
                <td>
                    <defined.LocalizedBool value={item['onInvoice']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.description" defaultMessage="description"/></th>
                <td>
                    {item['description']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.employee" defaultMessage="employee"/></th>
                <td><EntityLinks type="employees" items={item['employee']} up={true} /></td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.label" defaultMessage="label"/></th>
                <td>
                    {item['label']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="hours.day" defaultMessage="day"/></th>
                <td>
                    <defined.FormattedDate value={item['start']} weekday="short"/>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list" />
        </Link>
        {item && (
          <Link to={`/hours/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.hours.show.retrieved,
  error: state.hours.show.error,
  loading: state.hours.show.loading,
  eventSource: state.hours.show.eventSource,
  deleteError: state.hours.del.error,
  deleteLoading: state.hours.del.loading,
  deleted: state.hours.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Show));
