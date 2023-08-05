Chapter 2: Hours registration
=============================

The environment is te same as in the chapter1-react branche, except:
- instructions from README.md of chapter1-react where applied.
- changes from chapter2-api are included
- the templates folder was added. It is not used in this chapter but will
  serve as a reference to compare with in chapter 3 react.

This chapter adds the user interface an entity class Hours that has an n to 1 relation with Employee
and adds a menu.

Hours<a name="Hours"></a>
-----
To scaffold (generate code) files for the client for the new Employee class, you can 
type at the command prompt: 

```shell
docker compose exec client generate-api-platform-client --generator react
```

This will execute an outdated version of the client generator which is more compatible with
this version of the tutorial. If you want to use the newest version change
"@api-platform/client-generator": "^0.7.3", in package.json to "@api-platform/create-client": "^0.10.0",
and type at the command prompt:
```shell
docker compose exec client npm upgrade
docker compose exec client node_modules/.bin/create-client --generator react http://caddy ./src
```

Please take a look at at least one of the action files and one of the reducer files
to get an idea of what it does.

And under client/src/components/hours:
- Create.js
- Form.js
- index.js
- List.js
- Show.js
- Update.js

Please take a look at each of these files to see the React components 
that where generated. 

This generates the following files under client/src/actions/employee and 
client/src/reducers/hours:
- create.js
- delete.js
- list.js
- show.js
- update.js


To call upon the generated code edit client/src/index.js. Below
```javascript
import Welcome from './Welcome'; 
```

add the following lines:

```javascript
import hours from './reducers/hours/';
import hoursRoutes from './routes/hours';
```

Below /* Add your reducers here */
add the following line:
```javascript
    hours,
```

Below {/* Add your routes here */}
add the following line:
```javascript
        {hoursRoutes}
```

Tot test it point your browser at https://localhost/hours/
(including the last slash!)

The table that is scaffolded for the list of hours holds a column
for each property of Hours. This was done because the scaffolding script
has no way to know what properties are important and which ones can be left out. 
In client/src/components/hours/List.js below  
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
Columns onInvoice and label can be removed.  

This will result in the following:
[Hours list](resources/Hours.png)

Menu<a name="Menu"></a>
----

Views have been generated for hours and for employees, but no way to navigate beween them. 
So let's add a navigation bar. Create a file Navigation.js in the components folder and 
paste the following:
```javascript jsx
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
```

This component contains a hardcoded menu and a sub component NavLink that displays a link, 
adding a style "active" if its link starts with the content of its basePath property. 
The value of this property is provided by the main component whose render method calculates
it from its location property which is injectend by the withRouter call at the export statement.

The navigation bar does not support pulldown menu's. If you like to use a 
pull down menu or other dynamic features of bootstrap consider using
[React Bootstrap](https://react-bootstrap.github.io/).

To activate the navigation bar import it into index.js above 
// Import your reducers and routes here:
```javascript jsx
import Navigation from './components/Navigation.js';
// Import your reducers and routes here
```

Then modify the ReactDOM.render call: 
```javascript jsx
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Navigation/>
                <div className="mainContainer">
                    <Switch>
                        <Route path="/" component={Welcome} strict={true} exact={true}/>
                        {/* Add your routes here */}
                        {employeeRoutes}
                        {hoursRoutes}
                        <Route render={() => <h1>Not Found</h1>} />
                    </Switch>
                </div>
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
```
Notice that the navigation is inside the ConnectedRouter component so that it will work 
with the router. An extra div had to be added around it because 
the  ConnectedRouter component can only house one element. 

Notice that another div was added to wrap around the Switch component.
It allows to specify styles for it in a a css stylesheet. 

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff origin/chapter3-react 
```
will compare your own version with code one of chapter3-react. You may also add the path
to a folder of file to make the diff more specific. There may also be differences because the
client generator is under development and you may have used a newer version then the
one used when the tutorial was made.

After committing your changes check out branch chapter3-api. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-api) 
and follow the instructions.
