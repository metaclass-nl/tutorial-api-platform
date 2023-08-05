Chapter 4: Basic User Experience - Next.js client
=================================================

The environment is te same as in the chapter3-react branche, except:
- instructions from README.md of chapter3-next where applied,
- instructions from README.md of chapter4-api where applied,

Though the scaffolding of chapter 3 also improves user experience,
especially of non-english speakers, this chapter covers some
basics, like presenting data in a to the point and meaningfull way,
presenting options together with choices and giving feedback on
actions taken.

<a name="Reference">Embedded objects instead of references</a>
--------------

The Hours List produces the error:
```
TypeError: iri.split is not a function
```
This happens because the api now returns a nested object as the value for
the property employee of Hours that is fed directly to the getItemPath function.
```javascript tsx
                      <ReferenceLinks
                        items={{
                          href: getItemPath(
                            hours["employee"],
                            "/employees/[id]"
                          ),
                          name: hours["employee"],
                        }}
                      />
```
To get rid of the error you need to add ["@id"]:
```javascript tsx
                      <ReferenceLinks
                        items={{
                          href: getItemPath(
                            hours["employee"]["@id"],
                            "/employees/[id]"
                          ),
                          name: hours["employee"]["@id"],
                        }}
                      />
```
This works but it will give a type error because pwa/types/Hours.ts
types the property employee as string while in fact it holds a nested object
with @id and label. To correctly type the property change it in pwa/types/Hours.ts:
```javascript ts
    public employee?: Item,
```

Check the types with
```shell
docker compose exec pwa pnpm next build
```
This will give an error:
```
Failed to compile.

./components/hours/List.tsx:83:29
Type error: Object is possibly 'undefined'.

  81 |                         items={{
  82 |                           href: getItemPath(
> 83 |                             hours["employee"]["@id"],
     |                             ^
  84 |                             "/employees/[id]"
  85 |                           ),
  86 |                           name: hours["employee"]["@id"],
```
Correct, the property employee is defined with a question mark, it may not be there resulting in undefined to be accessed by ["@id"]. Best is not to produce a ReferenceLink if there is no reference:
```javascript tsx
                      {hours["employee"] &&
                        <ReferenceLinks
                          items={{
                            href: getItemPath(
                              hours["employee"]["@id"],
                              "/employees/[id]"
                            ),
                            name: hours["employee"]["@id"],
                          }}
                        />
                      }
```
When you try to build again you get another error:
```
Failed to compile.

./components/hours/Show.tsx:133:17
Type error: Type '{ href: string; name: Item | undefined; }' is not assignable to type 'string | string[] | { href: string; name: string | undefined; } | { href: string; name: string | undefined; }[]'.
  Types of property 'name' are incompatible.
    Type 'Reference | undefined' is not assignable to type 'string | undefined'.

  131 |             <td>
  132 |               <ReferenceLinks
> 133 |                 items={{
      |                 ^
  134 |                   href: getItemPath(hours["employee"], "/employees/[id]"),
  135 |                   name: hours["employee"],
  136 |                 }}
```
Obviously we need to do the same here.

Afterwards there will be no more type errors, but the Employee type has not yet been adapted.
Its property hours is no longer included by the api and should be removed.
This will give new type errors but those will disappear when we remove the code that uses the
property in the next paragraph.

You need to restart docker compose to avoid errors in the dev environment
resulting from the build.

Because the links have been replaced by embedded objects the hours form will no longer work properly. In the Employee input it shows [object Object] instead of the iri of the employee. To repare this change the initialValues:
```javascript tsx
      <Formik
        initialValues={
          hours
            ? {
                ...hours,
              }
            : new Hours()
        }
```
to:
```javascript tsx
      <Formik
        initialValues={
          hours
            ? {
                ...hours,
                employee: hours.employee ? hours.employee["@id"] : "",
              }
            : new Hours()
        }
```
When the form is submitted the reference will be sent to the api, wich is correct. This means that the following interface is wrong:
interface SaveParams {
values: Hours;
}

