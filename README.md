Chapter 3: Localization - api
=============================

The environment is te same as in the chapter2-api branche, except:
- instructions from README.md of chapter2-api where applied

This chapter adds Localization.

Hints<a name="Hints"></a>
-----

Most of the work has to be done on the client, but the api can provide some hints
for the client (generator) in the jsonld metadata.

To see the metadata without the hints point your browser at [https://localhost/docs.jsonld](https://localhost/docs.jsonld).
Under property "hydra:supportedClass" at index 0 (@id: "#Employee") 
under its property "hydra:supportedProperty: at index 6 (hydra:title: "birthDate") 
under its property "hydra:property": you find
"range": "xmls:dateTime".
This makes the client generator produce a form with an input type "dateTime" for arrival. But 
according to the ORM the property only contains a date:
```php
     * @ORM\Column(type="date")
'''

In order to get an input type "date", in Entity Employee at the field doc above private $birthDate add:
```php
     * @ApiProperty(
     *     jsonldContext={"@type"="http://www.w3.org/2001/XMLSchema#date"}
     * )
```
You also need to add a use statement for ApiProperty above the class statement:
```php
use ApiPlatform\Core\Annotation\ApiProperty;
```

Now refresh [https://localhost/docs.jsonld](https://localhost/docs.jsonld).
At the same position you should now find
"range": "http://www.w3.org/2001/XMLSchema#date".

To change the corresponding range of property $arrival add the following to its method doc:
```php
     * @ApiProperty(
     *     jsonldContext={"@type"="http://www.w3.org/2001/XMLSchema#time"}
     * )
```

Now refresh [https://localhost/docs.jsonld](https://localhost/docs.jsonld).
Under "hydra:supportedProperty: at index 7 (hydra:title: "arrival") you should now find
"range": "http://www.w3.org/2001/XMLSchema#time".

For more clarity here is the json of the two properties:
```json
{ "@type":"hydra:SupportedProperty",
  "hydra:property":{
    "@id":"#Employee\/birthDate",
    "@type":"rdf:Property",
    "rdfs:label":"birthDate",
    "domain":"#Employee",
    "range":"http:\/\/www.w3.org\/2001\/XMLSchema#date"},
  "hydra:title":"birthDate",
  "hydra:required":true,
  "hydra:readable":true,
  "hydra:writable":true,
  "hydra:description":"Date of birth"},
{ "@type":"hydra:SupportedProperty",
  "hydra:property":{
    "@id":"http:\/\/schema.org\/Time",
    "@type":"rdf:Property",
    "rdfs:label":"arrival",
    "domain":"#Employee",
    "range":"http:\/\/www.w3.org\/2001\/XMLSchema#time"},
  "hydra:title":"arrival",
  "hydra:required":false,
  "hydra:readable":true,
  "hydra:writable":true,
  "hydra:description":"Time the employee usually arrives at work"},
```

Translation of error messages<a name="ErrorMessages"></a>
-----------------------------

All error messages of api platform are in English, but the messages 
from validators can be translated by the translation service of Symfony.
The validation error messages are already available in many languages,
so you will probably not have to create any translation files yourself.

To install the translation service:
```shell
docker-compose exec php composer require symfony/translation
```

The following file will be added, you need to add it to git:
```yaml
# config/packages/translation.yaml
framework:
    default_locale: en
    translator:
        default_path: '%kernel.project_dir%/translations'
        fallbacks:
            - en

```
This activates and configures the translation service. It sets
the default locale to 'en'. 

In order to get the translator to translate to the language of the client 
the locale of the client must be set into the http request before it is processed.
This can be done by adding an Event Subscriber. First create a new folder
'EventSubscriber' in folder api/src. Then add a file LocaleSubscriber.php
to that new folder with the following:
```php
<?php
// api/src/EventSubscriber/LocaleSubscriber.php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $accept_language = $request->headers->get("accept-language");
        if (empty($accept_language)) {
            return;
        }
        $arr = HeaderUtils::split($accept_language, ',;');
        if (empty($arr[0][0])) {
            return;
        }

        // Symfony expects underscore instead of dash in locale
        $locale = str_replace('-', '_', $arr[0][0]);

        $request->setLocale($locale);
    }

    public static function getSubscribedEvents()
    {
        return [
            // must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}
```

It should be picked up automatically by Symfony. You can test it like this:
```shell
curl -X POST "https://localhost/employees" -H  "accept-language: nl-NL" -H  "accept: application/ld+json" -H  "Content-Type: application/ld+json" -d "{\"firstName\":\"abcdefghijklmnopqrstuvwxyz\"}" -k
```

If you still get validation errors in English, make a to change a config file of Symfony
or run 
```shell
docker-compose exec php ./bin/console cache:clear
```

Then try again the curl command.

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter4-api 
```
will compare your own version with code one of chapter4-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter3-react and point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-react) 
and follow the instructions. Or if you only follow the api branches chapter4-api.
