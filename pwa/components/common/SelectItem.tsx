import React, { Component } from "react";
import { fetch } from "../../utils/dataAccess";
import { FormattedMessage } from "react-intl";
import {PagedCollection} from "../../types/collection";
import {Item} from "../../types/item";

interface Props {
  fetchUrl: string;
  labelProp: string;
  required?: boolean;
  input: {
    value: string;
    placeholder?: string;
    name: string;
    required?: boolean;
  };
  meta?: {
    form: string
  };
}
interface State {
  items?: {[key: string]: any}[];
  error?: Error;
}

/**
 * Simple component for selecting items from a dropdown
 * that shows their labels
 */
class SelectItem extends Component<Props, {}> {
  state: State = {};
  mounted = false;

  componentDidMount() {
    this.mounted = true;

    // mounting happens only once per SelectItem per page so no need to useQuery for caching
    fetch<PagedCollection<Item>>(this.props.fetchUrl)
      .then((retrieved) => {
        if (!this.mounted) return; // unmounted before fetch completed

        if (retrieved===undefined) {
          this.setState( {error: new Error("Nothing retrieved")} );
          return;
        }
        const items = retrieved.data["hydra:member"];
        if (!Array.isArray(retrieved.data["hydra:member"])) {
          this.setState({error: new Error("retrieved unexpected "+ typeof items)} );
          return;
        }
        this.setState({ items });
      })
      .catch((e) => {
        if (this.mounted) this.setState({ error: e });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  optionsFromItems() {
    if (this.state.items === undefined) {
      return null;
    }

    const items = this.state.items.map((item) => (
      <option key={item["@id"]} value={item["@id"]}>
        {item[this.props.labelProp]}
      </option>
    ));
    if (!this.isRequired() || !this.props.input.value) {
      items.unshift(
        <option key="" value={undefined}>
          {this.props.input.placeholder}
        </option>
      );
    }
    return items;
  }

  isRequired() {
    return this.props.input.required  === undefined
      ? this.props.required
      : this.props.input.required;
  }

  render() {
    if (this.state.error !== undefined) {
      return <div>{this.state.error.toString()}</div>;
    }
    if (this.state.items === undefined) {
      return (
        <div>
          <FormattedMessage id="loading" defaultMessage="Loading..." />
        </div>
      );
    }
    const id = (this.props.meta ? +this.props.meta.form + "_" : "") +
      this.props.input.name;
    return (
      <select id={id} required={this.props.required} {...this.props.input} >
        {this.optionsFromItems()}
      </select>
    );
  }
}

export default SelectItem;
