import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";

const NavLink = props => {
  let className = props.className === undefined ? "nav-item" : props.className;
  if (props.href === props.basePath) {
    className += " active";
  }
  return (
    <li className={className}>
      <Link to={props.href} className="nav-link" title={props.title}>
        {props.content}
      </Link>
    </li>
  );
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  toggleCollapsed(e)
  {
    e.preventDefault();
    this.setState(prevState => ({
      collapsed: !prevState.collapsed
    }));
  }

  render() {
    const {intl} = this.props;
    let className = "collapse navbar-collapse";
    if (!this.state.collapsed) {
      className += " show";
    }
    const slash2Pos = this.props.location.pathname.indexOf('/', 5);
    const basePath = slash2Pos === -1 ? this.props.location.pathname : this.props.location.pathname.substr(0, slash2Pos + 1);
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-lightGrey">
        <div></div>
        <button className="navbar-toggler" type="button"
                title={ intl.formatMessage({id:"navigation.toggle", defaultMessage:"Toggle navigation"}) }
                onClick={this.toggleCollapsed.bind(this)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={className}>
          <ul className="navbar-nav mr-auto">
            <NavLink href="/" content={<FormattedMessage id="navigation.home" defaultMessage="Home"/>} basePath={basePath} />
            <NavLink href="/employees/" content={<FormattedMessage id="navigation.employees" defaultMessage="Employees"/>} basePath={basePath} />
            <NavLink href="/hours/" content={<FormattedMessage id="navigation.hours" defaultMessage="Hours"/>} basePath={basePath} />
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(injectIntl(Navigation));
