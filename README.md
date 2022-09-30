Chapter 3: Localization - Angular Client
========================================

The environment is te same as in the chapter1-angular branche, except:
- instructions from README.md of chapter2-api and chapter3-api where applied

This chapter adds Internationalization and Localization

More information on installing and running the tutorial see [the main branch]( https://github.com/metaclass-nl/tutorial-api-platform).

In order to activate the new angular container you need to check out this branch and restart docker-compose.
To test it point your browser to https://localhost/. Once you made the 
security exception for the self signed https certificate you should see the
welcome screen with title "Tutorial API Platform". Click on "Angular Web App"
to try out the user interface for Employee in its current state.

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

Under Construction
------------------

This branch will contain a localized and internationalized version of the chapter1 app for angular.io.
Currently only the employee-show and -list components are translated and localized.
Development uses locale nl.
Angulars production apps become available after build and then restart of docker-compose
under https://localhost/angular/

To do: -update, -create and form. The form inputs need localized data in a specific format
(yet to investigate).

Code from chapter2-angular is may be added and localized and internationalized later.

Later the code itself may be replaced by step by step instructions in this readme 
for developing or generating the client. 
