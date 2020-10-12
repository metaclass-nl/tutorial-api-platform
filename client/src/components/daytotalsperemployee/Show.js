import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/daytotalsperemployee/show';
import { del } from '../../actions/daytotalsperemployee/delete';
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
    del: PropTypes.func.isRequired,
    listQuery: PropTypes.string
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    const {intl} = this.props;
    if (window.confirm(intl.formatMessage({id:"daytotalsperemployee.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"})))
      this.props.del(this.props.retrieved);
  };

  render() {
    const listUri = "../" + (this.props.listQuery ? this.props.listQuery : "");
    if (this.props.deleted) return <Redirect to={listUri} />;

    const item = this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="daytotalsperemployee.show" defaultMessage="Show {label}" values={ {label: item && item['label']} }/></h1>

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
                <th scope="row"><FormattedMessage id="daytotalsperemployee.employee" defaultMessage="employee"/></th>
                <td><EntityLinks type="employees" items={item['employee']} labelProp="label" up={true} /></td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.from" defaultMessage="from"/></th>
                <td>
                    <defined.FormattedDateTime value={item['from']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.label" defaultMessage="label"/></th>
                <td>
                    {item['label']}
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.to" defaultMessage="to"/></th>
                <td>
                    <defined.FormattedDateTime value={item['to']} />
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.count" defaultMessage="count"/></th>
                <td>
                    <defined.FormattedNumber value={item['count']}/>
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.total" defaultMessage="total"/></th>
                <td>
                    <defined.FormattedNumber value={item['total']}/>
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.onInvoice" defaultMessage="onInvoice"/></th>
                <td>
                    <defined.FormattedNumber value={item['onInvoice']}/>
                </td>
              </tr>
              <tr>
                <th scope="row"><FormattedMessage id="daytotalsperemployee.fractionBilled" defaultMessage="fractionBilled"/></th>
                <td>
                    <defined.FormattedNumber value={item['fractionBilled']}/>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to={listUri} className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list" />
        </Link>
        {item && (
          <Link to={`/day_totals_per_employees/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.daytotalsperemployee.show.retrieved,
  error: state.daytotalsperemployee.show.error,
  loading: state.daytotalsperemployee.show.loading,
  eventSource: state.daytotalsperemployee.show.eventSource,
  deleteError: state.daytotalsperemployee.del.error,
  deleteLoading: state.daytotalsperemployee.del.loading,
  deleted: state.daytotalsperemployee.del.deleted,
  listQuery: state.daytotalsperemployee.list.query
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Show));
