Chapter 6: Sorting and Simple Search- React client
==================================================

The environment is te same as in the chapter5-react branche, except:
- instructions from README.md of chapter5-react where applied
- instructions from README.md of chapter6-api where applied

This chapter adds support for sorting both the Employee and the
Hours list by clicking on a column header and a custom Filter service
for searching with a single text input in several fields.

ListTool<a name="ListTool"></a>
--------
In chapter 5 searching was added to the Hours list, it was first refactored
to make pagination work with a conventional query string. Sorting needs to use
the same query string, so the Employee list needs to be refactored too. 
To make it similar with Hours List and to make it easy to add searching later on, 
a ListTool could be factored out from the Hours SearchTool. 

Create a file client/src/components/common/ListTool.js with the following content:
```javascript jsx
import { Component } from 'react';
import PropTypes from "prop-types";
import {buildQuery, parseQuery} from "../../utils/dataAccess";

class ListTool extends Component {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired
  };

  values = {};

  componentDidMount() {
    this.valuesFromQuery();
    this.props.list(this.values, buildQuery(this.apiRequest()));
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.valuesFromQuery();
      this.props.list(this.values, buildQuery(this.apiRequest()));
    }
  }

  /**
   * Set values from the query string
   */
  valuesFromQuery() {
    this.values = parseQuery(this.props.query);
  }

  apiRequest() {
    const {pageParameterName="page", orderParameterName="order"} = this.props;
    const req = {};
    req[pageParameterName] = this.values.page;
    req[orderParameterName] = this.values.order;

    return req;
  }

  render() {
    return null;
  }
}

export default ListTool;
```

In the client/src/components/hours/SearchTool.js replace:
```javascript jsx
import React, { Component } from 'react';
```
by:
```javascript jsx
import React from "react";
import ListTool from "../common/ListTool";
```
Then make the class extend ListTool, remove the values property and
the methods componentDidMount and componentDidUpdate. Afterwards the Hours
List should work as it did before.

In the Employee list component add the imports:
```javascript jsx
import {buildQuery} from "../../utils/dataAccess";
import ListTool from "../common/ListTool";
```

Replace the methods componentDidMount and componentDidUpdate by:
```javascript jsx
   values = {};

  list(values, apiQuery) {
    this.values = values;
    this.props.list("/employees?" + apiQuery);
  }

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

To render the (invisible) ListTool replace the paragraph with the Link to "create" by:
```javascript jsx
        <div className="toolbar">
          <ListTool
            query={this.props.location.search}
            list={this.list.bind(this)}
          />
          <div className="toolbar-buttons form-group">
            <Link to="create" className="btn btn-primary">
              <FormattedMessage id="employee.create" defaultMessage="Create"/>
            </Link>
          </div>
        </div>
```

Finally add the onClick to the Pagination component in the render method:
```javascript jsx
        <Pagination retrieved={this.props.retrieved} onClick={page=>this.page(page)} />
```

Test the Employee list.


Sort Headers<a name="SortHeaders"></a>
------------
Sorting the table by a single click on a table column header seems simple, 
but it gets more complicated when the second click on the header should reverse 
the sort. And it would be nice to see in wich direction the table is actually sorted
by the values of which column, so for a header there is the choice of showing one of two icons or 
no icon at all. 

Furthermore if the user has just arrived on the page and not yet clicked
on any column header, it may already be sorted by default. It would be nice it that 
order is the same as the order if a column is clicked, the column shows the
right icon too. And when the column is clicked, reverses the default order.

All this functionality is pritty much the same for each column header, so its
typically something for a component. The component would need to know 
- the current order. This will be present as a nested object in the current values of the List.
- how to order. This object will replace the nested object in the current values of the List.
- Wheather how this column orders is the default ordering

Create a file client/src/components/common/ThSort.js
with the following content:
```javascript jsx
import React from 'react';
import isEqual from "lodash/isEqual";
import mapValues from "lodash/mapValues";

const icons = [
  <span className="fa fa-angle-up" aria-hidden="true"/>,
  <span className="fa fa-angle-down" aria-hidden="true"/>
];

/**
 * @param {} props
 *   order {} current sorting order
 *   orderBy {} How to order (reverse if already ordered like this)
 *   isDefault boolean Wheather orderBy is the default ordering
 * @returns {*} Table header with onClick and eventual sort direction icon
 * @constructor
 */
