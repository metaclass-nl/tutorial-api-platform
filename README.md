Chapter 3: Localization - React client
======================================

The environment is te same as in the chapter2-react branche, except:
- instructions from README.md of chapter2-react where applied
- instructions from README.md of chapter3-api where applied
- templates where adapted to support Internationalization and Localization
- from the templates components/common/EntityLinks, Pagination and ReduxFormRow where extracted
- utils/inputLocalization.js was added
- folder messages with message translation files where added.

This chapter adds Internationalization and Localization

Inernationalization and Localization
------------------------------------

You probably have noticed that the code generated by the client generator has its 
limitations. Of course it is only scaffolding, iow it is not meant to produce
a complete and production ready application. However, it may be worthwhile to spend some time
to improve the scaffolding to save time on application development, especially
on repetitive tasks of fixing lots of details. Internationalization and Localization
typically involves lots of details and much of it is simple enough to be
included in scaffolding. 

The following improvements are made:
- make input type="date" and "time working in Chome and Firefox
- make replace input type="dateTime by "datetime-local"and make it working in chrome
- make input type="number" work correctly in Firefox (and Chrome)
- format dates, times, datetimes, numbers and booleans in local format and time zone 
  in components List and Show
- call i18n functions for field and column labels and client-side (error) messages
- use i18n to represent booleans in component List and Show

React Intl library
------------------
Unfortunetly date and number formatting historcally has not been strong point of javascript.
But times are changing, date and time inputs became available with html 5 and many modern browsers now support 
enough formatting to scaffold localized code that works on most modern browsers. 

For translation of messages standardization is under way but not yet implemented in most browsers. 
Therefore we either need to use a library or create some custom components. 
In combination with some polyfills this could in term become a simple solution without 
external dependencies, but it would not be a react-style solution. Most developers
would therefore prefer to use some library with better support for react.

