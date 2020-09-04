import React, { Component } from "react";
import PropTypes from "prop-types";
import {fetch} from "../../utils/dataAccess";
import {FormattedMessage} from "react-intl";

/**
 * Simple component for selecting entities from a dropdown
 * that shows their labels
 */
class SelectEntity extends Component {
  static propTypes = {
    fetchUrl: PropTypes.string,
    labelProp: PropTypes.string,
    error: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object
  };

  state = {};
  mounted = false;

  componentDidMount() {
    this.mounted = true;

    fetch(this.props.fetchUrl)
      .then(response => response.json())
      .then(retrieved => {
        if (this.mounted)
          this.setState({ entities: retrieved["hydra:member"] });
      })
      .catch(e => {
        if (this.mounted)
          this.setState({ error: e });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  optionsFromEntities() {
    if (this.state.entities === undefined) {
      return null;
    }

    const items = this.state.entities.map(item => (
      <option key={item["@id"]} value={item["@id"]}>{item[this.props.labelProp]}</option>
    ));
    if (!this.props.required || this.props.input.value === "") {
      items.unshift(<option key="" value=""></option>);
    }
    return items;
  }

  render() {
    if (this.state.error !== undefined) {
      return <div>{this.state.error.toString()}</div>;
    }
    if (this.state.entities === undefined) {
      return <div><FormattedMessage id="loading" defaultMessage="Loading..."/></div>;
    }
    return (
      <select
        {...this.props.input}
        required={this.props.required}
        id={this.props.meta.form + "_" + this.props.input.name}
      >
        {this.optionsFromEntities()}
      </select>
    );
  }
}

export default SelectEntity;
