Chapter 7: Authentication - React
=================================

The environment is te same as in the chapter6-react branche, except:
- instructions from README.md of chapter6-react where applied
- instructions from README.md of chapter7-api where applied

This chapter adds JWT authentication

Login Form<a name="Login"></a>
----------

In chapter8-api a route was declared for /auth.
It expects a POST with a body like
```json
{"email":"d.peters@leiden.nl","password":"d.peters_password"}
```
and will return a response like:
```json
{"token":"the actual token"}
```

So the user needs a form with two text inputs: email and password
and a submit button. The token will be needed by other components,
so it would be convenient if it where stored in redux.

To create the form add a file client/src/components/common/Login.js
with the following content:

```javascript jsx
import React from 'react';
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { login, error } from '../../actions/login';


class Login extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    token: PropTypes.string,
    error: PropTypes.string
  };

  loading = false;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  componentDidUpdate() {
    if (this.loading && !this.props.error) {
      if (this.props.location.state && this.props.location.state.back === true)
        this.props.history.goBack();
      else
        this.props.history.push("/");
    }

    this.loading = false;
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  handleChanged(e) {
    this.props.clearError();
    const values = {...this.state};
    values[e.target.name] = e.target.value;
    this.setState(values);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.props.login(this.state);
  }

  render() {
    return (
      <div>
        <h1><FormattedMessage id="login.title" defaultMessage="Please log in" /></h1>
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error === "Unauthorized"
              ? <FormattedMessage id="login.error.unauthorized" defaultMessage="Unauthorized" />
              : this.props.error}
          </div>
        )}

        <form className="login" onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="login_email" className="form-control-label">
              <FormattedMessage id="login.email" defaultMessage="Email" />
            </label>
            <input type="text" name="email" value={this.state.email} id="login_email" onChange={this.handleChanged.bind(this)} required={true}/>
          </div>
          <div className="form-group">
            <label htmlFor="login_password" className="form-control-label">
              <FormattedMessage id="login.password" defaultMessage="Password" />
            </label>
            <input type="password" name="password" value={this.state.password} id="login_password" onChange={this.handleChanged.bind(this)} required={true}/>
          </div>
          <button type="submit" className="btn btn-success">
            <FormattedMessage id="login.submit" defaultMessage="Submit"/>
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { token, error } = state.login;
  return { token, error };
};

const mapDispatchToProps = dispatch => ({
  login: (values) => dispatch(login(values)),
  clearError: ignoored => dispatch(error(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


```
As you can see quite a common Redux-connected class. It receives
token and error props from redux. It also needs the history to send the user back to the previous page
when login has succeeded and the location state indicates so, or otherwise to the home page.

However, the form itself is not connect through Redux Forms. Instead the form keeps
the value of the two inputs in its internal state. Furthermore it keeps track of
its loading status in a property. Both where done because there is no need for other
components to share this data and with respect to the loading property, it does not
need to trigger rendering. This does make the form a little more complicated but
it eliminates a seperate connected form component and simplifies the actions in client/src/actions/login.js:
```javascript jsx
import {fetch} from "../utils/dataAccess";

export function token(token) {
  return { type: 'LOGIN_TOKEN', token };
}

export function error(error) {
  return { type: 'LOGIN_ERROR', error };
}

export function login(credentials) {
  return dispatch => {
    dispatch(error(null));

    fetch("auth", {method: 'POST', body: JSON.stringify(credentials)})
      .then(response => response.json())
      .then(retrieved => {
        dispatch(token(retrieved.token));
      })
      .catch(e => {
        dispatch(error(e.message));
      });
  }
}

export function forgetToken() {
  return token(null);
}
```

And the reducers in client/src/reducers/login.js:
```javascript jsx
import { combineReducers } from 'redux';

export function token(state = null, action) {
  switch (action.type) {
    case 'LOGIN_TOKEN':
      return action.token;

    default:
      return state;
  }
}

export function error(state = null, action) {
  switch (action.type) {
    case 'LOGIN_ERROR':
      return action.error

    default:
      return state;
  }
}

export default combineReducers({ token, error });
```

Of course the login form needs a route too:
```javascript jsx
import AuthController from './components/common/AuthController';
```
and in client/src/index.js below {/* Add your routes here */}:
```javascript jsx
                            <Route path="/login/" component={Login} strict={true} exact={true}/>
```
This Route component passes the history prop that is required by the Login class.

And message translations. Add the following to client/src/messages/common-en.js:
```javascript jsx
    "login.title": "Please log in",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Log in",
    "login.error.unauthorized": "Log in has failed"
```
Don´t forget to add a comma behind the line above.
Add the following to client/src/messages/common-nl.js:
```javascript jsx
    "login.title": "Log in",
    "login.email": "Email",
    "login.password": "Wachtwoord",
    "login.submit": "Inloggen",
    "login.error.unauthorized": "Inloggen mislukt"
```
And once again the comma.

You can now test the login form by pointing your browser to https://localhost/login/
If you submit the wrong credentials you should see the message "Log in has failed".
If you log in sucessfully you may find yourself back on the page you where before,
you typed https://localhost/login/, or if you openend a new window or tab, still
on the log in page.

