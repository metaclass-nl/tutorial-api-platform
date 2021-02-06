import React from 'react';
import {Link, withRouter} from "react-router-dom";

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
                title="Toggle navigation"
                onClick={this.toggleCollapsed.bind(this)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={className}>
          <ul className="navbar-nav mr-auto">
            <NavLink href="/" content="Home" basePath={basePath} />
            <NavLink href="/employees/" content="Employees" basePath={basePath} />
            <NavLink href="/hours/" content="Hours" basePath={basePath} />
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navigation);
