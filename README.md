<h1>Tutorial and examples for api-platform</h1>

[API Platform](https://api-platform.com) is an extremely powerfull web framework, but i's aproach to application 
development is still revolutionary: 
Instead of developing your own controllers, services and a user interface on top of 
an existing framework, you only supply the domain classes (Entities) and the framework
generates the first version of the application. Then you then you adapt 
(override, specialize, extend) it to suit your needs. 

With proper training this approach gives high productivity and great flexibility,
but is tends to have a steep leaning curve. Api platform is quite well documented, 
but the documentation is stuctured according to the components and features
of api-platform, not to the tasks of building an actual application. 
 
This tutorial takes you step by step through the process of building 
a simple application with api platform and the react client generator. 
Each chapter has one 'api' branche in git and one 'react' branche. 
The 'api' branches only contain api code, the 'react' branches
contain both api code and react code. 

The tutorial comes with an [extended react client generator](https://github.com/metaclass-nl/client-generator) that puts
what you have learnt into use for scaffolding your own application.

Chapters and branches
---------------------
1. Employee base [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter1-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter1-react) 
2. Hours registration [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter2-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter2-react)
3. Localization and Internationalization [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter3-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter3-react)
4. Labels and Entity Select [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter4-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter4-react)
5. Search [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter5-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter5-react)
6. Sorting and Custom Filter [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter6-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter6-react)
7. Authentication (JWT) [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter7-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter7-react)
8. Authorization (Under development) [api](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter8-api) [react](https://github.com/metaclass-nl/api-platform-tutorial/tree/chapter8-react)

Each branche builds on top of the previous one of the same type. 'react' Branches
also contain the code from the corresponding 'api' branch.  

To see the code resulting from a branch you can check out 
the next branche of the same type. Or better: let git compare your current 
code with the branche of the next branch so that you can see the differences right away.  

You can start with any branch by checking it out and following its instructions.
However, if you skip a chapter you need to restart docker-compose 
to apply the migrations. When swiching back you may have to migrate back to 
the last migration in the branch (replace <version number> with the actual number): 
```shell
docker-compose exec php ./bin/console doctrine:migrations:migrate <version number>
```
Then apply the DataFixtures by:
```shell
docker-compose exec php bin/console doctrine:fixtures:load
```                     
For a react branche you may need to update yarn:
```shell
docker-compose exec client yarn install
docker-compose exec client yarn update
```                     
With chapter 4 react and higher if you still get an error on missing react-intl: 
```shell
docker-compose exec client yarn add react-intl
```


Required knowledge
------------------
- PHP 7
- Symfony 4 or 5
- Doctrine ORM
- ES6
- React.js
- Redux
- React Router
- maybe docker and docker-compose
You don't need to be an expert in these domains, basic working experience should be enough. 

About the admin interface
-------------------------

The tutorial contains instructions with respect to the scaffolded React 'client' 
user interface. The scaffolded React 'client' user interface is simple and insightfull 
as all the code for the basic CRUD operations is generated as-expected,
understanding and adapting it just requires common knowledge of ES6, react and redux
and will add to your general experience with them. 

The 'admin' user interface is based on the abstact user interface [React Admin](https://marmelab.com/react-admin/).
Experience with [phpPeanuts](http://www.phppeanuts.org/) learns that an abstract
user interface add considerably to the steepness of the learning curve. 
Furthermore you will learn mostly about the specifics of React Admin,
and less about building common applications with ES6, react and redux. 

This doesn't mean the admin user interface is not interesting, it is! But for a smaller 
audience of more experienced developers who want to get the most out of api platform.
Therefore branches for the 'admin' user interface are left out for now, maybe they will be added later.

Requirements
------------
The master branche that was checked out when cloning the repository contains
an allmost unmodified (1) Api Platform Distribution. You need [Docker](https://docs.docker.com/install/) 
(recent version with docker-compose) to run it. On Mac, only [Docker for Mac](https://docs.docker.com/docker-for-mac/)
 is supported. Similarly, on Windows, only [Docker for Windows](https://docs.docker.com/docker-for-windows/) is supported. Docker Machine is not supported out of the box.

Limitations
-----------
This is a work in progess. Currently everything needs to be re-tested 
because of the merging of changes from the upstream api platform repository

This tutorial currently only supports the (scaffolded) React client user interface.  

The tutorial does not support installation with Symfony Flex and Composer so you can skip that section 

Install
-------
Clone the tutorials repository using git:
```shell
git clone https://github.com/metaclass-nl/api-platform-tutorial.git
```

Testing your install
--------------------
You may test the installation following the [instructions on the api platform website](https://api-platform.com/docs/distribution/#installing-the-framework).
Just skip the part about downloading and extracting the .tar.gz file and go straight to:
```shell
cd api-platform-tutorial
docker-compose pull # Download the latest versions of the pre-built images
docker-compose up -d # Running in detached mode
```

As we did not install using Symfony Flex and Composer you can skip that section 
and go straight to [It's Ready!](https://api-platform.com/docs/distribution/#its-ready).
Follow the instructions to test the api.

Before you can test the admin or client interface you need to visit https://localhost:8443/
and make a security exception for the self-signed certificate, otherwise its 
XHR requests will be blocked. You may have to do this every time after you
have closed the browser. 

To test the admin interface point your browser at https://localhost:444/. You may need to
make an other security exception.

Credits
-------

The tutorial and examples are copyright (c) [MetaClass](https://www.metaclass.nl/), Groningen, 2019, 2020

It is is based on the [Api Platform Distribution](https://api-platform.com/docs/distribution/)
created by [Kévin Dunglas](https://dunglas.fr). 

 
(1) README.md was changed obviously. Furthermore: .env files from client and admin where 
changed to use http because FireFox CORS did not allow the https requests, i guess because
the certificate of the api is not valid.

Contribution
------------
Ideas and bug reports are welcome. 

Please clone the repository and add branches there 
for some other client (generation) platform there, then send a merge request. 
However, api platform and the client platforms are changing constantly so 
at some point you may need to update your branches to keep them up to date and
working. Abandoned branches that are no longer functional or have security issues
may be removed. 