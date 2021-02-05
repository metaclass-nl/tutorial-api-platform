Chapter 8: Authorization - React
================================

The environment is te same as in the chapter7-react branch, except:
- instructions from README.md of chapter7-react where applied
- instructions from README.md of chapter8-api where applied

This chapter adds Authorization: 
- Ordinary users should only be allowed to see and modify their own data*. 
- Administrators should be allowed to see and modify all data*. 
- Ordinary users are allowed to create and delete their Hours but not their Employee.
- Hours.start should be within last week unless the user is an Administrator.

This branch adapts the React client to this Authorization and to the
new relationship of Employee with User.


* Users can not be added/modified through the api.

Add current User info to Redux<a name="Redux"></a>
------------------------------
In order to adapt to the authorization the client needs to know
whether the user is an administrator. This information can be
obtained from the api by retrieving all users. Ordinary users
can only see themselves so if there are multiple users the user
must be an administrator. If there is one user its property
$admin tells whether it is an administrator.

Ordinary users usually can see only one Employee. For them it is
annoying to have to select that Employee every time they add
new Hours. Furthermore, for them the Employee select in the 
Hours Search form is superfluous. 

To solve this it would be handy to have the information easily accessible in Redux.
It can be retrieved immediately after a successful log in so under login.
The information only comes available after a successful login,
therefore client/src/actions/login.js should take care of it. In function
login below:
```javascript jsx
        dispatch(token(retrieved.token));
```
add the following function calls:
```javascript jsx
	discoverUserAdminRole(dispatch);
        discoverUserEmployee(dispatch);
```
And add the functions at the bottom of the file:
```javascript jsx
function discoverUserAdminRole(dispatch) {
  dispatch(admin(null));

  fetch("users")
    .then(response => response.json())
    .then(retrieved => {
      if (retrieved["hydra:totalItems"] === 1) {
        return dispatch(admin(retrieved['hydra:member'][0].admin));
      }
      dispatch(admin(retrieved["hydra:totalItems"] > 1));
    })
    .catch(e => {
      dispatch(error(e.message));
    });
}

function discoverUserEmployee(dispatch) {
  dispatch(employee(null));

  fetch("employees")
    .then(response => response.json())
    .then(retrieved => {
      if (retrieved["hydra:totalItems"] === 1) {
        dispatch(employee(retrieved['hydra:member'][0]));
      }
    })
    .catch(e => {
      dispatch(error(e.message));
    });
}
```

This requires two more functions to be added below `export function error`:
```javascript jsx
export function admin(isUserAdmin) {
  return { type: 'LOGIN_ADMIN', isUserAdmin };
}

export function employee(userEmployee) {
  return { type: 'LOGIN_EMPLOYEE', userEmployee };
}

```
These functions are exported because they may be needed elsewhere
to reset the corresponding data in redux if a user is logged out or
his/her token has expired. Currently there is no need for that
because the user can't do anything without a valid token.

Of course the dispatched messages need te be processed by corresponding reducers.
Add the following functions to client/src/reducers/login.js

```javascript jsx
export function isUserAdmin(state = null, action) {
  switch (action.type) {
    case 'LOGIN_ADMIN':
      return action.isUserAdmin;

    default:
      return state;
  }
}

export function userEmployee(state = null, action) {
  switch (action.type) {
    case 'LOGIN_EMPLOYEE':
      return action.userEmployee;

    default:
      return state;
  }
}

```

And include the functions in the combineReducers call:
```javascript jsx
export default combineReducers({ token, error, isUserAdmin, userEmployee });
```

Adaptations for Employee<a name="Employee"></a>
------------------------
An ordinary user can no longer create a new Employee, so the Create button in the employee List component
can be disabled or removed for ordinary users. Because these users can never use this button, disabling
would be less appropriate. To let it disappear wrap the Link to "create" by curly braces and braces 
and between the opening ones insert:
```javascript jsx
 this.props.isUserAdmin &&
```
This results in:
```javascript jsx
            {this.props.isUserAdmin && (
              <Link to="create" className="btn btn-primary">
                <FormattedMessage id="employee.create" defaultMessage="Create"/>
              </Link>
            )}
```

For this to work you need to map the login.isUserAdmin state to property isUserAdmin by
adding the following line above the return statement of the mapStateToProps (arrow) functon
and add the new constant to the object returned, resulting in:
```javascript jsx
  const {isUserAdmin} = state.login;
  return { retrieved, loading, error, eventSource, deletedItem, isUserAdmin };
```

