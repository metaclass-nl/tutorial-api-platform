Chapter 5: Search - React client
================================

The environment is te same as in the chapter4-react branche, except:
- instructions from README.md of chapter4-react where applied
- instructions from README.md of chapter5-api where applied

This chapter adds a search form for simply searching for Hours
with fields that contain or are equal to the values in the form.


Search Form<a name="SearchForm"></a>
-----------
The application already contains a Form for editing Hours that
does serveral things that would be nice for the search form too:
- localization of numbers and datetimes,
- selection of an Employee from a list.
But the search form should not be entirely the same as the edit form:
- the 'onInvoice' field should allow the user NOT to search by the value of onInvoice,
  but the checkbox only suppors two values: checked and not checked. To keep things
  simple the onInvoice field should be left out,
- the 'start' field requires the user to enter an exact date and time, but it is
  unlikely that the user knows both by head. To make it more usefull the start
  field should only require a date to search for all Hours that start on that date
- a field for employee.function should be added
- Redux Form should know the form under a different name so that it keeps a separate state 

As requirements change in the future the search form may be expected to change and divert
more and more from the edit form. It therefore is OK to simply copy the code from
client/src/components/hours/Form.js to a new file client/src/components/hours/SearchForm.js.
Once you have done this you need to change the class name to SearchForm:
```javascript jsx
class SearchForm extends Component {
```
Also adapt the export statement:
```javascript jsx
export default reduxForm({
  form: 'search_hours',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(SearchForm);
```
Notice that the form property was also changed. This allows Redux Forms to store the values from both forms
seperately in Redux so that values entered in one form will not mess up the values in the other form.

To allow different css styles for the form give it class name "search":
```javascript jsx
      <form className="search" onSubmit={this.props.handleSubmit}>
```
You remove the onInvoice field and reorder the other fields in the folowing order:
employee, description, start, nHours.

To make the start field a date field in stead of datetime-local, change its type to "date" and
replace the formatting and normalizing functions by their date counterparts.

To support searching by the function of the related employee, add the following field:
```javascript jsx
        <Field
          component={this.renderField}
          name="employee.function"
          type="text"
          label=<FormattedMessage id="employee.function" defaultMessage="function" />
          placeholder=""
          />
```
But this introduces a problem: if a value is present in employee.function, 
this results in a nested object to be the value of employee, but employee
already may have a string value from the employee select. This can be solved
by renaming the employee select to employee.id:
```javascript jsx
        <Field
          component={this.renderField}
          name="employee.id"
```
This way both employee.id and employee.function will be put together in the nested
object in employee.

At te bottom of the form in the reduxForm call change the value of form:
```javascript jsx
export default reduxForm({
  form: 'hours_search',
```

Browsing history and query string utilities<a name="History"></a>
-------------------------------------------

The current Hours List component renders Pagination buttons. When the user presses
one of these buttons a new uri is added to the browsing history so that the user
can go back to previously browsed pages. The uris contain an url-encode parameter
holding the query string for the api. These query strings are provided by the api
in the result of GET /hours:
```application/ld+json
"hydra:view": {
    "@id": "/hours?page=1",
    "@type": "hydra:PartialCollectionView",
    "hydra:first": "/hours?page=1",
    "hydra:last": "/hours?page=3",
    "hydra:next": "/hours?page=2"
  },
```

All the List component has to do is decode the parameter and send the result to
the api. If filters are used, the api even includes them in the uris it provides.
For example the result of GET hours?description=e includes:
```application/ld+json
"hydra:view": {
    "@id": "/hours?description=e&page=1",
    "@type": "hydra:PartialCollectionView",
    "hydra:first": "/hours?description=e&page=1",
    "hydra:last": "/hours?description=e&page=3",
    "hydra:next": "/hours?description=e&page=2"
  },
```
This seems convenient: the pagination buttons will keep working for any search
that the api can understand. But there is a snack: When the user presses the back button
the Search form will no longer be in sync with the actual search sent to the api! 
In order to restore WYSIWYG the search form will have to be updated with the values of the parameters
from the uri that is meant for the api. And when the user enters or changes a value
in the search form, a new uri has to be generated from the values from the form.

As long as the form values are one on one with these parameters this is quite simple. 
But for the Hours search they are not: the date in the form for example has to be 
transformed to two parameters: 'start[after]' and 'start[before]'. There are two more 
parameters that need to be transformed or adapted. Because this has to work both ways,
from the form to the uri and from the uri back to the form, it is simpeler to
forget about the pagination buttons for now and have our own form values converted one
to one to our own query string and back, and put those in the history. 