The following gives the type checker less information but does avoid type errors:
interface SaveParams {
values: FormikValues;
}
(you also need to add this type to the import from formik).

Superfluous columns and fields<a name="Superfluous"></a>
------------------------------
The table that was scaffolded for the list of employees to hold a column
for each property of Employee. This was probably done because the scaffolding script
has no way to know what properties are important and which ones can be left out.
In pwa/components/employee/List.tsx table
columns firstName, lastName, address, zipcode, city, hours are now empty
because the api no longer includes these properties in the list of employees.
They can be removed. The column label can be removed too, because
in paragraph "Labels" you will make the label shown in the first column.

The table that was scaffolded for the list of hours holds a column
for each property of Hours. In pwa/components/hours/List.tsx table
columns onInvoice and label and their column labels can be removed.

The fields that where scaffolded for showing an Employee show the property
hours that is no longer present in the output of the api. It can be removed
from pwa/components/employee/Show.tsx.

The fields that where scaffolded for editing an Employee show the property
hours that is no longer present in the output of the api. It can be removed
from pwa/components/employee/Form.tsx.

The Employee form shows FormRow for the readOnly property label.
It suggests to the user that the label may be entered will be stored but it will not,
this is misleading so it should be removed.

The hours Form shows FormRows for readOnly properties label and day.
They should also be removed.

Labels<a name="Labels"></a>
------

In chapter4-api you added an extra tag at the label property of Employee and Hours:
```php
     * @ApiProperty(iri="http://schema.org/name")
```

To use it you need to adapt the type Item in pwa/types/item.ts:
```javascript ts
export interface Item {
  "@id"?: string;
  label?: string;
}
```

Let's start with pwa/components/employee/List.tsx. Below
```javascript tsx
    <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
```
replace the th id by:
```javascript tsx
              <th><FormattedMessage id="employee.item" defaultMessage="Employee"/></th>
```

employee.item also needs to be added to messages/employee-en.ts:
```javascript ts
  "employee.item": "Employee",
```
and to messages/employee-nl.ts:
```javascript ts
  "employee.item": "Medewerker",
```
Component hours/List.tsx also contains a column id, but here using the label would sort off mess up
the table with too much data in a single column. This can be solved by making the
first column show 'start' instead of @id and reordering the other colums like in:
```javascript tsx
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
          <tr>
            <th>
              <FormattedMessage id="hours.start" defaultMessage="start" />
            </th>
            <th>
              <FormattedMessage id="hours.day" defaultMessage="day" />
            </th>
            <th>
              <FormattedMessage
                id="hours.description"
                defaultMessage="description"
              />
            </th>
            <th>
              <FormattedMessage id="hours.nHours" defaultMessage="nHours" />
            </th>
            <th>
              <FormattedMessage id="hours.employee" defaultMessage="employee" />
            </th>
            <th colSpan={2} />
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          {hourss &&
            hourss.length !== 0 &&
            hourss.map(
              (hours) =>
                hours["@id"] && (
                  <tr className="py-2" key={hours["@id"]}>
                    <th scope="row">
                      <Link href={getItemPath(hours["@id"], "/hourss/[id]")}>
                        <defined.FormattedDateTime value={hours['start']} />
                      </Link>
                    </th>
                    <td><defined.FormattedLocalDate value={hours['start']} weekday="short"/></td>
(..)
```
(You need to reorder the column values correspondingly)

Then there is the link to the employee. Both List.tsx and Show.tsx use a
ReferenceLinks component to render the link. In List.tsx:
```javascript tsx
                      { hours["employee"] && 
                        <ReferenceLinks
                          items={{
                            href: getItemPath(
                              hours["employee"]["@id"],
                              "/employees/[id]"
                            ),
                            name: hours["employee"]["@id"],
                          }}
                        />
                      }
```

