<h1>MetaClass' Tutorial API Platform</h1>

[API Platform](https://api-platform.com) is a very powerfull api framework, but i's aproach to application 
development (if you use doctrine or ElasticSearch) is still revolutionary: 
Instead of developing your own controllers, services and a user interface on top of 
an existing framework, you only supply the domain classes (Entities) and some configuration
and the framework supplies default behavior for the api. Then you then you adapt 
(decorate, extend, override) it to suit your needs. 

With proper training this approach gives high productivity and great flexibility,
but is tends to have a steep leaning curve. Api platform is quite well documented, 
but the documentation is stuctured according to the components and features
of api-platform, not to the tasks of building an actual application. 
 
This tutorial takes you step by step through the process of building 
a simple application with api platform and the react client generator. 
Each chapter has one 'api' branche in git and one 'react' branche. 
The 'api' branches only contain api code, the 'react' branches
contain both api code and react code. If you are only interested in the api side 
you can skip the react branches. The api branches only use the Swagger UI
and curl for testing and do not depend on react.  

In addition to this tutorial an [extended react client generator](https://github.com/metaclass-nl/client-generator) 
is available that puts what you have learnt into use for scaffolding your own application.

As of api-platform version 2.6 the standard distribution contains a nextJS client
instead of the react client. This tutorial does not (yet?) have nextJS branches. 

Chapters and branches
---------------------
1. Employee base [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-react) 
2. Hours registration [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-react)
3. Localization and Internationalization [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-react)
4. Labels and Entity Select [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-react)
5. Search [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-react)
6. Sorting and Custom Filter [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-react)
7. Authentication (JWT) [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-react)
8. Authorization [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-react)
9. Report [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-react)
10. End [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter10-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter10-react)

Each branch builds on top of the previous one of the same type. 
Each 'react' branch also contains the code from the corresponding 'api' branch. 
To see the code resulting from a branch you can check out 
the next branche of the same type, or browse it on github. 
Or better: let git compare your current code with the branche 
of the next chapter so that you can see the differences right away.  

After installation and testing (see below), normally you would start with 
checking out branch chapter1-api and point your browser to 
[the same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-api)
to get a nicely rendered version of its readme. When you are finished
with the instructions you commit your changes and check out chapter1-react,
select it in your browser as well, etc. Then follows chapter2-api, chapter2-react etc.
Of course if you only want to do the api branches you can skip the react ones.  

But you can start with any branch by checking it out and following its instructions.
However, if you skip a chapter you need to restart docker-compose 
to apply the migrations. Then apply the DataFixtures by:
```shell
docker-compose exec php bin/console doctrine:fixtures:load
```                     
For a react branche you may also need to update yarn:
```shell
docker-compose exec client yarn install
```                     
Wait for yarn to complete, then:
```shell
docker-compose exec client yarn update
```                     
With chapter 4 react and higher if you still get an error on missing react-intl: 
```shell
docker-compose exec client yarn add react-intl
```

Required knowledge
------------------
- maybe docker and docker-compose
APi branches:
- PHP 7
- Symfony 4 or 5
- Doctrine ORM
React branches:
- ES6
- React.js
- Redux
- React Router
You don't need to be an expert in these domains, basic working experience should be enough. 

Requirements
------------
The master branche that was checked out when cloning the repository contains
an allmost unmodified (1) Api Platform Distribution. You need [Docker](https://docs.docker.com/install/) 
(recent version with docker-compose) to run it. On Mac, only [Docker for Mac](https://docs.docker.com/docker-for-mac/)
 is supported. Similarly, on Windows, only [Docker for Windows](https://docs.docker.com/docker-for-windows/) is supported. 
 Docker Machine is not supported out of the box.
 
(1) README.md was changed obviously and tutorial branches where added. 
To sustain the original order of the doctrine migrations Version20200828181711 was 
replaced by  Version20190819120152 from a previous version of API Platform.


Install
-------
Clone the tutorials repository using git:
```shell
git clone https://github.com/metaclass-nl/tutorial-api-platform.git
```

Testing your install
--------------------
You may test the installation following the [instructions on the api platform website](https://api-platform.com/docs/distribution/#installing-the-framework).
Just skip the part about downloading and extracting the .tar.gz file and go straight to:
```shell
cd tutorial-api-platform
docker-compose pull # Download the latest versions of the pre-built images
docker-compose up -d # Running in detached mode
```

As we did not install using Symfony Flex and Composer you can skip that section 
and go straight to [It's Ready!](https://api-platform.com/docs/distribution/#its-ready).
Follow the instructions to test the api.

To test the admin interface point your browser at https://localhost/admin. 

Getting Started
---------------
To start at the beginning check out branch chapter1-api and point your browser to 
[the same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-api)
to get a nicely rendered version of its readme. When you are finished
with the instructions you commit your changes and check out chapter1-react,
select it in your browser as well, etc. Then follows chapter2-api, chapter2-react etc.  
If you only want to do the api branches you can skip the react ones.  

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
Therefore branches for the 'admin' user interface are left out for now.

Limitations
-----------
This is a work in progess and needs more testing.

This tutorial currently only supports the (scaffolded) React client user interface.  

The tutorial does not support installation with Symfony Flex and Composer so you can skip that section 


Credits
-------

The tutorial and examples are copyright (c) [ MetaClass ](https://www.metaclass.nl/), Groningen, 2019, 2020.

It is is based on the [Api Platform Distribution](https://api-platform.com/docs/distribution/)
created by [Kévin Dunglas](https://dunglas.fr). 


Contribution
------------
Ideas and bug reports are welcome. 

Please fork the repository and add tutorial branches there 
for some other client (generation) platform or the admin component, 
then send a merge request. 

However, api platform and the client platforms are changing constantly so 
at some point you may need to update your branches to keep them up to date and
working. Please do not request the merging of code that you are not 
willing to maintain. Abandoned branches that are no longer functional 
or have security issues may be removed. 

When you open a Pull Request to this repository, 
you agree to license your code under the MIT license.
