import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/{{{lc}}}/list';
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
        <h1><FormattedMessage id="{{{lc}}}.list" defaultMessage="{{{title}}} List"/></h1>

        {this.props.loading && (
          <div className="alert alert-info"><FormattedMessage id="loading" defaultMessage="Loading..."/></div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            <FormattedMessage id="{{{lc}}}.deleted" defaultMessage="{label} deleted" values={ {label: this.props.deletedItem['@id']} }/>
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link to="create" className="btn btn-primary">
            <FormattedMessage id="{{{lc}}}.create" defaultMessage="Create"/>
          </Link>
        </p>

        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
{{#each fields}}
              <th><FormattedMessage id="{{{../lc}}}.{{{name}}}" defaultMessage="{{{name}}}"/></th>
{{/each}}
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
{{#each fields}}
                  <td>{{#if reference}}<EntityLinks type="{{{reference.name}}}" items={item['{{{name}}}']} />{{else}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#date" }}
                  <defined.FormattedLocalDate value={item['{{{name}}}']} />
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#time" }}
                  <defined.FormattedLocalTime value={item['{{{name}}}']} />
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#dateTime" }}
                  <defined.FormattedDateTime value={item['{{{name}}}']} />
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#boolean" }}
                  <defined.LocalizedBool value={item['{{{name}}}']} />
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#integer" }}
                  <defined.FormattedNumber value={item['{{{name}}}']}/>
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#decimal" }}
                  <defined.FormattedNumber value={item['{{{name}}}']}/>
                  {{/compare}}
                  {{#compare range "==" "http://www.w3.org/2001/XMLSchema#string" }}
                  {item['{{{name}}}']}
                  {{/compare}}
                  {{#compare range "==" "http://schema.org/name" }}
                  {item['{{{name}}}']}
                  {{/compare}}
                  {{/if}}</td>
{{/each}}
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
  } = state.{{{lc}}}.list;
  const deletedItem = state.{{{lc}}}.del.deleted;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