To show the more user friendly label pass it as name in both List.tsx and Show.tsx. In List.tsx:
```javascript tsx
                      { hours["employee"] && 
                        <ReferenceLinks
                          items={{
                            href: getItemPath(
                              hours["employee"]["@id"],
                              "/employees/[id]"
                            ),
                            name: hours["employee"]["label"],
                          }}
                        />
                      }
```
the links to employees should show up with the employee label as content and
the id used for the href.

The component employee/Show also shows the id of the employee in its first line. It comes from
the following constant:
```javascript tsx
  const title = intl.formatMessage(
    {
      id: "employee.show",
      defaultMessage: "Show {label}",
    },
    { label: employee && employee["@id"] }
  );
```
You can replace @id by label, resulting in:
```javascript tsx
  const title = intl.formatMessage(
    {
      id: "employee.show",
      defaultMessage: "Show {label}",
    },
    { label: employee && employee["label"] }
  );
```
You can do the same with pwa/pages/employees/[id]/edit.tsx and in
the employee Form component in the topmost formatMessage below return
(employee.update), and "@id" in the onSubmit employee.updated message.

The same can be done with hours/Form but here we have
a problem: the label contains a dateTime in UTC and its format is not localized!
Luckily FormattedMessage can also render components like FormattedDateTime passed as parameter value.
First import the intlDefined components:
```javascript tsx
import * as defined from '../common/intlDefined';
```
Formatting the message:
```javascript tsx
          ? intl.formatMessage(
              { id: "hours.update", defaultMessage: "Edit {start} {description}" },
              { start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"] }
            )
```
Of course you need to adapt the translations in the messages folder accordingly.

The hours.updated message in the onSubmit function is never shown because of the
```javascript tsx
            router.push("/hours");
```
We will get back to that on the section about MessageDisplays.

The hours[id] edit page also contains the hours.show message but if you pass a FormattedDateTime
component as start: it shows up as 'Object'. To work around this change the message id to hours.show.head
resp. hours.update.head and add corrensponding translations to hours.en.ts:
```javascript ts
  "hours.show.head": "Show Hours",
  "hours.update.head": "Edit Hours",
```
and to hours.nl.ts
```javascript ts
    "hours.show.head": "Toon Uren",
    "hours.update.head": "Bewerk Uren",
```

The hours/Show component contains the message twice, once in the head title and once in the h1. For the first one you can adapt
the formatMessage call:
```javascript tsx
  const title = intl.formatMessage(
    {
      id: "hours.show.head",
      defaultMessage: "Show Hours",
    }
  );
```

The last one you can replace with a FormattedMessage component:
```javascript tsx
      <h1 className="text-3xl mb-2">
        <FormattedMessage
          id="hours.show"
          defaultMessage="Show {start} {description}"
          values={ {start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"]} }
        />
      </h1>
```
Please adapt the translations in the messages folder according to the defaultMessage, including hours.updated.


Select<a name="Select"></a>
------

