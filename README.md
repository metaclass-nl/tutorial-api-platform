Chapter 2: Hours registration - Next.js client
==============================================

The environment is the same as in the chapter1-next branche, except:
- instructions from README.md of chapter1-next where applied
- instructions from README.md of chapter2-api where applied

This chapter adds the user interface for an entity class Hours that has an n to 1 relation with Employee
and adds a menu.

Hours<a name="Hours"></a>
-----
To scaffold (generate code) files for the client for the new Employee class, you can
type at the command prompt:

```shell
docker compose exec pwa pnpm create @api-platform/client -g next
```

You will see the files that are generated are similar to those that where in chapter 1,
but the pages are in pwa/pages/hourss. This is wrong, rename the folder to hours.
Then you can try the client out at https://localhost/hours.

Menu<a name="Menu"></a>
----
Views have been generated for hours and for employees, but no way to navigate beween them.
So let's add a navigation bar. Create a file Navigation.tsx in the components folder and
paste the following:
```javascript tsx
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
  let className = props.className === undefined ? "nav-item" : props.className;
  if (props.href === props.basePath) {
    className += " active";
  }
  return (
    <li className={className}>
      <Link href={props.href}  prefetch={false}>
        <a className="nav-link" title={props.title}>
          {props.content}
        </a>
      </Link>
    </li>
  );
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  toggleCollapsed(e): void
  {
    e.preventDefault();
    this.setState(prevState => ({
      collapsed: !prevState.collapsed
    }));
  }

  render(): ReactNode {
    let className = "collapse navbar-collapse";
    if (!this.state.collapsed) {
      className += " show";
    }
    const slash2Pos = this.props.router.pathname.indexOf('/', 5);
    const basePath = slash2Pos === -1 ? this.props.router.pathname : this.props.router.pathname.substr(0, slash2Pos + 1);
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
```

This component contains a hardcoded menu and a sub component NavLink that displays a link,
adding a style "active" if its link starts with the content of its basePath property.
The value of this property is provided by the main component whose render method calculates
it from its location property which is injectend by the withRouter call at the export statement.

The navigation bar does not support pulldown menu's. If you like to use a
pull down menu or other dynamic features of bootstrap consider using
[React Bootstrap](https://react-bootstrap.github.io/).

To activate the navigation bar import it into pages/index.tsx:
```javascript tsx
import Navigation from "../components/Navigation";
```

Then modify the Welcome function:
```javascript tsx
const Welcome = () => (
  <div className="welcome">
    <Head>
      <title>Tutorial API Platform</title>
    </Head>
    <Navigation/>
// ...
```

You should now be able to see and use the menu at [https://localhost/](https://localhost/).

Notice that the navigation is not added to pwa/pages/_app.tsx but to the specific page.
This allows us to make the import of translation messages in chapter 3 (Internationalization) specific to each page,
allowing your app to grow big without slowing its loading down by reading all translation messages of the entire app.

Dowside is that we have to add `<Navigation/>` and its import to every List page (Please do so, or ignore
us having done so in the diff you make at the end of the chapter).

Checking types
--------------
The app should work in the development environment, but when
you try to compile it with
After running
```shell
docker compose exec pwa pnpm next build
```
You will get an error message like:
```
Failed to compile.

./components/employee/Form.tsx:214:17
Type error: Type 'string | Date' is not assignable to type 'string | number | readonly string[]'.
  Type 'Date' is not assignable to type 'string | number | readonly string[]'.
    Type 'Date' is not assignable to type 'number'.

  212 |                 name="birthDate"
  213 |                 id="_birthDate"
> 214 |                 value={values.birthDate ?? ""}
      |                 ^
  215 |                 type="text"
  216 |                 placeholder="Date of birth"
  217 |                 className={`form-control${
error Command failed with exit code 1.
```

It looks like the generated type Employee is not compatible with the form:
```javascript ts
export class Employee {
  public "@id"?: string;

  constructor(
    _id?: string,
    public firstName?: string,
    public lastName?: string,
    public job?: string,
    public address?: string,
    public zipcode?: string,
    public city?: string,
    public birthDate?: Date,
    public arrival?: Date,
    public label?: string
  ) {
    this["@id"] = _id;
  }
}
```

The actual employee that is passed to the form is obtained in Page.getInitialProps in
pwa/pages/employees/[id]/edit.tsx:
```javascript tsx
  const employee = await fetch(asPath.replace("/edit", ""));
```

The fetch funtion is imported from pwa/utils/dataAccess.ts. It uses isomorphicFetch
to obtain a json from the api and decodes and normalizes it. The api returns dates, times and
datetimes as strings so .json() does not create any instances of Date, it simply passes birthDate and arrival as strings.
And normalize() doesn't either so the error is in the typing.

Replace both Date typings in pwa/types/Employee.ts by string
and try:
```shell
docker compose exec pwa pnpm next build
```

You will get an other error:
```
Failed to compile.

./components/hours/Form.tsx:101:17
Type error: Type 'string | Date' is not assignable to type 'string | number | readonly string[]'.
  Type 'Date' is not assignable to type 'string | number | readonly string[]'.
    Type 'Date' is not assignable to type 'number'.

   99 |                 name="start"
  100 |                 id="_start"
> 101 |                 value={values.start ?? ""}
      |                 ^
  102 |                 type="text"
  103 |                 placeholder=""
  104 |                 className={`form-control${
error Command failed with exit code 1.
```

Of course the generator has made the same mistake in pwa/types/Hours.ts. Replace that
Date typing as well and try again:
```shell
docker compose exec pwa pnpm next build
```

This time the error will be:

```
Failed to compile.

./components/hours/Form.tsx:124:17
Type error: Type 'string | boolean' is not assignable to type 'string | number | readonly string[]'.
  Type 'boolean' is not assignable to type 'string | number | readonly string[]'.

  122 |                 name="onInvoice"
  123 |                 id="_onInvoice"
> 124 |                 value={values.onInvoice ?? ""}
      |                 ^
  125 |                 type="text"
  126 |                 placeholder=""
  127 |                 className={`form-control${
error Command failed with exit code 1.
```

Here the error seems to be in the form: json decoding may result in onInvoice to be a boolean,
so the typing is correct. You may correct it but the chapter 3 deals with localization
and will correct this type problem anyway so in the initial code of chapter 3 it was not corrected.

BTW, after compiling the development environment may produce an error if you try to visit a page.
If you stop and restart docker compose the error should disappear.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter3-next 
```
will compare your own version with code one of chapter3-next. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter3-api.
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-api)
and follow the instructions.
