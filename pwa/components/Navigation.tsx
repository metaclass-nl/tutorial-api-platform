import React, { FunctionComponent, ReactNode } from 'react';
import Link from "next/link";
import { withRouter, NextRouter } from 'next/router';

interface WithRouterProps {
  router: NextRouter
}

interface NavigationProps extends WithRouterProps {}

interface NavLinkProps {
  href: string,
  className?: string,
  basePath: string,
  title?: string,
  content: string
}

interface NavigationState {
  collapsed: boolean;
}

const NavLink: FunctionComponent<NavLinkProps> = props => {
  let className = props.className === undefined ? "block mt-4 mr-4 lg:inline-block lg:mt-0 hover:font-bold " : props.className;
  if (props.href === props.basePath) {
    className += " font-bold";
  }
  return (
      <Link href={props.href}  prefetch={false} className={className} title={props.title}>
        {props.content}
      </Link>
  );
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  toggleCollapsed(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    this.setState(prevState => ({
      collapsed: !prevState.collapsed
    }));
  }

  render(): ReactNode {
    let className = "w-full";
    className += this.state.collapsed ? " hidden" : " block";
    className += " flex-grow lg:flex lg:items-start lg:w-auto";

    const slash2Pos = this.props.router.pathname.indexOf('/', 5);
    const basePath = slash2Pos === -1 ? this.props.router.pathname : this.props.router.pathname.substr(0, slash2Pos + 1);
    return (
      <nav className="flex flex-wrap p-4">
        <div className="block lg:hidden">
          <button className="flex px-3 py-2 border rounded border-teal-400 hover:border-black" type="button"
                title="Toggle navigation"
                onClick={this.toggleCollapsed.bind(this)}>
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
        </div>
        <div className={className}>
            <NavLink href="/" content="Home" basePath={basePath} />
            <NavLink href="/employees" content="Employees" basePath={basePath} />
            <NavLink href="/hourss" content="Hours" basePath={basePath} />
        </div>
      </nav>
    );
  }
}

export default withRouter(Navigation);
