Chapter 4: Labels - React client
================================

The environment is te same as in the chapter3-react branche, except:
- instructions from README.md of chapter3-react where applied
- instructions from README.md of chapter4-api where applied

This chapter replaces ids by labels and a select widget.

Obsolete Columns and Fields
---------------------------

The table that where scaffolded for the list of employees holds a column
for each property of Employee. This was probably done because the scaffolding script
has no way to know what properties are important and which ones can be left out. 
In client/src/components/employee/List.js below 
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
columns firstName, lastName, address, zipcode, city, hours are now empty 
because the api no longer includes these properties in the list of employees.
They can be removed. The column label can be removed too, because
in paragraph "Labels" you will make the label shown in the first column.

The table that where scaffolded for the list of hours holds a column
for each property of Hours. In client/src/components/hours/List.js below 
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
Columns onInvoice and label and their column labels can be removed. 

The fields that where scaffolded for showing an Employee show the property 
hours that is no longer present in the output of the api. It can be removed
from client/src/components/employee/Show.js.

The fields that where scaffolded for editing an Employee show the property 
hours that is no longer present in the output of the api. It can be removed
from client/src/components/employee/Form.js.

Labels
------

In chapter4-api you added an extra tag at the label property of Employee:
```php
     * @ApiProperty(iri="http://schema.org/name")
```

Let's start with client/src/components/employee/List.js. below
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
replace the header id by:
```javascript jsx
              <th><FormattedMessage id="employee.item" default="Employee"/></th>
```
and the content of the Link in tbody to
```javascript jsx
   {item['label']} 
```

Component hours/List.js also contains a column id, but 
here using the label would sort off mess up the table with too much
data in a single column. This can be solved by making the
first column show 'start' instead of @id and reordering the other colums like in:
```javascript jsx
        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th><FormattedMessage id="hours.start" defaultMessage="start"/></th>
              <th><FormattedMessage id="hours.day" defaultMessage="day"/></th>
              <th><FormattedMessage id="hours.description" defaultMessage="description"/></th>
              <th><FormattedMessage id="hours.nHours" defaultMessage="nHours"/></th>
              <th><FormattedMessage id="hours.employee" defaultMessage="employee"/></th>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved['hydra:member'].map(item => (
                <tr key={item['@id']}>
                  <th scope="row">
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      <defined.FormattedDateTime value={item['start']} />
                    </Link>
                  </th>
                  <defined.FormattedDate value={item['start']} weekday="short"/>
(..)
```
(You need to reorder the column values correspondingly)

Then there is the link to the employee. Both List.js and Show.js use an 
EntityLinks component to render the link. In List.js:
```javascript jsx
                  <td><EntityLinks type="employees" items={item['employee']} /></td>
```

In client/src/components/common/EntityLinks.js a property 'labelProp' is defined
that can be passed to the EntityLinks object, specifying which property to use
to represent the object(s) in the content of the link(s). All you need to do
is the to add labelProp="label" in both List.js and Show.js. In List.js:
```javascript jsx
                  <td><EntityLinks type="employees" items={item['employee']} labelProp="label" /></td>
```

If you test this you will see nothing shows up.
This is caused by client/src/actions/hours/list.js and
 client/src/actions/hours/show.js containing the following line:
```javascript jsx
    retrieved = normalize(retrieved);
```
This line normalizes the retrieved data replacing any nested
object by their @id. If you remove these lines the links to
employees should show up with the employee label as content and
the id used for the href.

The component employee/Show.js also shows the id of the employee in 
its render method:
```javascript jsx
        <h1><FormattedMessage id="employee.show" defaultMessage="Show {label}" values={ {label: item && item['@id']} }/></h1>
```
You can replace @id by label, resulting in:
```javascript jsx
        <h1><FormattedMessage id="employee.show" defaultMessage="Show {label}" values={ {label: item && item['label']} }/></h1>
```
You can do the same with the component employee/Update.js 

The same can be done with hours/Show.js. and hours/Update.js but here we have
a problem: the label contains a dateTime in UTC and its format is not localized!
Luckily FormattedMessage can also render components like FormattedDateTime passed as parameter value.
For hours/Show.js:
```javascript jsx
        <h1><FormattedMessage
          id="hours.show"
          defaultMessage="Show {start} {description}"
          values={ {start: <defined.FormattedDateTime value={item && item['start']} />, description: item && item['description']} }
        /></h1>
```
Please adapt the translations in the messages folder like the defaultMessage.

For hours/Update.js first import the intlDefined components:
```javascript jsx
import * as defined from '../common/intlDefined';
```
Formatting the message is similar:
```javascript jsx
        <h1><FormattedMessage
          id="hours.update"
          defaultMessage="Edit {start} {description}"
          values={ {start: <defined.FormattedDateTime value={item && item['start']} />, description: item && item['description']} }
        /></h1>
```
Of course you need to adapt the translations in the messages folder accordingly.

Select
------

