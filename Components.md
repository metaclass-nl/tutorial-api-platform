Generic and example Components
==============================
Back End
--------
- <b>LocaleSubscriber</b>
  [api](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-api/README.md#ErrorMessages)
  <br>Makes the api use the "accept-language" from the client.
- <b>SimpleSearchFilter</b>
  [api](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter6-api/README.md#SimpleSearchFilter)
  <br>Searches multiple mapped properties for any terms typed into a single Textfield
- <b>SwaggerDecorator</b>
  [api](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter9-api/README.md#SwaggerDecorator)
  <br>Corrects the openapi docs for an operation that uses a Custom State Provider

Front End
---------
- <b>AuthController</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter7-react/README.md#Controller)
  <br>Redirects to /login if no JWT token is present
- <b>Custom Intl Components and functions</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-react/README.md#CustomComponents)
  [next](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-next/README.md#CustomComponents)
  [angular](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-angular/angular/src/app/shared/localization.pipes.ts)
  <br>Simplify the handling of missing values, localize and process form values, add localization for some types
- <b>DeleteButton</b>
  [next](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter4-next/README.md#DeleteButton)
  <br>Sends a request to delete an entity to the api and handles the result
- <b>EntityLinks</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-react/client/src/components/common/EntityLinks.js)
  <br>Displays links, each to show an entity
- <b>(Redux)FormRow</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-react/client/src/components/common/ReduxFormRow.js)
  [next](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter4-next/pwa/components/common/FormRow.tsx)
  <br>Specfies a complete form row, including formatting and normalization
- <b>ItemFormController</b>
  [angular](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-angular/angular/src/app/shared/item-form.controller.ts)
  <br>Populates item forms and implements submit
- <b>ItemService</b>
  [angular](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-angular/angular/src/app/shared/item.service.ts)
  <br>Facilitates communication with the api
- <b>SearchTool</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter5-react/README.md#SearchTool)
  <br>Search Controller that also displays the search form. Customized for a specific search form and api operation.
- <b>Login</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter7-react/README.md#Login)
  <br>Redux connected Login Form
- <b>MessageService and Display</b>
  [next](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter4-next/README.md#Feedback)
  [angular](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter1-angular/angular/src/app/shared/message/messages.component.ts)
  <br>Shows messages from one component in another one. Follows the publish-subscribe pattern.
- <b>Pagination</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter3-react/client/src/components/common/Pagination.js)
- <b>Select(Entity)</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter4-react/README.md#Select)
  [next](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter4-next/README.md#Select)
  <br>Select component that retrieves a list of entities from the api, shows their labels and selects the @id.
- <b>ThSort</b>
  [react](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter6-react/README.md#SortHeaders)
  <br>Sorts a table holding a search result by a single click on a table column header.

