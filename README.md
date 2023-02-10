Chapter 1: Employee base - Next.js client
=========================================

This chapter adds the user interface for an entity class Employee.

The environment is the same as in the chapter1-api branche, except:
- instructions from README.md of chapter1-api where applied.

To test the client point your browser to https://localhost/. Make a security exception for
the self-signed certificate. You may have to do this every time after you
have closed the browser. You should then see the welcome screen with title "Tutorial API Platform".

! If you did not apply the instructions from README.md of chapter1-api
yourself, you do need to go back to branch chapter1-api and apply
the instuction to add  the [DoctrineFixturesBundle](https://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html).
You can install it from the command line:
```shell
docker-compose exec php composer req --dev orm-fixtures
```
After switching back to this branch restart docker-compose to apply the migrations.
Finally apply the DataFixtures by:
```shell
docker-compose exec php bin/console doctrine:fixtures:load
```

Next.js client<a name="Client"></a>
--------------
To scaffold (generate code) files for the client for the new Employee class, you can
type at the command prompt:

```shell
docker-compose exec pwa generate-api-platform-client --generator next
```

If you refresh https://localhost/ you will see nothing has changed.
This is because the client generator does not adapt pwa/pages/index.tsx. We will do so in chapter2.
For now to test the generated client point your browser to https://localhost/employees.
You should see something like [Employees list](resources/Employees.png)

The following files are generated under pwa/pages/employees:
- index.tsx
- create.tsx
- \[id\]/index.tsx
- \[id\]/edit.tsx

Please take a look at each of these files to see the Next.js pages
that where generated. As you can see all pages have a static method
getInitialProps. This is the old equivalent of [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering). 
It makes Next.js render the page on the server if a browser retrieves the page 
from outside the client app. To make the page interactive
the equivalent javascripts are then retrieved and run in the browser.

Each of the pages uses the type pwa/types/Employee.ts. 
Furthermore under pwa/components/employee the following components where generated:
- Form.tsx
- List.tsx
- Show.tsx

All are functional components. List.tsx is interesting because it uses Link from Next.js. This takes care
of the dynamic retrieval of the linked page as a javascript update and render it client side. 
The javascript updates may even be preloaded. If you close the browser and restart it, then open the Web Developer tools 
and select the Network tab, then go to https://localhost/employees you will see a lot is being retrieved. 
But when you click on a link in the Employee list only some small updates may be retrieved and 
the Employee data is fetched from the api.

Form.tsx is interesting because it contains a form that is managed by [Formik](https://formik.org/). 
This kind of replaces Redux Form, of course without the use of Redux. 
If you don't know it you are advised to [give its tutorial a quick read](https://formik.org/docs/tutorial).

You may already have noticed Redux is not used in the generated client at all. 
Instead async await is used combination with try catch and the errors thrown from 
the fetch function from pwa/utils/dataAccess.ts. 

Furthermore the following generics where generated:
- pwa/components/common/ReferenceLinks.tsx takes care of rendering multiple links
- pwa/types/Collection.ts contains the type for PagedCollection according to the Hydra collections retrieved from the api
- pwa/utils/dataAccess.ts retrieves data from the api.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter2-next ./pwa
```
will compare your own version with code one of chapter2-next. You may also extend the path
to a folder of file to make the diff more specific. There may also be differences because the 
client generator is under development and you may have used a newer version then the 
one used when the tutorial was made.

After committing your changes check out branch chapter2-api.
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-api)
and follow the instructions.