All employee ids are now out of sight except for the text input 
in client/src/components/hours/Form.js. Here is a simple Select component
that retrieves all Employees, shows their labels and selects the @id:
```javascript jsx
//client/src/components/common/SelectEntity.js
import React, { Component } from "react";
import PropTypes from "prop-types";
import {fetch} from "../../utils/dataAccess";
import {FormattedMessage} from "react-intl";

/**
 * Simple component for selecting entities from a dropdown
 * that shows their labels
 */
class SelectEntity extends Component {
  static propTypes = {
    fetchUrl: PropTypes.string,
    labelProp: PropTypes.string,
    error: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object
  };

  state = {};
  mounted = false

  componentDidMount() {
    this.mounted = true;

    fetch(this.props.fetchUrl)
      .then(response => response.json())
      .then(retrieved => {
        if (this.mounted)
          this.setState({ entities: retrieved["hydra:member"] });
      })
      .catch(e => {
        if (this.mounted)
          this.setState({ error: e });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  optionsFromEntities() {
    if (this.state.entities === undefined) {
      return null;
    }

    var items = this.state.entities.map(item => (
      <option key={item["@id"]} value={item["@id"]}>{item[this.props.labelProp]}</option>
    ));
    if (!this.props.required || this.props.input.value === "") {
      items.unshift(<option key="" value=""></option>);
    }
    return items;
  }

  render() {
    if (this.state.error !== undefined) {
      return <div>{this.state.error.toString()}</div>;
    }
    if (this.state.entities === undefined) {
      return <div><FormattedMessage id="loading" defaultMessage="Loading..."/></div>;
    }
    return (
      <select
        {...this.props.input}
        required={this.props.required}
        id={this.props.meta.form + "_" + this.props.input.name}
      >
        {this.optionsFromEntities()}
      </select>
    );
  }
}

export default SelectEntity;
```
Of course this select has its limitations: 
- it does not cache its contents, so the entities may be retrieved from the api more often then necessary,
- it does not subscribe with mercure for changes to the entities, so they may get outdated,

Both limitations sort of compensate for one another, but it would be nice if it only retrieved entities 
the user searches for, and displays them 'as you type'. But this would require a more sophisticated widget. 
In chapter 7 with react widgets this will be resolved so that the above SelectEntity component can be kept simple
for now.

But how can it be rendered? The form passes this.renderField to each Redux Field component,
renderField allways returns a ReduxFormRow that renders an input! A simple solution could be to make renderField
display the select if data.input.name == 'employee'. But it would be more flexible if one
could freely specify the widget to use.  For this you need to adapt 
client/src/components/common/ReduxFormRow.js. As the first lines of funcion ReduxFormRow add:
```javascript jsx
    const Widget = data.widget ? data.widget : ReduxFieldInput;
    const widgetData = {...data};
    widgetData.label = undefined;

```
And below the label component in the return statement replace 
```javascript jsx
            <ReduxFieldInput {...data}/>
```
by:
```javascript jsx
            <Widget {...data}/>
```

This way ReduxFormRow looks for its 'widget' property. If it is specified, it assigns it to constant Widget,
if it is not specified it assigns ReduxFieldInput instead. In the return it renders the Widget constant.
Eventual content of the label property is already rendered by ReduxFormRow itself.


Back in client/src/components/hours/Form.js you need to import SelectEntity:
```javascript jsx
import SelectEntity from '../common/SelectEntity.js';
```

Now the Redux form Field for employee can be adapted like this:
```javascript jsx
        <Field
          component={this.renderField}
          name="employee"
          placeholder=""
          required={true}
          widget={SelectEntity}
	  labelProp="label"
          fetchUrl="employees?pagination=false"
          label=<FormattedMessage id="hours.employee" defaultMessage="employee" />
        />
```
Three properties where added to this Field:
- widget specifies the SelectEntity class to be used for the widget
- fetchUrl tells the SelectEntity where to get its entity data
- labelProp tells the SelectEntity which property to use to represent the entities to the user

Field passes all its properties except 'component' to the forms renderField method.
This method passes them to ReduxFormRow but adds the error from the Form properties.
Finally the render method renders the constant Widget, once again passing the properties.
To prevent React from getting confused by an in the context of Widget useless label property 
holding another component, it is set undefined before the properties are passed to Widget.

A little styling
----------------

To make the layout look a little better on desktops, add a file main.css to the client/src folder 
with the following content:
```css
/* styles common for the entire app */

.bg-lightGrey {
    background: #f2f2f2;
}
@media (min-width: 768px) {
    .mainContainer {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}
@media (min-width: 668px) {
    .form-control-label, .form-control {
        display: inline-block;
        vertical-align: top;
    }

    .form-control-label {
        width: 30%;
    }

    .form-control {
        width: 70%;
    }
}
```

Then import it in client/src/index.js:
```javascript jsx
import './main.css';
```

Scaffolding your own application
--------------------------------

Templates that where adapted for the use of labels instead of @ids and a select widget
for a single reference are available in [branch tutorial-chapter4 of
metaclass-nl/client-generator](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter4).
They are provided for scaffolding your own application 
(after scaffolding you still need to make some adaptations manually).

Be aware that the code scaffolded by these templates needs data from
the api to contain label properties to be typed as http://schema.org/name
and labels of referred entities to be included (possible by serialization groups). 
Because the generator only has access to the metadata of the single type for which it is scaffolding,
it assumes all referred types label properties have the same name. If this assumption is wrong
you need to correct the scaffolded code.

Finally, if your application needs the user to edit references to multiple
entities, the scaffolded entryfield will only be usable if you show the @ids
of the entities somewhere in the application, for example in the List component.