<h1>MetaClass' Tutorial API Platform</h1>

[API Platform](https://api-platform.com) is quite well documented, but the documentation
is stuctured according to the components and features of api-platform, not to the tasks 
of building an actual application. This tutorial takes you step by step through the process 
of building a simple application with api platform and the react client generator.

Chapters and branches
---------------------
1. Employee base [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-react) [next](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-next)
2. Hours registration [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-react) [next](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-next)
3. Localization and Internationalization [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-react) [next](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-next)
4. Labels and Entity Select [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-react) [next](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter4-next)
5. Search [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-react)
6. Sorting and Custom Filter [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-react)
7. Authentication (JWT) [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-react)
8. Authorization [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-react)
9. Report [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-react)
10. End [api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter10-api) [react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter10-react)

Each chapter has one 'api' branch in git, one 'react' branch and some also a 'next' branch.
The 'api' branches only contain api code, the 'react' and 'next' branches
contain both api code and react/next code. If you are only interested in the api side
you can skip the react and next branches. The api branches only use the Swagger UI
and curl for testing and do not depend on react or next.

Each branch builds on top of the previous one of the same type.
Each client branch also contains the code from the corresponding 'api' branch.
To see the code resulting from a branch you can check out
the next branch of the same type, or browse it on github.
Or better: let git compare your current code with the branch
of the next chapter so that you can see the differences right away.

In addition to this tutorial an [extended client generator for react and next.js](https://github.com/metaclass-nl/client-generator)
is available that puts what you have learnt into use for scaffolding your own application.

As of api-platform version 2.6 the standard distribution contains a next.js client
instead of the react client. This tutorial has next.js branches and an extended client generator for the first 4 chapters only.

Required knowledge
------------------
- maybe docker and docker-compose
APi branches:
- PHP 7 or 8
- Symfony 5
- Doctrine ORM
React branches:
- ES6
- React.js
- Redux
- React Router
Next branches:
- ES6
- Next.js
- React.js
Angular example branches:
- ES6
- Angular.io

You don't need to be an expert in these domains, basic working experience should be enough. 

Requirements
------------
The master branch that was checked out when cloning the repository contains
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
with the instructions you commit your changes and check out a client branch: chapter1-react or chapter1-next,
select it in your browser as well, etc. Then follows chapter2-api, chapter2-react etc.  
If you only want to do the api branches you can skip the client ones.  

But you can start with any branch by checking it out and following its instructions.
However, if you skip a chapter you need to restart docker-compose
to apply the migrations. Then apply the DataFixtures by:
```shell
docker-compose exec php bin/console doctrine:fixtures:load
```                     
For a next branch you may also need to update yarn:
```shell
docker-compose exec pwa yarn install
```                     
Wait for yarn or npm to complete, then (for next replace client by pwa):
```shell
docker-compose exec pwa yarn update
```         
For a react branch you may also need to update npm:
```shell
docker-compose exec pwa npm install
```
Wait for yarn or npm to complete, then:
```shell
docker-compose exec client npm update
```  
With chapter 4 react/next and higher if you still get an error on missing react-intl, 
you may need to add react-intl


About the admin interface
-------------------------
Api platform is a very powerfull framework, but i's aproach to application
development (if you use doctrine or ElasticSearch) is still revolutionary:
Instead of developing your own controllers, services and a user interface on top of
an existing framework, you only supply the domain classes (Entities) and some configuration
and the framework supplies default behavior for the api. Then you then you adapt
(decorate, extend, override) it to suit your needs.

With proper training this approach gives high productivity and great flexibility,
but is tends to have a steep leaning curve. Api platform is quite well documented,
but the documentation is stuctured according to the components and features
of api-platform, not to the tasks of building an actual application.

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

This tutorial currently only supports the api core, the (scaffolded) React client 
user interface and some chapters about the (scaffolded) Next.js client user interface. 
The angular.io branches are still under development and currently only contain code and no instructions.

This distribuition is only for educational purposes and will not be updated frequently. 
If you want to run a client container for react or angular within the standard distribution of 
api platform you are advised to create your own fork and add a similar container there
yourself. You will need to keep your fork up to date yourself. For most of it you can pull 
updates from Api Platform, but they will not supply updates for your client container, 
you will need to maintain it yourself, especially its package.json. You also need to
maintain yourself any generated code as well as any components from the tutorial that you use. 
Old software versions are prone to have known security vurnerabilities but new versions need to 
be tested with your application before use in production.


Credits
-------

The tutorial and examples are copyright (c) [MetaClass ](https://www.metaclass.nl/), Groningen, 2019-2021. [MetaClass](https://www.metaclass.nl/) offers software development and support in the Netherlands for Symfony, API Platform, React.js and Next.js

The tutorial is based the [Api Platform Distribution](https://api-platform.com/docs/distribution/)
and Api Platform core version 3.0, created by [Kévin Dunglas](https://dunglas.fr). 


Contribution
------------
Ideas and bug reports are welcome. 

Please fork the repository and add tutorial branches there 
for some other client (generation) platform or the admin component, 
then send a merge request. 

However, api platform and the client platforms are changing constantly. Even though
the tutorial is for educational purposes only, 
at some point you may need to update your branches to keep them up to date and
working. Please do not request the merging of code that you are not 
willing to maintain. Abandoned branches that are no longer functional 
or have security issues may be removed. 

When you open a Pull Request to this repository, you agree to license the (changes to the)
code that is subject to the pull request under the MIT license.