Decoupling the uris (including the query strings and parameters) used by the application from 
those of the api has an other advantage: if one changes the other may stay the same and vice versa.
With the api separating back-end from front-end one may forget that multi tier architecture was also a good practice
in previous era's. But in those times the separation was primarily a matter of logical decoupling.
And that is exactly what this is. IOW, it's good architectural practice.

For the one on one convertions generic utility functions can be used. Add the following to
client/src/utils/dataAccess.js:
```javascript jsx
/**
 * Build a query string portion for an url from a plain object.
 * The object may be nested.
 * Any value typeof "object" except null will be handled as a nested object.
 * (values like new String("String) or new Number(12) will not be handled correctly)
 * @param values Plain Object
 * @param prefix string
 * @returns string
 */
export function buildQuery(values, prefix) {
  let query = "";
  for (let key in values) {
    const value = values[key];
    if (value) {
      const param = prefix ? prefix + "[" + key + "]" : key;
      query += value !== null && typeof value === 'object'
        ? buildQuery(value, param)
        : "&" + param + "=" + encodeURIComponent(value);
    }
  }
  return query;
}

/**
 * Parses query string portion from uri
 * @param queryOrUri string with max 1 level of nesting
 * @returns Plain Object
 */
export function parseQuery(queryOrUri) {
  const pathAndQuery = queryOrUri.split("?");
  const params = new URLSearchParams(
    pathAndQuery.length === 1 ? pathAndQuery[0] : pathAndQuery[1]
  );
  const values = {};
  for (let [key, value] of params) {
    if (!key) continue;
    
    const pieces = key.split("[");
    if (pieces.length > 2) {
      throw new Error("More then 1 level of nesting");
    }
    if (pieces.length === 1) {
      values[key] = value;
    } else {
      if (values[pieces[0]] === undefined) {
        values[pieces[0]] = {};
      }
      values[pieces[0]][pieces[1].slice(0, -1)] = value;
    }
  }
  return values;
}
```

Pagination<a name="Pagination"></a>
----------
Forgetting about the pagination makes processing the values from the the uris simpeler, 
but it is good practice to first refactor and then extend. This means to first adapt the 
List component in such a way that:
- a conventional query string is used, 
- it is first converted to a plain object and stored for later use,
- the object is then converted into an uri to be sent to the api.

But first import the necessary funcions in client/components/hours/List.js:
```javascript jsx
import {buildQuery, parseQuery} from "../../utils/dataAccess";
```

Then replace the componentDidMount method by:
```javascript jsx
  values;

  componentDidMount() {
    this.values = parseQuery(this.props.location.search);
    this.props.list("hours?" + buildQuery({page: values.page}));
  }
```

When the user actually presses a page button:
- the page number is added to the stored object,
- it is converted back to one uri that is added to the history

This is implemented in the following method:
```javascript jsx
  /**
   * Event handler for pagination buttons
   * @param string page (numeric)
   */
  page(page) {
    this.values.page = page;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }
```

React detects this and provides new properties with the new query string. 
To process this adapt the componentDidUpdate method like this:
```javascript jsx
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.values = parseQuery(this.props.location.search);
      this.props.list("hours?" + buildQuery({page: values.page}));
    }
  }
```

To provide the page function to the Pagination component, replace its call at the bottom of the
render method by: 
```javascript jsx
        <Pagination retrieved={this.props.retrieved} onClick={page=>this.page(page)} />
```

In client/src/components/common/Pagination.js:
```javascript jsx
import {parseQuery} from "../../utils/dataAccess";
```

Add an onClick property to the first button: 
```javascript jsx
            <Link
                to="."
                className={`btn btn-primary${previous ? '' : ' disabled'}`}
                onClick={ e => handleClick(e, props, first) }
            >
```
Add similar onClick properties to the other buttons, replacing first with previous, next and last.

Finally add the handleClick function at the bottom of the file:
```javascript jsx
function handleClick(event, props, uri) {
  if (!props.onClick) return;
  event.preventDefault();
  props.onClick(parseQuery(uri).page)
}
```

Because a query string is now used instead of passing the api uri as page parameter
the following route in client/src/routes/hours.js will no longer be used and
can be removed:
```javascript jsx
  <Route path="/hours/:page" component={List} exact strict key="page" />
```

You can now test the application. The pagination buttons should work and you should
be able to go back using the browsers back button.


