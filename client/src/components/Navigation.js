import React from 'react';
import {Link} from "react-router-dom";

const NavLink = props => {
    let className = props.className === undefined ? "nav-item" : props.className;
    const slash2Pos = window.location.pathname.indexOf('/', 1);
    const basePath = slash2Pos === -1 ? window.location.pathname : window.location.pathname.substr(0, slash2Pos + 1);
    if (props.href === basePath) {
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
                        <NavLink href="/" content="Home"/>
                        <NavLink href="/employees/" content="Employees" />
                        <NavLink href="/hours/" content="Hours"/>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navigation;