All employee ids are now out of sight except for the text input
in pwa/components/hours/Form.tsx. Here is a simple Select component
that retrieves all Employees, shows their labels and selects the @id:
```javascript tsx
//pwa/src/components/common/SelectItem.tsx
import React, { Component } from "react";
import { fetch } from "../../utils/dataAccess";
import { FormattedMessage } from "react-intl";
import {PagedCollection} from "../../types/collection";
import {Item} from "../../types/item";

interface Props {
  fetchUrl: string;
  labelProp: string;
  required?: boolean;
  input: {
    value: string;
    placeholder?: string;
    name: string;
    required?: boolean;
  };
  meta?: {
    form: string
  };
}
interface State {
  items?: {[key: string]: any}[];
  error?: Error;
}

/**
 * Simple component for selecting items from a dropdown
 * that shows their labels
 */
class SelectItem extends Component<Props, {}> {
  state: State = {};
  mounted = false;

  componentDidMount() {
    this.mounted = true;

    // mounting happens only once per SelectItem per page so no need to useQuery for caching
    fetch<PagedCollection<Item>>(this.props.fetchUrl)
      .then((retrieved) => {
        if (!this.mounted) return; // unmounted before fetch completed

        if (retrieved===undefined) {
          this.setState( {error: new Error("Nothing retrieved")} );
          return;
        }
        const items = retrieved.data["hydra:member"];
        if (!Array.isArray(retrieved.data["hydra:member"])) {
          this.setState({error: new Error("retrieved unexpected "+ typeof items)} );
          return;
        }
        this.setState({ items });
      })
      .catch((e) => {
        if (this.mounted) this.setState({ error: e });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  optionsFromItems() {
    if (this.state.items === undefined) {
      return null;
    }

    const items = this.state.items.map((item) => (
      <option key={item["@id"]} value={item["@id"]}>
        {item[this.props.labelProp]}
      </option>
    ));
    if (!this.isRequired() || !this.props.input.value) {
      items.unshift(
        <option key="" value={undefined}>
          {this.props.input.placeholder}
        </option>
      );
    }
    return items;
  }

  isRequired() {
    return this.props.input.required  === undefined
      ? this.props.required
      : this.props.input.required;
  }

  render() {
    if (this.state.error !== undefined) {
      return <div>{this.state.error.toString()}</div>;
    }
    if (this.state.items === undefined) {
      return (
        <div>
          <FormattedMessage id="loading" defaultMessage="Loading..." />
        </div>
      );
    }
    const id = (this.props.meta ? +this.props.meta.form + "_" : "") +
      this.props.input.name;
    return (
      <select id={id} required={this.props.required} {...this.props.input} >
        {this.optionsFromItems()}
      </select>
    );
  }
}

export default SelectItem;
```
Of course this select has its limitations:
- it does not cache its contents, so the items may be retrieved from the api more often then necessary,
- it does not subscribe with mercure for changes to the items, so they may get outdated,

Both limitations sort of compensate for one another, but it would be nice if it only retrieved items
the user searches for, and displays them 'as you type'. But this would require a more sophisticated widget.

But how can it be rendered? FormRow has a property 'render' that can be passed a function
to actually render the field. In the hours Form it is used with FormRow "nHours"
to render an input with step="0.1":
```javascript tsx
              render={(field) => <input step="0.1" {...field} />}
```
The same way we can render a Select.
In FormRow "employee" below:
```javascript tsx
              required={true}
```
add:
```javascript tsx
              render={(renderProps) => (
                <SelectItem
                  labelProp="label"
                  fetchUrl="/employees?pagination=false"
                  input={renderProps}
                />
              )}
              normalize={(v) => (v ? v : null)}
```
Three properties where added to SelectItem:
- fetchUrl tells the SelectItem where to get its data
- labelProp tells the SelectItem which property to use to represent the entities to the user
- input passes the properties from the FormRow so that the SelectItem can
  pass them on to the actual Select widget. It is done this way
  to retain compatibility with Redux Form Field.
  Then there is a normalize funcion passed that returns null if nothing is selected.
  This is not really necessary as the employee field is required, but
  to make the field work properly under all conditions the normalize function
  is passed anyway. After all you never know if requirements will change
  in the future.

Of course you need to import SelectItem:
```javascript tsx
import SelectItem from '../common/SelectItem';
```
Now if you test the Hours edit page the SelectItem should show up and contain
four options, one for each Employee.

Feedback<a name="Feedback"></a>
--------
If the user submits a Form and a validation error occurs, it is shown in the Form.
But if the submit is successfull the Form redirects to the List page
which does not tell the user that updating or creating was successfull.
The same when an item is deleted. The list appears but no message about the deletion.
This may make the user feel uncertain and maybe kind of ignoored. This is
why User Experience designers usually provide this kind of feedback.

