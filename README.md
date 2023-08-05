Chapter 3: Localization - Next.js client
========================================

The environment is the same as in the chapter2-next branche, except:
- instructions from README.md of chapter2-next where applied,
- instructions from README.md of chapter3-api where applied,
- folder pwa/messages was added with dutch message translation files.

This chapter adds Localization and Internationalization.

React Intl library<a name="ReactIntl"></a>
------------------
Unfortunetly date and number formatting historcally has not been a strong point of javascript.
But times are changing, date and time inputs became available with html 5 and many modern browsers now support
enough formatting to scaffold localized code that works on most modern browsers.

For translation of messages standardization is under way but not yet implemented in most browsers.
Therefore we either need to use a library or create some custom components.
In combination with some polyfills this could in term become a simple solution without
external dependencies, but it would not be a react-style solution. Most developers
would therefore prefer to use some library with better support for react.

The downside is that the choice of a library is necessarily opiniated.
The [React Intl](https://formatjs.io/docs/react-intl/) library was chosen for the react branches
because:
- it is the most popular internationalization library
- it uses the standard Intl components available in most browsers and node.js,
  making it relatively lightweight without depending on an external (hosted) api
- it uses polyfills and a pre standard component (ECMA-402)

For Next.js it could make sense to use the even lighter [Next Intl](https://github.com/amannn/next-intl)
library but that would allow little reuse from the react branches.
Futhermore it claims to be a hooks-only API and hooks only work in
function components, not in classes. This places limits on the
app design that can be easily avoided.

To install the library:
```shell
docker compose exec pwa pnpm add react-intl
```

To let Next.js know that we want to use [Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing)
insert the following to pwa/next.config.js just above the last accolade:
```javascript
  i18n: {
    locales: ['en', 'nl'],
    defaultLocale: 'en',
  },
```
This tells the router which locales to support and what the default locale will be. Because
there are no domains defined the router will use sub-paths for all but the default locale.
So the welcome page in dutch will be at https://localhost/nl.

All React Intl components need to know the locale and the FormattedMessage components need
translations for their messages. For this you need to wrap either the entire application or each page in an
IntlProvider or RawIntlProvider component. In this tutorial the latter is used because
the intl object is also needed outside of React components and each page is wrapped because
it allows to include only the messages needed by the specific page.

First create a new file intlProvider.ts in folder pwa/utils with the following content:
```javascript ts
import { createIntl, createIntlCache } from "react-intl";

interface ReadonlyDictionary {
  readonly [index: string]: string;
}
interface Messages {
  readonly [index: string]: ReadonlyDictionary;
}

function getMessages(locale: string, messages: Messages) {
  if (messages[locale] !== undefined) {
    return messages[locale];
  }
  return messages[locale.substr(0, 2)];
}

const cache = createIntlCache();

export default function initIntl(
  locale: string | undefined,
  messages: Messages
) {
  return createIntl(
    {
      locale: locale ?? "en",
      messages: getMessages(locale ?? "en", messages),
    },
    cache
  );
}
```

Then in pages/index.tsx import the RawIntlProvider component,
the intlProvider utility functions and the message translations by adding:
```javascript tsx
import createIntl from '../utils/intlProvider';
import {RawIntlProvider} from 'react-intl';

// import common_en from '../messages/common-en';
import common_nl from '../messages/common-nl';
const messages = {
  en: {}, // {...common_en,},
  nl: {...common_nl,}
}
```
(the message files for English will be generated later so for now
their import is turned into comment).

Then in the same file replace:
```javascript tsx
const Welcome = () => {
```
by:
```javascript tsx
const Welcome = ({locale, }) => {
  const intl = createIntl(locale, messages);
```
and right below:
```javascript tsx
  return (
```
add:
```javascript tsx
    <RawIntlProvider value={intl}>
```
and replace the corrsponding ); above `const HelpButton` by:
```javascript tsx
    </RawIntlProvider>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {locale,}
  };
```
You also need to add an import for the GetStaticProps type:
```javascript tsx
import { GetStaticProps } from "next";
```
You may have noticed that a property locale was added to the Welcome function
and a getStaticProps function was exported to pass on the locale.

The messages folder already contains the necessary files.
The way messages are loaded is the simplest thing that could possibly work: include them
from javascript files.

If your application needs to enable many languages, consider to store
the messages per language in a json file that is fetched from the server.

Before you test the Welcome page you are advised to restart docker compose so that
the Next.js router gets reinitialized. You should see no difference, just
test it to make sure no errors occur.

Translating the Navigation<a name="Navigation"></a>
--------------------------
Once the IntlProvider is in place you can add translation to the Navigation component
(pwa/components/Navigation.tsx). Add the following import:
```javascript tsx
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
```

Then in the render method the button has a title defined like this:
```javascript tsx
                        title="Toggle navigation" 
```
Replace it by:
```javascript tsx
                        title={<FormattedMessage id="navigation.toggle" defaultMessage="Toggle navigation"/>}
```
You can do the same with the NavLinks, they become:
```javascript tsx
          <NavLink href="/" content={ this.props.intl.formatMessage({id:"navigation.home", defaultMessage:"Home"}) } basePath={basePath} />
          <NavLink href="/employees/" content={ this.props.intl.formatMessage({id:"navigation.employees", defaultMessage:"Employees"}) } basePath={basePath} />
          <NavLink href="/hourss/" content={ this.props.intl.formatMessage({id:"navigation.hours", defaultMessage:"Hours"}) } basePath={basePath} />
```

This adds the components for the translation to your Navigation component but
the translations of each of the messages still needs to be added to the messages files.
For Dutch edit the file pwa/messages/common-nl.ts and add:
```javascript ts
    "navigation.toggle": "Toon/verberg navigatie",
    "navigation.home": "Start",
    "navigation.employees": "Medewerkers",
    "navigation.hours": "Uren"
```
For English the messages will be added to pwa/messages/common-en.ts after the
they have been generated.

To test it point your browser at https://localhost/nl/

If you implemented the IntlProvider and FormattedMessage calls correctly you should see the menu:
Home Employees Hours
(The messages for English are missing but the defaults are correct).

But if your browsers language is set to Dutch you should be redirected to https://localhost/nl
and see:
Start Medewerkers Uren

However, if you make your browser window small enough or zoom in far enough, it will
be replaced by a single button. This is correct, but the title of the button (shown
when you hover the mouse pointer over the button) now is:
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
```javascript tsx
export default withRouter(Navigation);
```
at the bottom of the Navigation.tsx file by:
```javascript tsx
export default withRouter(injectIntl(Navigation));
```

In the method 'render' replace the FormattedMessage object:
```javascript tsx
                        title={<FormattedMessage id="navigation.toggle" defaultMessage="Toggle navigation"/>}
```
by the following function call:
```javascript tsx
                        title={ this.props.intl.formatMessage({id:"navigation.toggle", defaultMessage:"Toggle navigation"}) }
```

If you test the application again, the [object Object] should be replaced by "Toggle navigation" (English)
or "Toon/verberg navigatie" (Dutch).


Combining two HOCs with typescript
----------------------------------
The Navigation component should now work in the development environment, but when
you try to compile it with
After running
```shell
docker compose exec pwa pnpm next build
```
You will get an error message like:
```
Failed to compile.

./components/Navigation.tsx:66:36
Type error: Property 'intl' does not exist on type 'Readonly<NavigationProps> & Readonly<{ children?: ReactNode; }>'.

  64 |         <div></div>
  65 |         <button className="navbar-toggler" type="button"
> 66 |                 title={ this.props.intl.formatMessage({id:"navigation.toggle", defaultMessage:"Toggle navigation"}) }
     |                                    ^
  67 |                 onClick={this.toggleCollapsed.bind(this)}>
  68 |           <span className="navbar-toggler-icon"></span>
  69 |         </button>
error Command failed with exit code 1.
```
What happens here is that injectIntl outputs a Higher Order Component (HOC)
wrapping Navigation that will pass an extra property 'intl' to the Navigation constructor.
But typescript does not know becuase the interface NavigationProps does not declare it.
Adding another property seems easy enough, but what should be its type?
This is why WrappedComponentProps was imported. It is an interface that adds an extra 'intl' prop.
The interface for the NavigationProps can extend it so that
we can use both the 'router' prop and the 'intl' prop in the Navigation:
```javascript tsx
interface NavigationProps extends WrappedComponentProps {
  router: NextRouter,
};
```

When you compile again the error disappeas, but another one surfaces:
```
Failed to compile.

./components/Navigation.tsx:82:27
Type error: Argument of type 'FC<WithIntlProps<any>> & { WrappedComponent: ComponentType<any>; }' is not assignable to parameter of type 'NextComponentType<NextPageContext, any, WithRouterProps>'.
  Type 'FC<WithIntlProps<any>> & { WrappedComponent: ComponentType<any>; }' is not assignable to type 'FunctionComponent<WithRouterProps> & { getInitialProps?(context: NextPageContext): any; }'.
    Type 'FC<WithIntlProps<any>> & { WrappedComponent: ComponentType<any>; }' is not assignable to type 'FunctionComponent<WithRouterProps>'.
      Types of property 'propTypes' are incompatible.
        Type 'WeakValidationMap<WithIntlProps<any>>' has no properties in common with type 'WeakValidationMap<WithRouterProps>'.

  80 | }
  81 | 
> 82 | export default withRouter(injectIntl(Navigation));
     |                           ^
  83 | 
error Command failed with exit code 1.
```

The HOC from injectIntl is passed to withRouter that wraps it once again to pass the
extra property 'router' to its constructor resulting in <WithRouterProps>.
The injectIntl HOC can pass <any> properties from its own consructor so it should work,
but typescript does not like it because <any> has no properties in common with type <WithRouterProps>.

We can swap both functions:
```javascript tsx
export default injectIntl(withRouter(Navigation));
```
but when you try to compile this you will get another error:
```
Failed to compile.

./components/Navigation.tsx:82:27
Type error: No overload matches this call.
Overload 1 of 2, '(WrappedComponent: ComponentType<WrappedComponentProps<"intl">>, options?: Opts<"intl", false>): FC<WithIntlProps<WrappedComponentProps<"intl">>> & { ...; }', gave the following error.
Argument of type 'ComponentType<ExcludeRouterProps<any>>' is not assignable to parameter of type 'ComponentType<WrappedComponentProps<"intl">>'.
Type 'ComponentClass<ExcludeRouterProps<any>, any>' is not assignable to type 'ComponentType<WrappedComponentProps<"intl">>'.
Type 'ComponentClass<ExcludeRouterProps<any>, any>' is not assignable to type 'ComponentClass<WrappedComponentProps<"intl">, any>'.
Construct signature return types 'Component<ExcludeRouterProps<any>, any, any>' and 'Component<WrappedComponentProps<"intl">, any, any>' are incompatible.
The types of 'props' are incompatible between these types.
Type 'Readonly<ExcludeRouterProps<any>> & Readonly<{ children?: ReactNode; }>' is not assignable to type 'Readonly<WrappedComponentProps<"intl">> & Readonly<{ children?: ReactNode; }>'.
Property 'intl' is missing in type 'Readonly<ExcludeRouterProps<any>> & Readonly<{ children?: ReactNode; }>' but required in type 'Readonly<WrappedComponentProps<"intl">>'.
Overload 2 of 2, '(WrappedComponent: ComponentType<WrappedComponentProps<"intl">>, options?: Opts<"intl", true>): ForwardRefExoticComponent<Omit<PropsWithChildren<WrappedComponentProps<"intl">>, "intl"> & { ...; } & RefAttributes<...>> & { ...; }', gave the following error.
Argument of type 'ComponentType<ExcludeRouterProps<any>>' is not assignable to parameter of type 'ComponentType<WrappedComponentProps<"intl">>'.

80 | }
81 |
> 82 | export default injectIntl(withRouter(Navigation));
|                           ^
83 |
error Command failed with exit code 1.
```

Looks intimidating, but the problem is basically the same: typescript does not like it because
<any> has no properties in common with <intl>. After a lot of searching and investigation
i could still not find a solution, until tried this:
```javascript tsx
const navWithRouter: any = withRouter(Navigation);
export default injectIntl(navWithRouter);
```
It says to typescript to handle the result of withRouter as type any.
I guess this kind of disables type checking, which isn't elegant,
and if Navigation needed properties to be passed through
typescript might not signal if some are missing or wrongly typed,
so if you know a better solution please share it.

Now the app should compile, but there will be errors while next.js is collecting page data.
These will be addressed in the next paragraph.

BTW, after compiling the development environment may produce an error if you try to visit a page.
If you stop and restart docker compose the error should disappear.


Scaffolding<a name="Scaffolding"></a>
------------------------------------

You probably have noticed that the code generated by the client generator has its
limitations. Of course it is only scaffolding, iow it is not meant to produce
a complete and production ready application. However, it may be worthwhile to spend some time
to improve the scaffolding to save time on application development, especially
on repetitive tasks of fixing lots of details. Internationalization and Localization
typically involves lots of details and much of it is simple enough to be
included in scaffolding. A fork of the client generator was adapted
with [branch tutorial-chapter3](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter3)
for rescaffolding the client in this branch.

The following improvements are made:
- make input type="date" and "time work properly in Chome and Firefox
- make replace input type="dateTime by "datetime-local"and make it work properly in chrome
- make input type="number" work correctly in Firefox and Chrome
- format dates, times, datetimes, numbers in local format and datetimes in time zone
  in components List and Show
- call i18n functions for field and column labels and client-side (error) messages
- use i18n to represent booleans in component List and Show
- message translation files are generated
- several generic components and utils are generated.
- Bug fixed: when reference contains invalid iri or item not found "An Error occured" was
  shown to the user. Now dataAccess fetch prefers status over status over errorMessage
  if no violations a usefull error message is shown to the user. Also impoves error
  when item to delete does not exist.
- Bug fixed: Router push after submit pointed to "/{{{name}}}" instead of /{{{lc}}}s"
- Bug fixed: ReferenceLinks Props items name type caused
  "Type error: Type '{ href: string; name: string | undefined; }' is not assignable to type 'string | string[] | { href: string; name: string; } | { href: string; name: string; }[]'.
  Type '{ href: string; name: string | undefined; }' is not assignable to type 'string'.
  "
  now allows undefined
- Bug fixed: Entity properties are typed Date wile they actually hold strings.

In order to re-generate the components of the client application you first need to delete
sub folders "employee" and "hours" and "common" of the components and
the sub folders "employees" and "hourss" of the pages folders
with all the files they contain. Do not delete the admin folder.
Delete the utils and types folders.

To make the client generator available you can git clone its repo. For example into
the parent folder of the main folder of the tutorial:
```shell
cd ..
git clone https://github.com/metaclass-nl/client-generator.git
git checkout tutorial-chapter3-next
```
This should have created a folder client-generator as sybling of the main folder of the tutorial.
To make it available inside the pwa container in docker-compose.override.yml below:
```yaml
    volumes:
      - ./pwa:/srv/app
```
add:
```yaml
      - ../client-generator:/srv/app/client-generator:rw
```
Then stop and restart docker compose.

In order to run the client generator you need to run commands inside the
client-generator folder. Docker compose can not do that but docker itself can.
But for docker exec you need to know the name of the container. It can be found
in the output of docker compose up. Look shorly below the docker compose up command
for something like:
Starting api-platform-tutorial-pwa-1      ... done
The name after "Starting " is the name of the pwa container. Copy it to the clipboard
and past it in the following replacing api-platform-tutorial-pwa-1:
```shell
docker exec -w /srv/app/client-generator api-platform-tutorial-pwa-1 yarn install
```
then run it. This should install the node packages needed by the client generator into its
node_modules folder.

Then to compile the client generator replace api-platform-tutorial-pwa-1 and run:
```shell
docker exec -w /srv/app/client-generator api-platform-tutorial-pwa-1 yarn run build
```

To actually run the client generator do the same with:
```shell
docker exec -w /srv/app/client-generator api-platform-tutorial-pwa-1 ./lib/index.js --generator next http://caddy /srv/app
```

This should generate a new client that supports Localization and Internationalization
with new utils, common components and a new messages files. If you are on Linux
you probably want to chown everything that was generated to your own user.

After generation you need to once again add the extra s in pwa/components/hours/Form.tsx
under Formik (..) onSubmit= (..) onSuccess: (..), it does:
```javascript tsx
                router.push("/hours");
```
After adding the extra s you can try the client out at https://localhost/hourss.


You can also uncomment the import of the Englisch messages in pwa/pages/index.tsx
and replace {} by the commented code behind it to include them. To enable
the dutch messages in the other pages you need to edit pwa/messages/employee_all.ts
and add
```javascript ts
import common_nl from './common-nl';
import employee_nl from './employee-nl';
```
Then below
```javascript ts
// add objects with ...importedconstant for other languages below
```
add
```javascript
    nl: {...common_nl, ...employee_nl},
```
Do something similar with hours_all.ts.

For the english messages of the Navigation component
edit the file pwa/messages/common-en.ts and add:
```javascript ts
    "navigation.toggle": "Toggle navigation",
    "navigation.home": "Home",
    "navigation.employees": "Employees",
    "navigation.hours": "Hours"
```

You can test the application on https://localhost/.

Before you can test the types you need to remove the volume you added to docker-compose.override.yml,
otherwise pnpm may try to build the templates in pwa/client-generator. Their merge codes are not valid
typescript and will cause errors to be reported. Then restart docker compose and run:
```shell
docker compose exec pwa pnpm next build
```

Confirm there are no more type errors.

After this the development environment may produce an error if you try to visit a page.
If you stop and restart docker compose the error should disappear.

Scaffolded components<a name="Scaffolded"></a>
---------------------

There are too many details in the generated code to be described here.
Please use git to compare the newly generated components and the
ones from chapter 1 and 2, for example from the pwa folder:
```shell
git diff chapter2-next ./components/employee/Show.tsx
```

The output will include:
```javascript tsx diff
+  const title = intl.formatMessage({
+    id: "employee.show",
+    defaultMessage: "Show {label}",
+  }, { label: employee && employee["@id"] }
+    );
```
This is an example of the formatMessage function that returns the translation for "employee.show". The @id of the employee is passed as parameter "label" wich replaces the {label} placehoder in the message text from the translation file.

Another way translations is done is by a FormattedMessage component:
```javascript tsx diff
-        {"< Back to list"}
+        {"< "}<FormattedMessage id="backToList" defaultMessage="Back to list" />
```
This one does not take any argument but you can pass arguments through the values property like:
```javascript tsx diff
values={{ label: employee && employee["@id"] }}
```

Extracted component<a name="Extracted"></a>
--------------------

To make the scaffolded code more DRY a component was factored out of the templates.
It is used in Form.tsx components, for example in the hours Form:
```javascript jsx
            <FormRow
              name="nHours"
              label={
                <FormattedMessage id="hours.nHours" defaultMessage="nHours" />
              }
              type="number"
              placeholder={intl.formatMessage({
                id: "hours.nHours.placeholder",
                defaultMessage: "number of hours",
              })}
              render={(field) => <input step="0.1" {...field} />}
              format={inputLoc.formatNumber}
              normalize={inputLoc.normalizeNumber}
            />
```
It replaces a complete form row and implements formatting and normalization.
The render property is not required, but a function can be passed that renders the
input component. In this case it is used to add a property "step".


Custom Intl Components, input formatting and time zones<a name="CustomComponents"></a>
-------------------------------------------------------
The React Intl library has components FormattedDate, FormattedTime and FormattedNumber.
The reaction of these components to missing data is logical from the point of view of
the formatting tasks, but not very practical from the point of view of an application
developer. This is solved by pwa/components/common/intlDefined.tsx. It containes
some simple custom components that wrap those from React Intl and render null
if the property "value" is undefined. Furthermore, components
for rendering Booleans, DateTimes, local Dates and local Times where added.

The code scaffolded by the custom templates described below only uses formatting
components imported from this file and input and normalization functions provided
in a util file: utils/inputLocalization.ts.

Doctrine populates properties with column type="date" and "time" with instances
of DateTime or DateTimeImmutable. Those with type="date" get time 00:00 added,
those with type="time" are dated 1970-01-01. API Platform serializes them in the
time zone of the server (or UTC?) but without complete datetime information
conversion to and from local time is impossable. Therefore inputLocalization
does not convert them, and thus assumes the date part of date properties and
time part of time properties to be in local time. To get corresponding dates and
times outside input elements FormattedLocalTime and FormattedLocalDate are used.

A problem with server side rendering is that the time zone of the user is not known
and because server side rendering typically happens when the user comes from outside
the app or statically, sending the time zone from the app will not help. Consequently
on the server the time zone of the node.js server is used for FormattedDateTime and
the time zone identifier is rendered behind it. Not ideal but it is a
limited problem because the page will be re-rendered on the client as soon as the
javascript is fully operational.

For input localization rendering the time zone identifier would
not work as the input can not process the time zone, so by default nothing is
rendered on the server (for SEO you may choose to render the datetime from the api directly).


Customizations<a name="Customizations"></a>
--------------
With the scaffolding the Navigation you may have added to the PageList components was lost.
To add them again:
```javascript tsx
import Navigation from "../Navigation";
```

Then modify the return statement of the PageList function:
```javascript tsx
  return (
    <RawIntlProvider value={intl}>
      <div>
        <Navigation/>
// ...
```

When you tested the application in Dutch, you may have noticed that the day property of
Hours entities is still in English. This could have been solved at the server because the server
does know the locale, but it wasn't. It can also be solved on the client by formatting the
weekday from the property start. In components/hours/List.tsx and Show.tsx replace:
```javascript jsx
{hours['day']}
```
by:
```javascript jsx
<defined.FormattedLocalDate value={hours['start']} weekday="short"/>
```


Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter4-next 
```
will compare your own version with code one of chapter4-next. You may also add the path
to a folder of file to make the diff more specific (A few customazations where made to
the employee-en and hours-en messages files that where not described in this readme).

After committing your changes check out branch chapter4-api.
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-api)
and follow the instructions.