export default function ThSort(props) {
  const { order, orderBy, isDefault=false} = props;
  const orderByKeys = Object.keys(orderBy);
  const orderByIcon = orderBy[orderByKeys[0]].toLowerCase() === "asc" ? 0 : 1;
  const reverseOrderBy = reverseOrder(orderBy);
  let icon = null;
  let clickedOrdersBy = orderBy;
  if (order) {
    if (isEqual(Object.keys(order), Object.keys(orderBy))) {
      if (isEqual(order, orderBy)) {
        icon = icons[orderByIcon];
        clickedOrdersBy = reverseOrderBy;
      }
      if (isEqual(order, reverseOrderBy)) {
        icon = icons[Math.abs(orderByIcon-1)]; // reverseOrderByIcon
        clickedOrdersBy = orderBy;
      }
    }
  } else if (isDefault) {
    icon = icons[orderByIcon];
    clickedOrdersBy = reverseOrderBy;
  }
  return (
    <th  className="sort" onClick={e=>props.onClick(clickedOrdersBy)}><span>{props.children}</span>{icon}</th>
  );
}

function reverseOrder(orderBy) {
  return mapValues(orderBy, value =>
      value.toLowerCase() === "asc" ? "desc" : "asc"
  );
}
```
With the ThSort component comes a little addition to client/src/main.css:
```css
th .fa-sort-down, th .fa {
    margin-left: 5px;
}
```

Sorting the Employee list<a name="EmployeeList"></a>
-------------------------
Import the component in the Employee list:
```javascript jsx
import ThSort from "../common/ThSort";
```

When the ThSort is clicked it will call a function. Add this to the List component:
```javascript jsx
  /**
   * Call back for sort headers
   * @param {} order
   */
  order(order) {
    this.values.order = order;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }
