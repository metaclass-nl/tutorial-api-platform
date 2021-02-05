import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset, query } from '../../actions/daytotalsperemployee/list';
import {FormattedMessage} from "react-intl";
import * as defined from '../common/intlDefined';
import EntityLinks from '../common/EntityLinks';
import Pagination from "../common/Pagination";
import {buildQuery} from "../../utils/dataAccess";
import ListTool from "../common/ListTool";
import ThSort from "../common/ThSort";


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

  values = {};

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  /**
   * Call Back for ListTool or SearchTool
   * @param {} values
   * @param string apiQuery
   */
  list(values, apiQuery) {
    this.values = values;
    this.props.query(this.props.location.search);
    this.props.list("day_totals_per_employees?" + apiQuery);
  }

  /**
   * Call back for pagination buttons
   * @param string page (numeric)
   */
  page(page) {
    this.values.page = page;
    this.props.history.push("?" + buildQuery(this.values));
  }

  /**
   * Call back for sort headers
   * @param {} order
   */
  order(order) {
    this.values.order = order;
    this.props.history.push("?" + buildQuery(this.values));
  }

  render() {
    return (
      <div>
        <h1><FormattedMessage id="daytotalsperemployee.list" defaultMessage="DayTotalsPerEmployee List"/></h1>

        {this.props.loading && (
          <div className="alert alert-info"><FormattedMessage id="loading" defaultMessage="Loading..."/></div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            <FormattedMessage id="daytotalsperemployee.deleted" defaultMessage="{label} deleted" values={ {label: this.props.deletedItem['label']} }/>
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <div className="toolbar">
          <ListTool
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
              <th><FormattedMessage id="daytotalsperemployee.item" default="DayTotalsPerEmployee"/></th>
              <th>
                <FormattedMessage id="daytotalsperemployee.employee" defaultMessage="employee"/>
            </th>
              <ThSort orderBy={ {"from": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.from" defaultMessage="from"/>
            </ThSort>
              <ThSort orderBy={ {"label": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.label" defaultMessage="label"/>
            </ThSort>
              <ThSort orderBy={ {"to": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.to" defaultMessage="to"/>
            </ThSort>
              <ThSort orderBy={ {"count": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.count" defaultMessage="count"/>
            </ThSort>
              <ThSort orderBy={ {"total": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.total" defaultMessage="total"/>
            </ThSort>
              <ThSort orderBy={ {"onInvoice": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.onInvoice" defaultMessage="onInvoice"/>
            </ThSort>
              <ThSort orderBy={ {"fractionBilled": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="daytotalsperemployee.fractionBilled" defaultMessage="fractionBilled"/>
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
                      {item['label']}
                    </Link>
                  </th>
                  <td><EntityLinks type="employees" items={item['employee']} labelProp="label" /></td>
                  <td>
                  <defined.FormattedDateTime value={item['from']} />
                  </td>
                  <td>
                  {item['label']}
                  </td>
                  <td>
                  <defined.FormattedDateTime value={item['to']} />
                  </td>
                  <td>
                  <defined.FormattedNumber value={item['count']}/>
                  </td>
                  <td>
                  <defined.FormattedNumber value={item['total']}/>
                  </td>
                  <td>
                  <defined.FormattedNumber value={item['onInvoice']}/>
                  </td>
                  <td>
                  <defined.FormattedNumber value={item['fractionBilled']}/>
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
    eventSource,
    deletedItem
  } = state.daytotalsperemployee.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource)),
  query: queryString => dispatch(query(queryString))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