To declare the new property add a comma and the following new line to the static propTypes object:
```javascript jsx
    isUserAdmin: PropTypes.bool
```
The property is not required because of the theoretical possibility that the user is not logged in.

You can now test that the Create button disappears when you log in as an ordinary user but
still shows up when you log in as an administrator.


The same holds for the Delete buttons at the bottom of the employee Show and Update components. 
You can make them disappear in the same way. Only the mapStateToProps function is a little different,
you can add in there a commma and the following line:
```javascript jsx
  isUserAdmin: state.login.isUserAdmin
```
Then test that the buttons disappear when you log in as an ordinary user but
still shows up when you log in as an administrator.

If the user is an administrator the employee Show component could now show the
user of the Employee. Right below tbody insert:
```javascript jsx
              {this.props.isUserAdmin && (
                <tr>
                  <th scope="row"><FormattedMessage id="employee.user" defaultMessage="user"/></th>
                  <td>
                    {item['user'].label}
                  </td>
                </tr>
              )}
```

This introduces a new message "employee.user" to be translated. Add the following
to client/src/messages/employee-en.js:
```javascript jsx
  "employee.user": "User",
```
And to client/src/messages/employee-nl.js:
```javascript jsx
    "employee.user": "Gebruiker",
```
You can now test that the user only shows up in the employee Show component 
if you are logged in as an administrator.

When the administrator creates or updates an Employee the Form should also include a
SelectEntity field. Insert it right below the line with form onSubmit:
```javascript jsx
        {this.props.isUserAdmin && (
          <Field
            component={this.renderField}
            name="user"
            label={<FormattedMessage id="employee.user" defaultMessage="user" />}
            placeholder=""
            required={true}
            widget={SelectEntity}
            labelProp="label"
            fetchUrl="users?pagination=false" 
            normalize={ v => v ? v : null } />
        )}
```
Don't forget to import the SelectEntity component:
```javascript jsx
import SelectEntity from "../common/SelectEntity";
```

This makes the form need this property too, so add to its static propTypes object a comma and:
```javascript jsx
isUserAdmin: PropTypes.bool
```

The property can not be mapped from Redux here because the form is not connected.
It needs to be passed by the employee Create and Update components
Add to the Form tag in the Update component:
```javascript jsx
            isUserAdmin={this.props.isUserAdmin}
```
And to the Form tag in the Create component:
```javascript jsx
 isUserAdmin={true}
```
Hey wait a minute, this would make all users admins in the Create component!
Well, they already should be: in the above you made the Create button disappear
for ordinary users. Of course any hackerisch user may try to enter the app trough
/employees/create so that the AuthController component will forward to it,
but removing that button was not a security measure, it was only because it is
not user friendly to offer the user functions that do not work.

You can now test that the user Select row only shows up in the employee Form component 
if you are logged in as an administrator.


Adaptations for Hours<a name="Hours"></a>
---------------------
Ordinary users can only see their own Employee. If the user has access to only 
one employee, it can be pre-selected in the hours Create component. To start at
the top, add a comma and the following line to the static propTypes object:
```javascript jsx
  userEmployee: PropTypes.object
```
In the render method insert the following above the return statement:
```javascript jsx
    if (this.props.userEmployee) {
      initialValues.employee = this.props.userEmployee["@id"];
    }
```
And in the mapStateToProps function add:
```javascript jsx
 const { userEmployee } = state.login;
```
Then add the constant to the object returned. This results in:
```javascript jsx
  return { created, error, loading, listQuery, userEmployee };
```
You can now test that if you are logged in as an ordinary
user the Employee is pre-selected in the hours Create component.

You don't need to do the same for the Update component, it
already knows the Employee to select from the Hours entity
it fetches from the api.

There also is an Employee select in the Hours Search Form.
However, for ordinary users the api already filters by their
Employee. The select therefore is only needed by administrators.

In the Search Form you can make it only being rendered for
administrators in the same way you did with the Create button 
in the employee List component:
```javascript jsx
{this.props.isUserAdmin && (
// the Field
)}
```
In the static propTypes object add a comma and:
```javascript jsx
  isUserAdmin: PropTypes.bool
```
Do the same in the hours SearchTool propTypes and add to the Form tag:
```javascript jsx
       isUserAdmin={this.props.isUserAdmin}
```
Also add the proptype to hours List and the above line to its SearchTool tag.
Finally add it to the mapStateToProps function the same way you did
for the employee Create component.

You can now test that the Employee select in the Hours Search Form
only shows up if you are logged in as an administrator.

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter9-react 
```
will compare your own version with code one of chapter9-react. You mau also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter9-api. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-api) 
and follow the instructions.