However, with just React and Formik this is not so simple. For the List
to know about what the Form or Show component did they would somehow
have to share some state. The react documentation suggests to push shared
state up, but the List component is not a parent of the Form or Show component,
so the state would have had to be pushed all the way up to [the MyApp component](pwa/pages/_app.tsx).

In the react branch and client generator Redux is used to keep track of all state
in a central store, but that comes with a lot of boilerplate code. This seems
overkill for simply showing some messages from one component in another one.

A simpeler solution would be use a context to communicate the state to some
special MessageDisplay components. But in order to update the context if
a message is sent, the state of MyApp will have to be changed. That leads
to refresh of all components, even those that do not use the context.

This can be avoided by the implementation of
[the publish-subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
that stores the message data and forwards it to the right component. To seperate this concern
from actually showing the message a service class is used.
Make en new folder pwa/services and make mew file MessageService.ts with the following content:
```javascript ts
import React, {FunctionComponent} from 'react'
import { intlFormatted } from "../components/common/intlDefined";

export class MessageData {
  constructor(
    public msg: intlFormatted ,
    public className: string = "",
    public role: string = "alert",
  ) {

  }
}

export interface subscriberFunction {
  (arg0: MessageData | undefined): void
}

/**
 * Service to pass messages to MessageDisplays.
 */
export class MessageService {
  stock: { [topic: string]: MessageData | undefined } = {} ;
  subscribed: { [topic: string]: subscriberFunction[] } = {};

  // Core functions

  /** Stores a function that will be called if a new message arrives.
   * Multiple functions can be subscribed for the same subject so that it will
   * be no problem if subscribtion and unsubscription happens in an unexpected order.
   * @param topic
   * @param subscriber
   */
  subscribe(topic: string, subscriber: subscriberFunction) {
    if (this.subscribed[topic] === undefined) {
      this.subscribed[topic] = [];
    }
    this.subscribed[topic].push(subscriber);;
    // console.debug(topic + " subscribed: " + this.subscribed[topic].length)
  }

  /** Removes a function so that it will no longer be called if a new message arrives.
   * @param topic
   * @param subscriber
   */
  unsubscribe(topic: string, subscriber: subscriberFunction) {
    if (! (topic in this.subscribed)) {
      return;
    }
    const index = this.subscribed[topic].indexOf(subscriber);
    if (index === -1) {
      return;
    }
    this.subscribed[topic].splice(index, 1);
  }

  /**
   * Stores new message data and calls eventual subscriber functions.
   * Existing message data will be replaced.
   * @param topic
   * @param messageData
   */
  set(topic: string, messageData: MessageData | undefined) {
    this.stock[topic] = messageData;
    // console.log(topic + " received " + typeof messageData)

    if (topic in this.subscribed) {
      this.subscribed[topic].forEach( (subscriber) => {
          subscriber(messageData);
          // console.log(topic + " dispatched " + typeof messageData)
        }
      );
    }
  }

  /**
   * Retieves previously stored message data, or undefined if none
   * @param topic
   */
  get(topic: string): MessageData | undefined {
    return this.stock[topic];
  }

  // Convenience functions

  info(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":info"})
  }

  success(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":success"})
  }

  danger(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":danger"})
  }

  warning(topic: string, message: intlFormatted, role: string = "alert") {
    this.set(topic,{
      msg: message,
      role: role,
      className: ":warning"})
  }

  clear(topic: string) {
    this.set(topic, undefined);
  }
}

/**
 * Context that may be used to provide the service to the consuming components.
 *
 * May be used in App to wrap the page Component:
 * <MessageServiceContext.Provider value={msgService}>
 *       <Component {...pageProps} />
 * </MessageServiceContext.Provider>
 * where msgService should contain an instance of MessageService.
 */
export const MessageServiceContext = React.createContext<MessageService | undefined>(undefined);

/**
 * Hook to easily obtain the message service from the above context
 */
export const useMessageService = () => {
  const messageService = React.useContext(MessageServiceContext);

  if (!messageService) {
    throw new Error('No MessageService availabe, use MessageServiceProvider to provide one')
  }

  return messageService;
}
```
As you can see this defines a class for communicating the message data, a function type for subscribing to the service and the Message Service class itself. The service has a pojo "stock" (Plain Old Javascript Object) to keep track of the message data and another to keep track of the subscriber functions. Both are stored by subject so that different kinds (or destinations) of messages are kept apart. Limitation: it only stores a single message for each topic.

The core fuctions are:
- subscribe stores a function that will be called if a new message arrives.
- unsubscribe removes a function so that it will no longer be called if a new message arrives.
- set stores new message data and calls eventual subscriber functions
- get retieves previously stored message data

Then there are some convenience function to send common classes of message data, like succes, warning and danger
and "clear"  to remove eventually stored message data.

To provide the service to the consuming components a context is used, wich is exported as MessageServiceContext.
Additionally a hook "useMessageService" is exported.

The context need to be initialized from pwa/pages/_app.txt. Add the following lines below the existing imports:
```javascript tsx
import { MessageService, MessageServiceContext } from "../services/MessageService";

const msgService = new MessageService();
```
Then wrap the Component tag like this:
```javascript tsx
    <MessageServiceContext.Provider value={msgService}>
      <Component {...pageProps} />
    </MessageServiceContext.Provider>
```

Then the MessageDisplay component. You can paste it in a new file pwa/components/common/MessageDisplay.tsx:
```javascript tsx
import React, { FunctionComponent, useState, useEffect } from "react";
import { MessageService, useMessageService, MessageData, subscriberFunction } from "../../services/MessageService";
import {useRouter} from "next/router";

interface Props {
  topic: string,
  clearOnRouteChange?: boolean,
}

const replaceClassNames: { [toReplace: string]: string } = {
  ":info": "border px-4 py-3 my-4 rounded text-gray-700 border-gray-400 bg-gray-100",
  ":success": "border px-4 py-3 my-4 rounded text-green-700 border-green-400 bg-green-100",
  ":danger": "border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100",
  ":warning": "border px-4 py-3 my-4 rounded text-amber-700 border-amber-400 bg-amber-100",
}


const MessageDisplay: FunctionComponent<Props> = ({ topic, clearOnRouteChange= true}) => {

  const router = useRouter();
  const messageService: MessageService = useMessageService();
  const [messageData, setMessageData] = useState<MessageData | undefined>(messageService.get(topic));

  const receive: subscriberFunction = (messageData) => {
    setMessageData(messageData);
    // console.debug(topic + " received " + typeof messageData);
  }

  useEffect(() => {
      const routeChangeHandler = (url: string) => {
        // console.log(`routing to ${url}`);
        if (clearOnRouteChange) {
          messageService.clear(topic);
        }
      }

      messageService.subscribe(topic, receive);
      router.events.on('routeChangeStart', routeChangeHandler);

      return () => {
        router.events.off('routeChangeStart', routeChangeHandler);
        messageService.unsubscribe(topic, receive);
      }
    },
    [topic, messageService, clearOnRouteChange, router.events]
  );

  const className = messageData
    ? (messageData.className in replaceClassNames
      ? replaceClassNames[messageData.className]
      : messageData.className)
    : undefined;

  return (
    <div>
      {messageData && (
            <div key={topic} className={className} role={messageData.role}>
              {messageData.msg}
            </div>
        )}
    </div>
  );
}

export default MessageDisplay;
```
This component uses an effect to register with the service and unregister on cleanup. It has two properties:
- topic: a string used to get the right messages
- clearOnRouteChange: true if the component should clear if the user navigates away from the current rout.

For the class names used by the convenience functions of MessageService to send common types of message data, like :succes, :warning and :danger, it replaces those class names by the actual tailwind classes to be used.

Let's add a MessageDisplay component to pwa/components/hours/List.tsx.
First it needs to be imported:
```javascript tsx
import MessageDisplay from "../common/MessageDisplay";
```
Then right above the table add:
```javascript tsx
    <MessageDisplay topic="hours" />
```
This makes the component listen to messages under the topic "hours" and
if one is sent, it displays it until a new message is sent or the user leaves the page.

Then in pwa/components/hours/Form.tsx add the same import, as well as:
```javascript tsx
import { useMessageService } from "../../services/MessageService";
```
Then as the first line of in the Form function add:
```javascript tsx
const messageService = useMessageService();
```
In the onsubmit section look for
```javascript tsx
            setStatus({
              isValid: true,
              msg: isCreation
                ? intl.formatMessage(
                    { id: "hours.created", defaultMessage: "Element created" },
                    { label: "Hours" }
                  )
                : intl.formatMessage(
                    {
                      id: "hours.updated",
                      defaultMessage: "Element updated",
                    },
                    { label: values["@id"] }
                  ),
            });
```
This sets a status on the Form, but the user will never see that
because of the call right below it:
```javascript tsx
    router.push("/hours");
```
You can replace the setStatus call by:
```javascript tsx
                messageService.success("hours", (isCreation
                    ? intl.formatMessage(
                      { id: "hours.created", defaultMessage: "Element created" },
                      { label: "Hours" }
                    )
                    : intl.formatMessage(
                      { id: "hours.updated", defaultMessage: "Element updated" },
                      { start: <defined.FormattedDateTime value={hours && hours["start"]} />, description: hours && hours["description"] }
                    ))
                );
```
Notify that the values of the hours.updated message have been replaced similar
to the change made to hours.update in the Labels paragraph above.

Then reload the entire app by pressing the refresh button of the browser.
Now if you edit an Hours item and press the Submit button a green
MessageDisplay should appear in the Hours list. If you go anywhere else and come back it should disappear.

You can adapt the Employee Form accordingly for topic "employee",
and add another MessageDisplay component with this topic to Employee List.

Delete Button<a name="DeleteButton"></a>
-------------
You may have noted that the forms and the Show components contain async functions that
redirect to the List on succes: deletMutation resp. handleDelete. You can make each of these functions
send .deleted messages, but what they do is very similar.
So they are clearly candidates for refactoring, and now we have to make similar changes
to each of them, this is the right time to do it.

Create a file 'DeleteButton.tsx' with the following content:
```javascript tsx
import { FunctionComponent, ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
import { fetch } from "../../utils/dataAccess";
import MessageDisplay from "./MessageDisplay";

interface Props {
  type: string;
  item?: object;
  redirect: string;
  parentTopic: string; // topic of MessageDisplay to show errors and deleting message
  deletedMessage?: string | ReactNode;
}

/** FunctionComponent
 * Meant to be used with MessageDisplay with topic=type to show deleted message
 * and one with topic=parentTopic to show loading and error message
 * @param props
 */
const DeleteButton: FunctionComponent<Props> = ({ type, item, redirect, parentTopic, deletedMessage}) => {
  const intl = useIntl();
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !window.confirm(
        intl.formatMessage({
          id: type + ".delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;

    try {
      let msg: string | ReactNode = intl.formatMessage(
        { id: type + ".deleting", defaultMessage: "Deleting {label}" },
        { label: item["label"] }
      );
      MessageDisplay.send(parentTopic, {
        msg,
        className: "alert alert-info",
      });

      await fetch(item["@id"], { method: "DELETE" });

      msg = deletedMessage ? deletedMessage :
        intl.formatMessage(
        { id: type + ".deleted", defaultMessage: "Item deleted" },
        { label: item["label"] }
      );
      MessageDisplay.send(type, {
        msg,
        className: "alert alert-success",
      });

      router.push(redirect);
    } catch (error) {
      const msg = intl.formatMessage(
        {
          id: type + ".delete.error",
          defaultMessage: "Error deleting: {error}.",
        },
        { error: error.message }
      );
      MessageDisplay.send(parentTopic, {
        msg,
        className: "alert alert-danger",
      });
      console.error(error);
    }
  };

  return (
    <button
      className="btn btn-danger"
      onClick={handleDelete}
      disabled={!item}
    >
      <FormattedMessage id="delete" defaultMessage="Delete" />
    </button>
  );
}

export default DeleteButton

```
It uses some additional translations to be added to employee-en.ts:
```javascript ts
  "employee.deleting": "Deleting {label}",
  "employee.deleted": "{label} deleted.",
```
and to employee-nl.ts:
```javascript ts
    "employee.deleting": "Bezig met verwijderen van {label}",
    "employee.deleted": "{label} is verwijderd.",
```

Import it into the Employee form:
```javascript tsx
import DeleteButton from "../common/DeleteButton";
```
Replace the button whose onClick calls handleDelete by a DeleteButton
```javascript tsx
     {employee && (
        <DeleteButton type="employee" item={employee} redirect="/employees" parentTopic="employee_form" />
      )}
```
The button uses another MessageDisplay for showing a 'deleting' message
and if an error occurs, the error message. Replace the error output:
```javascript tsx
            {error && (
              <div
                className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                role="alert"
              >
                {error}
              </div>
            )}
```
by:
```javascript tsx
            <MessageDisplay topic="employee_form" />
```
Now you van remove the old handleDelete functions as well as the error state:
```javascript tsx
  const [error, setError] = useState(null);
```
The useState function can also be removed from the imports.

Do the same with employee Show using parentTopic "employee_show".

The hours Form and Show components are similar except for
passing a custom deleted message to the button:
```javascript tsx
        <DeleteButton type="hours" item={hours} redirect="/hourss" parentTopic="hours_show" deletedMessage={
          intl.formatMessage(
            { id: "hours.deleted", defaultMessage: "Item deleted" },
            { start: <defined.FormattedDateTime value={hours["start"]} />, description: hours["description"] }
          )
        }/>
```

And the translations in hours-en.ts:
```javascript ts
  "hours.deleting": "Deleting Hours",
  "hours.deleted": "{start} {description} deleted.",
```
and in hours-nl.ts:
```javascript ts
    "hours.deleting": "Bezig met verwijderen van uren",
    "hours.deleted": "{label} is verwijderd.",
```

Scaffolding your own application<a name="Scaffolding"></a>
--------------------------------

Templates that where adapted for the use of labels instead of @ids and a select widget
for a single reference are available in [branch tutorial-chapter4 of
metaclass-nl/client-generator](https://github.com/metaclass-nl/client-generator/tree/tutorial-chapter4).
They are provided for scaffolding your own application
(after scaffolding you still need to make some adaptations manually, for example if the
labels need localization, like those of hours in this chapter).

Be aware that the code scaffolded by these templates needs data from
the api to contain label properties to be typed as http://schema.org/name
and labels of referred entities to be included (possible by serialization groups).
Because the generator only has access to the metadata of the single type for which it is scaffolding,
it assumes all referred types label properties have the same name. If this assumption is wrong
you need to correct the scaffolded code.

Furthermore the MessageService component needs to be imported and provided in
pwa/pages/_app.tsx. Add the following lines below the existing imports:
```javascript tsx
import { MessageService, MessageServiceContext } from "../services/MessageService";

const msgService = new MessageService();
```
Then wrap the Component tag like this:
```javascript tsx
    <MessageServiceContext.Provider value={msgService}>
      <Component {...pageProps} />
    </MessageServiceContext.Provider>
```

Finally, if your application needs the user to edit references to multiple
entities, the scaffolded entryfield will only be usable if you show the @ids
of the entities somewhere in the application, for example in the List component.


Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff chapter5-next 
```
will compare your own version with code of chapter5-react. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter5-api.
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-api)
and follow the instructions.