Toolbar<a name="ToolBar"></a>
-------
Below the title "Hours List"the List currently renders a paragraph with the Create button:
```javascript jsx
        <p>
          <Link to="create" className="btn btn-primary">
            <FormattedMessage id="hours.create" defaultMessage="Create"/>
          </Link>
        </p>
```

In order to show the Search Form replace this by the following toolbar:
```javascript jsx
        <div className="toolbar">
          <SearchTool
            query={this.props.location.search}
            list={this.list.bind(this)}
            history={this.props.history}
          />
          <div className="toolbar-buttons form-group">
            <Link to="create" className="btn btn-primary">
              <FormattedMessage id="hours.create" defaultMessage="Create"/>
            </Link>
          </div>
        </div>
```

As you can see instead of the SearchForm a SearchTool is included. 
This way all the plumming that is required to control the Form and the
searching can be kept outside of the List component. The only code that 
is needed in the List component is the list function that is called
by the SearchTool in order to pass the values from the form and
the query for the api:
```javascript jsx
list(values, apiQuery) {
    this.values = values;
    this.props.list("hours?" + apiQuery);
  }
```

The above method replaces the lifecycle methods componentDidMount
and componentDidUpdate. Please remove them from the List component.


SearchTool<a name="SearchTool"></a>
----------
Create a file SearchTool.js in the client/src/components/hours folder with
the following code:
```javascript jsx
import React, { Component } from 'react';
import PropTypes from "prop-types";
import {buildQuery, parseQuery} from "../../utils/dataAccess";
import SearchForm from "./SearchForm";
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

class SearchTool extends Component {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  values;

  /** @return string part of the iri after the last slash */
  static idFromIri(iri) {
    if (!iri) return undefined;

    const i = iri.lastIndexOf("/");
    if (i === -1) return undefined;

    return iri.substring(i + 1);
  }

  componentDidMount() {
    this.valuesFromQuery();
    this.props.list(this.values, this.apiQuery());
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.valuesFromQuery();
      this.props.list(this.values, this.apiQuery());
    }
  }

  apiQuery() {
    const {page, description, employee, nHours, start} = this.values;
    const req = {};

    if (page) {
      req.page = page;
    }
    if (description) {
      req.description = description;
    }
    if (employee) {
      if (employee.id) {
        // need to strip /employees/
        req.employee = this.constructor.idFromIri(employee.id.);
      }
      if (employee.function) {
        req["employee.function"] = employee.function;
      }
    }
    if (nHours) {
      req.nHours = {gte: nHours-0.05, lt: nHours+0.05};
    }
    if (start) {
      // convert local date to UTC after & before
      const y =  parseInt(start.substring(0, 4), 10);
      const m = parseInt(start.substring(5, 7), 10) - 1;
      const d = parseInt(start.substring(8, 10), 10);
      req.start = {
        after: new Date(y, m, d, 0, 0, 0).toISOString(),
        before: new Date(y, m, d, 23, 59, 59).toISOString()
      }
    }
    return buildQuery(req);
  }

  shouldProcessChange(values, oldValues) {
    if (get(values, 'employee.id') !== get(oldValues, 'employee.id')) return true;
    if (values.start !== oldValues.start
      && (!values.start || values.start.substring(0, 4) > "1900")
    ) return true;
    return false;
  }

  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
    if (this.values.nHours)
      this.values.nHours = parseFloat(this.values.nHours);
  }

  /**
   * Event handler for changes in the search form.
   * Reset page.
   * Only process changes from fields that do not react to Enter key.
   * @param {} values
   */
  formChange(values) {
    if (this.shouldProcessChange(values, this.values)) {
      values.page=undefined;
      this.props.history.push(
        "?" + buildQuery(values)
      );
    }
  }

  /**
   * Event handler for submission of the search form.
   * If values have changed, reset page and push query to history.
   * @param {} values
   */
  formSubmit(values) {
    if (isEqual(values, this.values)) return;

    values.page=undefined;
    this.props.history.push(
      "?" + buildQuery(values)
    );
  }

  render() {
    return (
      <SearchForm
        onSubmit={values => this.formSubmit(values)}
        onChange={values => this.formChange(values)}
        initialValues={ {...this.values, order: undefined, page: undefined} }
      />
    );
  }
}

export default SearchTool;
```

Starting at the bottom: The tool only renders the SearchForm that you 
created earlier. If the form is submitted the values are passed to the 
formSubmit method. This method clears the page value to allways show
the first page of a new search result. Then it pushes an uri with a 
query string from the values on to the history.

