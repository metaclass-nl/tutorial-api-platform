Chapter 9: Report - React
=========================

The environment is te same as in the chapter8-react branch, except:
- instructions from README.md of chapter8-react where applied,
- instructions from README.md of chapter9-api where applied,
- client code was generated for DayTotalsPerEmployee, see under "Client code generation".

This chapter adds a report of totals of hours per Employee per day
as the homepage (replacing the Welcome page of Api Platform).

Client code generation<a name="CodeGeneration"></a>
----------------------
Custom operations like get_day_report that was added to Hours in the api branche of this chapter
are not supported by the react client generator. Normally one has to build the client manually
for custom operations, but in this case there is a workaround. If the Model DayTotalsPerEmployee
is copied to the api/src/Entities folder, its namespace changed accordingly and the folllowing
tag added (with the necessary use statement) the client generator can retrieve jsonld documentation for 
resource day_totals_per_employees:
```php class doc
 * @ApiResource(
 *     itemOperations={
 *         "get"
 *     },
 *     collectionOperations={
 *         "get"
 *     },
 *     normalizationContext={"groups"={"day_totals_per_employee"}}
 * )
```

With the branche tutorial-chapter6 of the [Extended React Client Generator](https://github.com/metaclass-nl/client-generator)
checked out the following commands where executed in the root folder of the client generator:
```shell
npm run build
./lib/index.js https://localhost:8443 ../tutorial-api-platform/client/src --resource day_totals_per_employees --bearer <token>
```
where <token> was replaced by the actual jwt token retrieved as described in the readme.md of 
[branch chapter7-api](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter7-api).
The resulting files where committed to this branche so that you do not have to
install nmp and the Extended React Client Generator.

Making the generated code work<a name="MakeItWork"></a>
------------------------------
The client generator has produced files for all CRUD operations even though only the get operations where defined
in the @ApiResource tag. Your first task is to remove files that are not needed for the List component:
- client/src/routes/daytotalsperemployee.js
- all from client/src/actions/daytotalsperemployee except list.js
- all from client/src/reducers/daytotalsperemployee except index.js and list.js
- all from client/src/components/daytotalsperemployee except List.js
Yes, you can delete components/daytotalsperemployee/SearchForm.js and SearchTool.js too! 
Their generation was based on the assumption that filters exist for the properties of 
DayTotalsPerEmployee, but in fact filters of Hours are used. So instead you can copy
SearchForm.js and SearchTool.js from client/src/components/hours.

Because of the deleted files client/src/reducers/daytotalsperemployee/index.js has to be adapted.
Remove all imports except for combineReducers and list and remove all variables from the object passed to combineReducers except list.

From client/src/actions/daytotalsperemployee/list.js remove 
```javascript jsx
import { success as deleteSuccess } from './delete';
```
and from function reset remove
```javascript jsx
    dispatch(deleteSuccess(null));
```

In client/src/components/daytotalsperemployee/List.js replace the import of ListTool by:
```javascript jsx
import SearchTool from "./SearchTool";
```

In method list change:
```javascript jsx
        this.props.list("day_totals_per_employees?" + apiQuery);
```
into
```javascript jsx
        this.props.list("hours/dayreport?" + apiQuery);
```
Replace the ListTool tag by:
```javascript jsx
          <SearchTool
            query={this.props.location.search}
            list={this.list.bind(this)}
            history={this.props.history}
            isUserAdmin={this.props.isUserAdmin}
          />
```
A little below that remove the Create button. 

In the tbody part at:
```javascript jsx
                <tr key={item['@id']}>
```
remove the @. The object is not an entity so api platform could not give it an iri. 
But the id is unique withing the list.

Close to the bottom remove the edit link.
In the corresponding th set the colspan to 1.

In the mapStateToProps function add:
```javascript jsx
  const { isUserAdmin } = state.login;
```
and add , isUserAdmin to the object returned.


Add a new file client/src/messages/daytotalsperemployee-nl.js with the following content:
```javascript jsx
export default {
  "daytotalsperemployee.employee": "Medewerker",
  "daytotalsperemployee.from": "Vanaf",
  "daytotalsperemployee.label": "Label",
  "daytotalsperemployee.to": "Tot",
  "daytotalsperemployee.count": "Aantal",
  "daytotalsperemployee.total": "Totaal",
  "daytotalsperemployee.onInvoice": "Op rekening",
  "daytotalsperemployee.fractionBilled": "Deel op rekening",

  "daytotalsperemployee.item": "Dagtotalen per medewerker",
  "daytotalsperemployee.list": "Dagtotalen per medewerker",
  "daytotalsperemployee.new": "Nieuw Dagtotalen",
  "daytotalsperemployee.show": "Toon {label}",
  "daytotalsperemployee.create": "Maak nieuwe",
  "daytotalsperemployee.update": "Bewerk {label}",
  "daytotalsperemployee.delete.confirm": "Weet u zeker dat u deze Dagtotalen wilt verwijderen?",
  "daytotalsperemployee.created": "{label} aangemaakt.",
  "daytotalsperemployee.updated": "{label} gewijzigd.",
  "daytotalsperemployee.mercure_deleted": "{label} is verwijderd door een andere gebruiker."
}
```
To client/src/messages/daytotalsperemployee-en.js add spaces to the camel cased names.

In client/src/messages/all.js add
```javascript jsx
import daytotalsperemployee_en from './daytotalsperemployee-en.js';
import daytotalsperemployee_nl from './daytotalsperemployee-nl.js';
```
and add , ...daytotalsperemployee_en to the object containing the other _en variables
and , ...daytotalsperemployee_nl to the object containing the other _nl variables.

In client/src/index.js below the main imports add:
```javascript jsx
import Home from './components/daytotalsperemployee/List.js';
```

Remove the import of Welcome. Below the imports of reducers and routes add:
```javascript jsx
import daytotalsperemployee from './reducers/daytotalsperemployee';
```
and add , daytotalsperemployee to the object passed to combineReducers.

Finally replace the Welcome variable in the Route path="/" by Home.

You can now test the client. After logging in as d.peters@leiden.nl you should see the the
DayTotalsPerEmployee list. If you search for start = 2019/17/09 some
day totals should show up.

Specific adaptations<a name="Specific"></a>
--------------------
Now the generated code works it is easy to see that the list contains some superfluous columns:
item (Day Totals Per Employee) and label. You can remove them from client/src/daytotalsperemployee/List.js
including the item Link, the user can use the hourglass link at the rightmost column.

Every day is 24 hours starting at 00:00 local time so instead of colums from and to, one column
is enough. Change FormattedMessage daytotalsperemployee.from to:
```javascript jsx
                <FormattedMessage id="daytotalsperemployee.date" defaultMessage="Date"/>
```
Add a message with this id to the client/src/messages/daytotalsperemployee-en.js
and one to daytotalsperemployee-nl.js with translation "Datum".

Back in client/src/daytotalsperemployee/List.js in the tbody Change the defined.FormattedDateTime item['from'] to defined.FormattedLocalDate and remove the next ThSort. 
Remove the import or ThSort and rename all ThSort tags to th.
Remove the td with FormattedDateTime item['to'].

The hourglass link still refers to the show route that does not exist. A more usefull target would
be the Hours list searching for the employee and day of the item. Change it to:

```javascript jsx
                    <Link to={this.hoursLink(item)}>
```
To make that work add the following method to the List class:
```javascript jsx
  hoursLink(item) {
    const employeeId = item.employee['@id'];
    const day = item.from;
    return `/hours/?employee[id]=${encodeURIComponent(employeeId)}&start=${encodeURIComponent(day)}`;
  }
```

In the SearchForm column the input for nHours does not search by the total of a day
but by the number of hours per Hours registration. This may be confusing
to the user. The input for description may also be confusing as the description of 
individual Hours registration can not be seen in the table. In 
client/src/components/daytotalsperemployee/SearchForm.js therefore remove the inputs for description and nHours.
The input for function may stay for the administrator because the adminstrator probably knows the function of 
most employees by head.

It would be handy to be able to select a longer period then a single day. Replace the input for start by:
```javascript jsx
        <Field
          component={this.renderField}
          name="start.after"
          type="date"
          label={<span><FormattedMessage id="hours.start" defaultMessage="start" /> <FormattedMessage id="daytotalsperemployee.from" defaultMessage="From" /></span>}
          placeholder=""
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
          />
        <Field
          component={this.renderField}
          name="start.strictly_before"
          type="date"
          label={<FormattedMessage id="daytotalsperemployee.to" defaultMessage="To" />}
          placeholder=""
          format={inputLoc.formatDate}
          normalize={inputLoc.normalizeDate}
        />
```

In the SearchTool, method shouldProcessChange replace:
```javascript jsx
    if (values.start !== oldValues.start
      && (!values.start || values.start.substring(0, 4) > "1900")
    ) return true;
```
by:
```javascript jsx
    const from = get(values, 'start.after');
    if (from !== get(oldValues, 'start.after')
      && (!from || from.substring(0, 4) > "1900")
    ) return true;

    const to = get(values, 'start.strictly_before');
    if (to !== get(oldValues, 'start.strictly_before')
      && (!to || to.substring(0, 4) > "1900")
    ) return true;
```
and in method apiRequest remove the code that is processing 
fields that you removed from the form. Also replace: 
```javascript jsx
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
```
by:
```javascript jsx
    if (get(this.values, 'start.after')) {
      req.start = { after: this.convertToISOString(start.after) };
    } else {
      // one week ago at 00:00, local time
      const dt = new Date(Date.now() - 7 * 86400);
      const localDateString = dt.getFullYear()+ '-' + ('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      req.start = { after: this.convertToISOString(localDateString + + 'T00:00:00') };
    }
    if (get(this.values, 'start.strictly_before')) {
      req.start.strictly_before = this.convertToISOString(start.strictly_before);
    }
```
and add the following method:
```javascript jsx
  convertToISOString(localDateString) {
    // convert local date to UTC after & before
    const y =  parseInt(localDateString.substring(0, 4), 10);
    const m = parseInt(localDateString.substring(5, 7), 10) - 1;
    const d = parseInt(localDateString.substring(8, 10), 10);
    return new Date(y, m, d, 0, 0, 0).toISOString();
  }
```

You can now test the client. After logging in as d.peters@leiden.nl you should see the the
DayTotalsPerEmployee list. If you search for start.after = 2019/17/09 some
day totals should show up. Check if selecting and unselecting an Employee works.
Test if selecting a date below 'To' works as expected. Click on an hourglass link
of an item with Count 2 to see the Hours registrations that where added up.

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter10-react 
```
will compare your own version with code one of chapter10-react. You may also add the path
to a folder of file to make the diff more specific.

You have finished the tutorial. Congratulations!
