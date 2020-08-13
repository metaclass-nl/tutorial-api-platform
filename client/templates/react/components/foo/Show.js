import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/{{{lc}}}/show';
import { del } from '../../actions/{{{lc}}}/delete';
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
    if (window.confirm(intl.formatMessage({id:"{{{lc}}}.delete.confirm", defaultMessage:"Are you sure you want to delete this item?"})))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div>
        <h1><FormattedMessage id="{{{lc}}}.show" defaultMessage="Show {label}" values={ {label: item && item['@id']} }/></h1>

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
{{#each fields}}
              <tr>
                <th scope="row"><FormattedMessage id="{{{../lc}}}.{{{name}}}" defaultMessage="{{{name}}}"/></th>
                <td>{{#if reference}}<EntityLinks type="{{{reference.name}}}" items={item['{{{name}}}']} up={true} />{{else}}
                    {{#compare range "==" "http://www.w3.org/2001/XMLSchema#date" }}
                    <defined.FormattedDate value={item['{{{name}}}']} />
                    {{/compare}}
                    {{#compare range "==" "http://www.w3.org/2001/XMLSchema#time" }}
                    <defined.FormattedTime value={item['{{{name}}}']} />
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
              </tr>
{{/each}}
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          <FormattedMessage id="backToList" defaultMessage="Back to list" />
        </Link>
        {item && (
          <Link to={`/{{{name}}}/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.{{{lc}}}.show.retrieved,
  error: state.{{{lc}}}.show.error,
  loading: state.{{{lc}}}.show.loading,
  eventSource: state.{{{lc}}}.show.eventSource,
  deleteError: state.{{{lc}}}.del.error,
  deleteLoading: state.{{{lc}}}.del.loading,
  deleted: state.{{{lc}}}.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Show));