The downside is that the choice of a library is necessarily opiniated.
The [React Intl](https://formatjs.io/docs/react-intl/) library was chosen because:
- it is the most popular internationalization library
- it uses the standard Intl components available in most browsers, 
  making it relatively lightweight without depending on an external (hosted) api
- it uses polyfills and a pre standard component (ECMA-402)

To install the library:
```shell
docker-compose exec client yarn add react-intl
```
or if you use npm directly:
```shell
docker-compose exec client npm install react-intl --save
```

All React Intl components need to know the locale and the FormattedMessage components need 
translations for their messages. For this you need to wrap the entire application in an
IntlProvider or RawIntlProvider component. Here the latter is used because the intl object
is also needed outside of React lifecycle.

First create a new file intlProvider.js in folder client/src/utils with the following content:
```javascript jsx
import {createIntl, createIntlCache} from 'react-intl';

function getMessages(locale, messages) {
    if (messages[locale]!==undefined) {
        return messages[locale];
    }
    return messages[locale.substr(0,2)];
}

const cache = createIntlCache()

let intl = null;

export function initIntl(locale, messages) {
    intl = createIntl({
        locale: locale,
        messages: getMessages(locale, messages)
    }, cache);
}

export default function getIntl() {
    return intl;
}
```

Then import the RawIntlProvider component, the intlProvider utility functions and the message translations in index.js by adding:
```javascript jsx
import {RawIntlProvider} from 'react-intl';
import getIntl, {initIntl} from './utils/intlProvider';
import messages from "./messages/all";
```

Then in the same file above the render call:
```javascript jsx
    ReactDOM.render(
```
add:
```javascript jsx
    initIntl(navigator.language, messages);
```
This initializes the intl variable in the utils/intlProvider module with a 
react intl object. It can be retrieved from anywhere by calling the getIntl function. The 
rescaffolded reducer functions will use this because, though participating in the React lifecycle,
have little alternative for getting hold of the react intl object.

And inside the render call:
```javascript jsx
  <RawIntlProvider value={getIntl()}>
```
and at the end of the Provider closing tag, replace the comma by a new line with:
```javascript jsx
  </RawIntlProvider>,
```

The messages folder already contains the necessary files to import all messages in english and dutch.
The way messages are loaded is the simplest thing that could possibly work: include them
from javascript files. Webpack will throw them all into the application javascript file. 
This is ok for a small application that needs only a few languages. 

When your application is large and it is loaded in chunks, you probably have separate files withs a Switch for each
chunks routes and could add an extra IntlProvider there that only loads the messages for those routes and the common messages.
You may still have another IntlProvider component wrapping the entire application but it should only load the messages required by
the main application component, probably including those used by the Navigation component.

If your application needs to enable many languages, consider to store the messages per language (and eventually per chunk) in a json file that is fetched from the server. Be aware that when the fetch promise is fulfilled, the RawIntlProvider object has already called getIntl to retrieve the react intl object. When you wrap the RawIntlProvider object in another object, and when the fetch promise gets fulfilled call setIntl again and change the state of the  wrapping object, i guess React will detect that the value property of the RawIntlProvider has changed and rebuild it.

Translating the Navigation
--------------------------
Once the IntlProvider is in place you can add translation to the Navigation component
(client/src/components/Navigation.js). Add the following import:
```javascript jsx
import {FormattedMessage, injectIntl} from "react-intl";
```

Then in the render method the button has a title defined like this:
```javascript jsx
                        title="Toggle navigation" 
```
Replace it by:
```javascript jsx
                        title=<FormattedMessage id="navigation.toggle" defaultMessage="Toggle navigation"/>
```
You can do the same with the NavLinks, they become:
```javascript jsx
                        <NavLink href="/" content=<FormattedMessage id="navigation.home" defaultMessage="Home"/> />
                        <NavLink href="/employees/" content=<FormattedMessage id="navigation.employees" defaultMessage="Employees"/> />
                        <NavLink href="/hours/" content=<FormattedMessage id="navigation.hours" defaultMessage="Hours"/> />
```

This adds the components for the translation to your Navigation component but
the translations of each of the messages still needs to be added to the messages files.
For English edit the file client/src/messages/common-en.js and add:
```javascript
    "navigation.toggle": "Toggle navigation",
    "navigation.home": "Home",
    "navigation.employees": "Employees",
    "navigation.hours": "Hours"
```
For Dutch edit the file client/src/messages/common-nl.js and add:
```javascript
    "navigation.toggle": "Toon/verberg navigatie",
    "navigation.home": "Start",
    "navigation.employees": "Medewerkers",
    "navigation.hours": "Uren"
```
(Alternatively you could give these messages a file of their own and import them in all.js)

To test it point your browser at http://localhost/

If you implemented the IntlProvider and FormattedMessage calls correctly you should see the menu:
 Home Employees Hours

But if you set your browsers language to Dutch you should see:
 Start Medewerkers Uren
(alternatively you can test this by temporarily replacing both occurrences of navigator.language in index.js by "nl-NL")

However, if you make your browser window small enough or zoom in far enough, it will
be replaced by a single button. This is correct, but the title of the button (shown
when yuo hover the mouse pointer over the button) now is:
[object Object]

Looks like the title of the button was not rendered as a react component, but simply
processed as a string. OTOH, the content properties of the Navlink objects where 
properly rendered! Apparently it depends on the internal working of the object 
whose property value is translated whether or not you can simply pass a <FormattedMessage />
object or not. 

Luckily React Intl has an alternative solution: it can inject a property 'intl' holding 
an object that offers imperative functions that return strings directly. This is done by
the injectIntl function that is already in the import statement you added earlier.
To make it work just replace 
```javascript jsx
export default Navigation;
```
at the bottom of the Navigation.js file by:
```javascript jsx
export default injectIntl(Navigation);
```

In because of the option of message extraction create a constant intl in the method 'render'from the properties:
```javascript jsx
    render() {
        const {intl} = this.props;
```

Finally replace the FormattedMessage object:
```javascript jsx
                        title=<FormattedMessage id="navigation.toggle" defaultMessage="Toggle navigation"/>
```
by the following function call:
```javascript jsx
                        title={ intl.formatMessage({id:"navigation.toggle", defaultMessage:"Toggle navigation"}) }
```

If you test the application again, the [object Object] should be replaced by "Toggle navigation" (English) 
or "Toon/verberg navigatie" (Dutch).

Custom Intl Components and input formatting
-------------------------------------------
The React Intl library has components FormattedDate, FormattedTime and FormattedNumber.
The reaction of these components to missing data is logical from the point of view of 
the formatting tasks, but not very practical from the point of view of an application
developer. This can be solved by some simple custom components that wrap those from React Intl 
and render null if the property "value" is undefined. Furthermore, components for rendering Booleans
and DateTimes would be handy too. Create a file intlDefined.js in the 
src/components/common folder and paste the following content:

```javascript jsx
import React from 'react';
import {FormattedMessage, FormattedNumber as IntlFormattedNumber, FormattedDate as IntlFormattedDate, FormattedTime as IntlFormattedTime} from 'react-intl';

/**
 *  Some components that render null if value===undefined
 */

/** If value defined, render localized representation */
export function LocalizedBool(props)
{
    if (props.value===undefined) {
        return null;
    }
    return props.value
        ? <FormattedMessage id="true" defaultMessage={"Yes"}/>
        : <FormattedMessage id="false" defaultMessage={"No"}/>
}

/** Do not render 'NaN' if value===undefined */
export function FormattedNumber(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedNumber {...props}/>;
}

/** Do not format the current date if value===undefined */
export function FormattedDate(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedDate {...props}/>;
}

/** Do not format the current time if value===undefined */
export function FormattedTime(props) {
    if (props.value===undefined) {
        return null;
    }
    return <IntlFormattedTime {...props}/>;
}

/**
 * Allways format both date and time, except:
 * Do not format the current date and time if value===undefined */
export function FormattedDateTime(props)
{
    if (props.value===undefined) {
        return null;
    }
    const extensible = {...props}
    if (props.hour===undefined) {
        extensible.hour = 'numeric';
    }
    if (props.minute===undefined) {
        extensible.minute = 'numeric';
    }
    if (props.year===undefined) {
        extensible.year = 'numeric';
    }
    if (props.month===undefined) {
        extensible.month = 'numeric';
    }
    if (props.day===undefined) {
        extensible.day = 'numeric';
    }
    return <IntlFormattedDate {...extensible}/>;
}
```

The code scaffolded by the custom templates described below only uses formatting 
components imported from this file and input and normalization functions provided 
in a util file: src/utils/inputLocalization.js. 

The util functions are made to work with Firefox and Chrome on linux. If
you find any problems, for example on other browsers and platforms, please 
submit an issue on github. Or better, clone the repo, implement a solution
and file a merge request.


Custom templates
----------------

Implementing Internationalization would require many changes to be made to the
scaffolded code. Luckily the api platform client generator has the undocumented 
feature to allow you to use your own templates. Furthermore, it builds on a generic template
engine that is flexible enough to generate all those different clients that the api platform client 
generator supports. 

In chapter 3 a new set of templates is included that you can use to re-generate the client
application so that it will be internationalized and localized. To see the differences
with the original templates from the api platform client generator you can use git
to compare them with branch chapter2-react. But it is easier to first re-generate the
client application and read 'Understanding the generated code' below.

In order to re-generate the components of the client application you first need to delete
sub folders "employee" and "hours" of the components folders with all the files they contain,
as well as the sub folders "employee" and "hours" of the reducers folder. 

The templates do require an extra template engine plug-in therefore the script generate.js was included. 
To start the generation from the command prompt:
```shell
docker-compose exec client templates/scaffold.js
```

The templates are also available together with the common components and utils/intlProvider.js and english messages templates in
[branch tutorial-chapter3 of
metaclass-nl/client-generator](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter3).

Scaffolded components
---------------------

There are too many details in the generated code to be described here. 
Please use git to compare the newly generated components and the 
ones from chapter 1 and 2, for example from the client folder:
```shell
git diff chapter3-react ./src/components/hours/Show.js
```

The output will include:
```javascript jsx diff
   render() {
@@ -39,11 +43,11 @@ class Show extends Component {
 
     return (
       <div>
-        <h1>Show {item && item['@id']}</h1>
+        <h1><FormattedMessage id="hours.show" defaultMessage="Show {label}" values={ {label: item && item['@id']} }/></h1>
```

As you can see the content of the H1 tag is replaced by a FormattedMessage object. 
In the translation {label} is replaced by the value of the 'label property of the object
that was passed through the "values property of FormattedMessage.

The output also includes:
```javascript jsx diff
-                <th scope="row">nHours</th>
-                <td>{item['nHours']}</td>
+                <th scope="row"><FormattedMessage id="hours.nHours" defaultMessage="nHours"/></th>
+                <td>
+                    <defined.FormattedNumber value={item['nHours']}/>
+                </td>
               </tr>
```

Except for another FormattedMessage a FormattedNumber replaces the unformatted {item['nHours']} 
that is now passed to the property 'value'.'

The FormattedNumber function was imported to constant 'defined' by the import statement that was added near the top of the file:
```javascript jsx diff
+import * as defined from '../common/intlDefined';
```

Extracted components
--------------------

To make the scaffolded code more DRY some components where factored out of the templates. 

The output of git diff chapter3-react ./src/components/hours/Show.js also includes:
```javascript jsx diff
               <tr>
-                <th scope="row">employee</th>
-                <td>{this.renderLinks('employees', item['employee'])}</td>
+                <th scope="row"><FormattedMessage id="hours.employee" defaultMessage="employee"/></th>
+                <td><EntityLinks type="employees" items={item['employee']} up={true} /></td>
               </tr>
```

The EntityLinks component replaces the renderLinks method that was generated for each Show.js 
component as well as the renderLinks method that was generated for each List.js component. 
It is imported by the import statement added near the top of the file:
```javascript jsx diff
+import EntityLinks from '../common/EntityLinks';
```

In List.js components that are scaffolded another component from src/components/common is used:
```javascript jsx
<Pagination retrieved={this.props.retrieved} />
```
It replaces the navigation method that was generated for each List.js component. 

In the Form.js components that are scaffolded third component from src/components/common is used:
```javascript jsx
    renderField = data => {
      return <ReduxFormRow {...data} apiError={this.props.error}/>;
    }
```
It replaces the implementation of the renderField method that was generated for each Form.js component.

If you want to use the templates for scaffolding for your own application you need to copy the src/components/common
 folder with all its files to your own application as well as the src/utils/inputLocalization.js 
 file imported by the scaffolded Form.js components. And of course you will need to supply the necessary 
 message translations to the IntlProvider component. Those translation files are not scaffolded, 
 you can either create them manually or try the [Message Extraction Tools](https://formatjs.io/docs/react-intl/#message-extraction) 
 from formatjs.

Customizations
--------------

When you tested the application in Dutch, you may have noticed that the day property of
Hours entities is still in English. This could have been solved at the server because the server
does know the locale, but it wasn't. It can also be solved on the client by formatting the
weekday from the property start. In components/List.js and Show.js replace:
```javascript jsx
{item['day']}
```
by:
```javascript jsx
<defined.FormattedDate value={item['start']} weekday="short"/>
```