In reaction to this React will call the lifecylce method componentDidUpdate:
```javascript jsx
componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.valuesFromQuery();
      this.props.list(this.values, this.apiQuery());
    }
  }
```
This method is much like the corrensponding method of the List component.
If the query string has changed, it also sets the values property, but this 
is done by valuesFromQuery method:
```javascript jsx
  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
    if (this.values.nHours)
      this.values.nHours = parseFloat(this.values.nHours);
  }
```
Of course this method starts with parsing the query string, but it 
adds an application specific detail: the value of nHours is parsed as a float,
so that the SearchForm gets what it expects.

Back to the lifecycle method: It passes the values to the List component
together with a query string for the api. This is how the query string is created:
```javascript jsx
  apiQuery() {
    const {page, description, employee, nHours, start} = this.values;
    const req = {};

    if (page) {
      req.page = page;
    }
    if (description) {
      req.description = description;
    }
    if (employee) {
      if (employee.id) {
        // need to strip /employees/
        req.employee = this.constructor.idFromIri(employee.id.);
      }
      if (employee.function) {
        req["employee.function"] = employee.function;
      }
    }
    if (nHours) {
      req.nHours = {gte: nHours-0.05, lt: nHours+0.05};
    }
    if (start) {
      // convert local date to UTC after & before
      const y =  parseInt(start.substring(0, 4), 10);
      const m = parseInt(start.substring(5, 7), 10) - 1;
      const d = parseInt(start.substring(8, 10), 10);
      req.start = {
        after: new Date(y, m, d, 0, 0, 0).toISOString(),
        before: new Date(y, m, d, 23, 59, 59).toISOString()
      }
    }
    return buildQuery(req);
  }
```

There is one more method that handles a form event:
```javascript jsx
  /**
   * Event handler for changes in the search form.
   * Reset page.
   * Only process changes from fields that do not react to Enter key.
   * @param {} values
   */
  formChange(values) {
    if (this.shouldProcessChange(values, this.values)) {
      values.page=undefined;
      this.props.history.push(
        "?" + buildQuery(values)
      );
    }
  }

```
Instead of allways updating the list, this method ignores
character level changes to the description and nHours field.
Processing changes for each character is nice for a search suggestion
dropdown, but the Search Form does not have one. The list 
holds much more information then a earch suggestion
dropdown, and it is not directly relevant to the task the
user is performing: typing a search term. It is therefore better
to wait for the user to press Enter so that the form is submitted. 

But not with all fields the Enter key submits the form. 
The following method is used to decide if a change should
be processed:
```javascript jsx
  shouldProcessChange(values, oldValues) {
    if (get(values, 'employee.id') !== get(oldValues, 'employee.id')) return true;
    if (values.start !== oldValues.start
      && (!values.start || values.start.substring(0, 4) > "1900")
    ) return true;
    return false;
  }
```

You can now test the application. Its layout needs impovement,
but each of the search fields should work to
change the list and they should all work together through AND.
The page buttons should only change the page. When the 
form is changed and submitted you should get the first page.

You may have noticed that if the search result fits on a single
page the pagination buttons are present but all disabled. This is not
consistent with the Employee list, where they disappear when 
all Employees fit on the first page. In order to make the 
buttons disappear instead, add the following to client/src/components/common/Pagination.js
above the return statement:
```javascript jsx
    if (first===undefined && last===undefined) return null;

```
The buttons should now disappear as expected.

Style<a name="Style"></a>
-----

To make the form fields smaller and display in line, and to make the
submit button disappear (like in the admin interface), add the following
to client/src/main.css:
```css
.search .btn-success {
    display: none;
}
.search .form-group {
    display: inline-block;
    width: 180px;
    vertical-align: top;
}
.search .form-control {
    display: block;
    width: 98%;
}
.search .form-control-label {
    width: 98%;
    display: block;
}
.search, .toolbar-buttons {
    display: table-cell;
    vertical-align: bottom;
}
.toolbar-buttons {
    padding-left: 5px;
    padding-bottom: 1rem;
}
```
The form should now look like [this](/resources/HoursSearch.png). 

Improving the Back to List buttons and initial values<a name="Buttons"></a>
-----------------------------------------------------
The hours List component can now search, but the "Back to list" buttons
in the hours Create, Show and Update components still refers to
the top of the full list. To the user this does not really feel like
going "back" from where he/she came from. This can be solved by
including the last query string from the list into the buttons uris.

But how to get the query string from the List into the Create, Show and Update components?
This is a typical job for Redux. It requires an action to dispatch a message 
and a reducer to store it in Redux. The existing list action takes care of retrieving the list,
to separate concerns it is better to add a specific action for storing the query string.