```

Because it is simpeler, start with replacing the second column header:
```javascript jsx
              <ThSort orderBy={ {"function": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.function" default="function"/>
              </ThSort>
```

The first colomn contains the labels of Employees. These are made up from lastName and fistName, so the first
column header needs to sort by two properties:
```javascript jsx
              <ThSort orderBy={ {"lastName": "asc", "firstName": "asc"} }  isDefault={true} order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.item" default="Employee"/>
              </ThSort>
```
Furthermore, lastName: "asc", firstName: "asc" is the default order of Employees, specified in api/src/entities.Employee.php.
But the ThSort does not know that, it has to be told by the property isDefault={true}.

The last two columns are pritty much like the first one:
```javascript jsx
              <ThSort orderBy={ {"birthDate": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.birthDate" default="birthDate"/>
              </ThSort>
              <ThSort orderBy={ {"arrival": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="employee.arrival" default="arrival"/>
              </ThSort>

```

Test the Employee list column headers and its pagination buttons.

Sorting the Hours list<a name="HoursList"></a>
----------------------

Import the component in the Hours list:
```javascript jsx
import ThSort from "../common/ThSort";
```

When the ThSort is clicked it will call a function. Add this to the List component:
```javascript jsx
  /**
   * Call back for sort headers
   * @param {} order
   */
  order(order) {
    this.values.order = order;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }
```

Replace the column headers by:
```javascript jsx
              <ThSort orderBy={ {"start": "desc"} } isDefault={true} order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.start" defaultMessage="start"/>
              </ThSort>
              <th>
                <FormattedMessage id="hours.day" defaultMessage="day"/>
              </th>
              <ThSort orderBy={ {"description": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.description" defaultMessage="description"/>
              </ThSort>
              <ThSort orderBy={ {"nHours": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.nHours" defaultMessage="nHours"/>
              </ThSort>
              <ThSort orderBy={ {"employee.lastName": "asc", "employee.firstName": "asc"} } order={this.values.order} onClick={order=>this.order(order)}>
                <FormattedMessage id="hours.employee" defaultMessage="employee"/>
              </ThSort>
              <th colSpan={2} />
```
Notice that ordering by properties on a related object is NOT specified by a nested object like:
```javascript jsx
{"employee {lastName": "asc", "firstName": "asc"} }
```
instead a flat object with paths as keys is used:
```javascript jsx
{"employee.lastName": "asc", "employee.firstName": "asc"}
```

Test the Hours list column headers, pagination buttons and search form. The sort order should be retained when
the search is changed, but the pagination should be reset.

SimpleSearch<a name="SimpleSearch"></a>
------------

SimpleSearch allows the user to type all terms in a single input. 
It searches each term in all properties specified, combining per term the resulting query expressions through OR,
but combining the terms through AND. For an entity to be found it must contain all 
search terms but it does not matter in which of the properties specified.

In the api branche of this chapter a new filter class was added that implements this, 
and an @ApiFilter annotation was added to entity class Employee that makes it react
to query parameter "search". 

To let the user use this the Employee list component's ListTool needs to be replaced
by a SearchTool that contains a form with a single text input. The SearchTool can inherit
the retrieval of values from the query string and calling back the List component from
ListTool. Create a new file client/src/components/employee/SearchTool.js with the following content:
```javascript jsx
import React from 'react';
import ListTool from "../common/ListTool";
import PropTypes from "prop-types";
import {buildQuery} from "../../utils/dataAccess";
import {FormattedMessage} from "react-intl";

class SearchTool extends ListTool {
  static propTypes = {
    query: PropTypes.string,
    list: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  searchInput;

  apiRequest() {
    const req = super.apiRequest();
    req.search = this.values.search;
    return req;
  }

  /**
   * Event handler for submission of the search form.
   * If values have changed, reset page and push query to history.
   * @param {} e event from form submit
   */
  formSubmit(e) {
    e.preventDefault();

    if (this.searchInput.value === this.values.search) return;

    this.values.search = this.searchInput.value;
    this.values.page=undefined;
    this.props.history.push(
      "?" + buildQuery(this.values)
    );
  }

  render() {
    return (
      <form className="search" onSubmit={this.formSubmit.bind(this)}>
        <div className={`form-group`}>
          <input type="text" name="search" defaultValue={this.values.search} className="form-control" ref={ref=>this.searchInput=ref} id="search_employees_search"/>
        </div>
        <button type="submit" className="btn btn-success">
          <FormattedMessage id="submit" defaultMessage="Submit"/>
        </button>
      </form>
    );
  }
}

export default SearchTool;
```
The form is so simple that it would be overkill to use Redux Forms. An uncontrolled text input 
is used because for this purpose it makes the form behave more like a form using Redux Forms: 
The internal state of the form is separate from the state of the SearchTool, only if the
form is submitted the onSubmit event handler method 'formSubmit'on the SearchTool 
processes the state of the input into a new query string and pushes it on the history.

To use the SearchTool in the Employee List the import of the ListTool needs to be replaced by:
```javascript jsx
import SearchTool from "./SearchTool";
```
And in the render method the ListTool component should be replaced by:
```javascript jsx
          <SearchTool
            query={this.props.location.search}
            list={this.list.bind(this)}
            history={this.props.history}
          />

```
Notify that the component has an extra property 'history'.

You can not test the Employee list. Sorting should
still work. If the form is submitted the Sorting should remain the 
same. If the Soring is changed the search input should not change
and the same search should be performed.

Be aware that the search includes Employee properties that are
not visible in the list. For example if you search for '9722'
it should find Eden, Nicky by its zipcode. If you think this 
is counter intuitive you could add some columns to the page and/or
remove some properties from the @ApiFilter annotation on the
Employee entity class.

Improving the Back to List buttons<a name="Buttons"></a>
----------------------------------
In chapter 5 the Back to List buttons of the Hours components where improved
so that they take search criteria and pagination into account. The same can be done
with the Employee component. 

In the employee List component add query to the import of actions/employee/list, resulting in:
```javascript jsx
import { list, reset, query } from '../../actions/employee/list';
```

Add a comma and the following line to the static propTypes object:
```javascript jsx
    query: PropTypes.func.isRequired
```

Add the following line to the list method:
```javascript jsx
    this.props.query(this.props.location.search);
```

To client/src/actions/employee/list.js add the function to create the
message to dispatch to Redux for the query:
```javascript jsx
export function query(query) {
  return { type: 'EMPLOYEE_LIST_QUERY', query };
}
```

And to the corresponding reducers add:
```javascript jsx
export function query(state = null, action) {
  switch (action.type) {
    case 'EMPLOYEE_LIST_QUERY':
      return action.query;

    // Do not clear in case of 'EMPLOYEE_LIST_RESET'

    default:
      return state;
  }
}
```
and add the function to combineReducers, resulting in:
```javascript jsx
export default combineReducers({ error, loading, retrieved, eventSource, query });
```

To make the Return to List button point to the right page 
add a comma and the following line to the static propTypes object
of the employee Create component: 
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

Do the same with the employee Show and Update components. The
mapStateToProps function is a little different, you only need to
add a comma and:
```javascript jsx
  listQuery: state.employee.list.query
```

You can now test the employee Show and Update components.


Scaffolding your own application<a name="Scaffolding"></a>
--------------------------------
Templates that where adapted for the use a list- or search tool as well as sorting are available 
in [branch tutorial-chapter6 of metaclass-nl/client-generator](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter6).
They are provided for scaffolding your own application. The scaffolded code does not include simple search.

Data about the filters offered by the api is currently not included in the JSON-LD documentation
generated by api platform that is used by the client generator. Therefore the application
generator scaffolds sort headers for all columns. The application developer
is expected to correct this manually. This also includes setting ThSort property "isDefault"
to true on the column whose orderBy is the default sort order.

For the same reason the client generator can only scaffold a search tool and search form for all
immediate properties. Because read-only properties are often not persistent, the writable properties are used.

Because of this the application developer probably needs to adapt the search tool and
search form to make it work properly. Therefore the search tool is not used by default 
in the scaffolded List components. 

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter7-react 
```
will compare your own version with code one of chapter7-react. You mau also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter7-api. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-api) 
and follow the instructions.
