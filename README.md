Chapter 1: Employee Registration - Angular Client
=================================================

The environment is te same as in the chapter1-api branche, except:
- instructions from README.md of chapter1-api where applied,
- an extra container named "angular" has been added that runs the Angular.io 
  development server on port 4200,
- api/docker/caddy/Caddyfile was augmented to route client requests to the http server
  of the angulart container. Probably only works in development mode.
- Boottrap and Font Awesome where added to package.json and Angular was configured 
  to make them available in the app   

This chapter adds the user interface for an entity class Employee.

More information on installing and running the tutorial see [the main branch]( https://github.com/metaclass-nl/tutorial-api-platform).

In order to activate the new angular container you need to check out this branch and restart docker compose.
To test it point your browser to https://localhost/. Once you made the 
security exception for the self signed https certificate you should see the
welcome screen with title "Tutorial API Platform". Click on "Angular Web App"
to try out the user interface for Employee in its current state.

! If you did not apply the instructions from README.md of chapter1-api
yourself, you do need to go back to branch chapter1-api and apply
the instuction to add  the [DoctrineFixturesBundle](https://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html).
You can install it from the command line:
```shell
docker compose exec php composer req --dev orm-fixtures
```
After switching back to this branch restart docker compose to apply the migrations.
Finally apply the DataFixtures by:
```shell
docker compose exec php bin/console doctrine:fixtures:load
```

Example only
------------

This branch contains the chapter1 client for angular.io as an example, there are no step by step instructions in this readme
for developing or generating the client.

