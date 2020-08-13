Chapter 1: Employee base
========================

The environment is the same as in the chapter1-api branche, except:
- instructions from README.md of chapter1-api where applied

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

This chapter adds the user interface for an entity class Employee.

React client
------------
To scaffold (generate code) files for the client for the new Employee class, you can 
type at the command prompt: 

```shell
docker-compose exec client generate-api-platform-client
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

Before you can test this you need to visit https://localhost:8443/
and make a security exception for the self-signed certificate, otherwise the clients
XHR requests will be blocked. You may have to do this every time after you
have closed the browser. 

To test the client point your browser at https://localhost/employees/
(including the last slash!)

The table that is scaffolded for the list of employees holds a column
for each property of Employee. This was probably done because the scaffolding script
has no way to know what properties are important and which ones can be left out. 
In client/src/components/employee/List.js below  
```javascript jsx
    <table className="table table-responsive table-striped table-hover">
```
columns address, zipcode, city, and label be removed.

This will result in the following output on https://localhost/employees/ 

[Employees list](resources/Employees.png)