To client/src/actions/hours/list.js add the function to create the
message to dispatch to Redux for the query:
```javascript jsx
export function query(query) {
  return { type: 'EMPLOYEE_HOURS_QUERY', query };
}
```

And to the corresponding reducers add:
```javascript jsx
export function query(state = null, action) {
  switch (action.type) {
    case 'EMPLOYEE_HOURS_QUERY':
      return action.query;

    // Do not clear in case of 'EMPLOYEE_HOURS_RESET'

    default:
      return state;
  }
}
```
and add the function to combineReducers, resulting in:
```javascript jsx
export default combineReducers({ error, loading, retrieved, eventSource, query });
```
Because of the naming of function "query" this will store the queryString under the name "hours.query" 

In the hours List component add query to the import of actions/hours/list, resulting in:
```javascript jsx
import { list, reset, query } from '../../actions/hours/list';
```

Add a comma and the following line to the static propTypes object:
```javascript jsx
    query: PropTypes.func.isRequired
```

Add the following line to the list method to actually call the action:
```javascript jsx
    this.props.query(this.props.location.search);
```

To make the Return to List button actually point to the right page 
add a comma and the following line to the static propTypes object
of the hours Create component: 
```javascript jsx
  listQuery: PropTypes.string,
```

Change the backToList Link to:
```javascript jsx
       <Link to={"./" + (this.props.listQuery ? this.props.listQuery : "")} className="btn btn-primary">
```
and change the mapStateToProps function to:
```javascript jsx
const mapStateToProps = state => {
  const { created, error, loading } = state.employee.create;
  const listQuery = state.employee.list.query;
  return { created, error, loading, listQuery };
};
```

You can now test the employee Create component to
refer back to the List with the last search criteria, sorting and pagination.

Do the same with the hours Show and Update components, but at the top 
of the render method add:
```javascript jsx
const listUri = "../" + (this.props.listQuery ? this.props.listQuery : "");
```
Change on the next line the Redirect property to value to {listUri} and
do the same with the backToList Link tag.

The mapStateToProps function is also a little different, you only need to
add a comma and:
```javascript jsx
  listQuery: state.hours.list.query
```

You can now test the hours Show and Update components.

The Create component now knows the last query string of 
the list. It could use that info to initially select an Employee.
It would also be handy to have the start input set to the current date and time.

To get the employee id from the query string the Create component
needs to parse the query string. Add the following import:
```javascript jsx
import {parseQuery} from "../../utils/dataAccess";
```

In the render method above the return statement add: 
```javascript jsx
    const initialValues = {start: new Date().toISOString()};
    const listValues = parseQuery(this.props.listQuery);
    if (listValues.employee) {
      initialValues.employee = values.employee.id;
    }
```

Finally change the Form tag to:
```javascript jsx
        <Form onSubmit={this.props.create} initialValues={initialValues} />
```

You can now test the hours Create component to
pre-select the employee that was searched for in the list and
to show the current date and time in the input "start".

Another pre-select can be made from the employee List component. In 
its render method at the thead tag make the colspan of the last th tag 3.
Then close to the end of tbody, below the td tag containing the edit link, add:
```javascript jsx
                  <td>
                    <Link to={`../hours/?employee[id]=${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-clock" aria-hidden="true" />
                      <span className="sr-only"><FormattedMessage id="employee.hours" defaultMessage="Hours"/></span>
                    </Link>
                  </td>
```
When you test the Employee list there should be a new clock-shaped link for each Employee 
that leads to the Hours list with the Employee selected so that it shows the Hours of
that same Employee.


Scaffolding your own application<a name="Scaffolding"></a>
--------------------------------
Templates that where adapted for the use a search tool as well as sorting like is
described in chapter 6 are available in [branch tutorial-chapter6 of
metaclass-nl/client-generator](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter6).
They are provided for scaffolding your own application 
(after scaffolding you still need to make some adaptations manually).

Data about the filters offered by the api is currently not included in the JSON-LD documentation
generated by api platform that is used by the client generator. Therefore the 
client generator can only scaffold a search tool for all immediate properties. Because 
read-only properties are often not persistent, the writable properties are used.
These are the same properties that are used to generate the Form component.

Because of this the application developer probably needs to adapt the search tool and
form to make it work properly. Therefore the search tool is not used by default 
in the scaffolded List components. 

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter6-react 
```
will compare your own version with code one of chapter6-react. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter6-api. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-api) 
and follow the instructions.