Extending the dataAccess utility<a name="dataAccess"></a>
--------------------------------

Once a token is available it must be included in each request the app sends to the api.
This would be easy if client/src/utils/dataAccess.js where a react comonent that could
be connected to Redux. But it isn't. Furthermore if the token has become invalid the
api will return a response with http status 401. If dataAccess where connected to
redux it could dispatch a message with respect to the error, but it can't.

One solution would be to replace the dataAccess utility by a React component,
but that would require all actions and components code that performs a fetch to be adapted.
Furthermore, the new DataAccess component would have to be made available to all other components,
for example by a Higher Order Component or so and that is beyond the scope of this turorial.

Another solution could be to pass the token explicitly to the dataAccess fetch function
and handle the 401 errors from the actions by dispatching a message with respect to the error.
But that would also require all actions and components code that performs a fetch to be adapted
even more because of the error handling.

A less conventional solution would be to make the dataAccess module behave like an object.
IOW set an internal state and use that state from the fetch function. The former can be done
by adding the following to client/src/utils/dataAccess.js:
```javascript jsx
let token = null;
const errorHandlers = [];

/**
 * @param string|null newToken JWT token
 */
export function setToken(newToken) {
  token = newToken;
}

/**
 * @param function handler
 */
export function onFetchError(handler) {
  errorHandlers.push(handler);
}
```
This adds two "properties" to the module, one to store the token and another to
store error handlers for fetch errors. It also adds two functions, one
for setting the token, the other for adding an error handler.

To actually use the token during fetch add the following on the second line
of the fetch function:
```javascript jsx
  if (token)
    options.headers.set('Authorization', 'Bearer ' + token);
```

And to call the error handlers below:
```javascript jsx
    return response.json().then(
      (json) => {
```
add:
```javascript jsx
      errorHandlers.forEach(handler => handler(response.status, json, id, options));
```

SECURITY WARNNIG: Be aware that the token is sent with ALL fetch calls made
with the dataAccess utility. Normally this is no problem because the fetch function
only makes calls to the same hard-coded entry point, but if the entrypoint offers access
to multiple applications the token may be sent to the wrong application.
DO NOT make the entrypoint variable!


Authentication Controller<a name="Controller"></a>
-------------------------

OK, there is a login form that sets a token into Redux, the dataAccess utility
can use the token and can call error handlers on fetch errors. Now it all needs
to be combined so that whenever something happens that is relevant to the
authentication, the proper actions are taken. Typically a task for a Controller.

Create a new file client/src/components/common/AuthController.js with the
following content:
```javascript jsx
import React from 'react';
import { connect } from 'react-redux';
import {onFetchError, setToken} from "../../utils/dataAccess";
import PropTypes from 'prop-types';
import {forgetToken} from "../../actions/login";
import { withRouter } from 'react-router-dom';

/** Forwards the user to the login page if unauthenticated */
class AuthController extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    loginPath: PropTypes.string,
    token: PropTypes.string,
    location: PropTypes.object
  };

  componentDidMount() {
    onFetchError(this.handleFetchError.bind(this));
    this.processProps();
  }

  componentDidUpdate() {
    this.processProps();
  }

  handleFetchError(status, json) {
    // alert('Fetch error' + status + ': ' + JSON.stringify(json))

    // forget the token if it is rejected
    if (status === 401 && json.message !== "Invalid credentials.")
      this.props.forgetToken();
  }

  processProps() {
    const {loginPath = "/login/"} = this.props;

    // update token of dataAccess
    setToken(this.props.token);

    // Do not forward twice
    if (this.props.location.pathname === loginPath) return;

    // If we have a token the user is authenticated, otherwise forward to login
    if (!this.props.token)
      this.props.history.push(loginPath, {back: true});

  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => {
  const { token } = state.login;
  const {location} = state.router;
  return { token, location };
};

const mapDispatchToProps = dispatch => ({
  forgetToken: ignoored => dispatch(forgetToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthController));
```
This component receives the token from redux so that it can detect if
a JWT token is available. It allways set the token on the dataAccess module
so that the module it allways up to date.

If no token, it pushes "/login/" onto the history unless the current location
pathname already is "/login/". With login state {back: true} is passed to indicate
that the login form should move the browser back in history after a successfull login.

As soon as possible it registers an error handler with the dataAccess module.
If an error with status 401 occurs it calls the forgetToken action, unless
the error is "Invalid credentials.", that is just to be handled by the login form.

To import the AuthController add the following to client/src/index.js:
```javascript jsx
import AuthController from './components/common/AuthController';
```
And below ConnectedRouter add
```javascript jsx
              <AuthController>
```
and add a corrsponding </AuthController> above </ConnectedRouter>.

You can now test the app. After succussfully logging in
you should be retured to the page you requested. For example if you
started with https://localhost/employees/ that should be the page
you see after logging in successfully.

Of couse everything should work normally once logged in.
If you start with https://localhost/login/ you should see the
Welcome page after logging in.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter8-react 
```
will compare your own version with code one of chapter8-react. You mau also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter8-api.
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-api)
and follow the instructions.
