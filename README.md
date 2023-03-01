Chapter 1: Employee base
========================

This chapter adds the user interface for an entity class Employee.

The environment is the same as in the chapter1-api branche, except:
- client container with create-react-app was added. It is much like the one that was
  in the standard distribution 2.5;
- api/docker/caddy/Caddyfile was augmented to route client requests to the http server 
  of the client container. Probably only works in development mode;
- instructions from README.md of chapter1-api where applied.

In order to activate the new client container you need to restart docker compose. 
To test it point your browser to https://localhost/. You should see the 
welcome screen with title "Tutorial API Platform".

! If you did not apply the instructions from README.md of chapter1-api
yourself, you do need to go back to branch chapter1-api and apply
the instruction to add  the [DoctrineFixturesBundle](https://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html).
You can install it from the command line:
```shell
docker compose exec php composer req --dev orm-fixtures
```
After switching back to this branch restart docker compose to apply the migrations.
Finally apply the DataFixtures by:
```shell
docker compose exec php bin/console doctrine:fixtures:load
```


React client<a name="Client"></a>
------------
To scaffold (generate code) files for the client for the new Employee class, you can 
type at the command prompt: 

```shell
docker compose exec client generate-api-platform-client --generator react
```

Please take a look at at least one of the action files and one of the reducer files
to get an idea of what it does.

And under client/src/components/employee:
- Create.js
- Form.js
- index.js
- List.js
- Show.js
- Update.js

Please take a look at each of these files to see the React components 
that where generated. 

This generates the following files under client/src/actions/employee and 
client/src/reducers/employee:
- create.js
- delete.js
- list.js
- show.js
- update.js


To call upon the generated code edit client/src/index.js. Below
```javascript
import Welcome from './Welcome'; 
```

add the following lines:

```javascript
import employee from './reducers/employee/';
import employeeRoutes from './routes/employee';
```

Below /* Add your reducers here */
add the following line:
```javascript
    employee,
```

Below {/* Add your routes here */}
add the following line:
```javascript
        {employeeRoutes}
```



To test the client point your browser at http://localhost/employees/
(including the last slash!). Make a security exception for
the self-signed certificate. You may have to do this every time after you
have closed the browser.

The table that is scaffolded for the list of employees holds a column
for each property of Employee. This was probably done because the scaffolding script
has no way to know what properties are important and which ones can be left out. 
In client/src/components/employee/List.js below  
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
columns address, zipcode, city, and label can be removed.

This will result in the following output on http://localhost/employees/ 

[Employees list](resources/Employees.png)

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff origin/chapter2-react ./client
```
will compare your own version with code one of chapter2-react. You may also extend the path
to a folder of file to make the diff more specific.

After committing your changes check out branch chapter2-api. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-api) 
and follow the instructions.
