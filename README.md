Chapter 9: Report - Api
=======================

The environment is te same as in the chapter8-api branch, except:
- instructions from README.md of chapter8-api where applied,

This chapter adds an operation that reports totals of hours per Employee per day.


Report model<a name="ReportModel"></a>
============

The report needs to retrieve Hours, probably filtering them by $start and $employee.
Then in should group them by $employee and the day in which they fall and for each group
instantiate DayTotalsPerEmployee and set $employee, $hours and the DateTime $from.
The DayTotalsPerEmployee will calculate:
- DateTime $to (24 hours after $from),
- $total Total of hours,
- $onInvoice Total of hours on invoice
- $fractionBilled $onInvoice / $total
- $count Number of Hours registrations in the group.\

The report has the limitation that is assumes that Hours registrations do not span day limits.
If an Employee starts to work one day and stops the next day, the registration counts
fully for the totals of the day Hours::$start falls in.

Create new folder Model in api/src/ and in there a file DayTotalsPerEmployee.php with the following:
```php
<?php

namespace App\Model;

use ApiPlatform\Metadata\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\Employee;
use App\Entity\Hours;

/**
 * Totals per day per Employee
 */

class DayTotalsPerEmployee
{
    /** @var Employee
     */
    #[Groups(["day_totals_per_employee"])]
    private $employee;

    /** @var \DateTime
     */
    #[Groups(["day_totals_per_employee"])]
    private $from;

    /** @var Hours[] */
    private $hours = [];

    /**
     * @return Employee
     */
    public function getEmployee(): Employee
    {
        return $this->employee;
    }

    /**
     * @param Employee $employee
     * @return DayTotalsPerEmployee
     */
    public function setEmployee(Employee $employee): DayTotalsPerEmployee
    {
        $this->employee = $employee;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getFrom(): \DateTime
    {
        return $this->from;
    }

    /**
     * @param \DateTime $from
     * @return DayTotalsPerEmployee
     */
    public function setFrom(\DateTime $from): DayTotalsPerEmployee
    {
        $this->from = $from;
        return $this;
    }

    /**
     * @return string
     */
    #[Groups(["day_totals_per_employee"])]
    #[ApiProperty(identifier: true)]
    public function getId()
    {
        return $this->employee->getId(). '_'. $this->from->format('Y-m-d H:i:s');
    }

    /**
     * @return string
     */
    #[Groups(["day_totals_per_employee"])]
    #[ApiProperty(iris: ['http://schema.org/name'])]
    public function getLabel()
    {
        return $this->employee->getLabel(). ' '. $this->from->format('Y-m-d');
    }

    /**
     * @return \DateTime
     * @throws \Exception
     */
    #[Groups(["day_totals_per_employee"])]
    public function getTo()
    {
        $result = clone $this->from;
        $result->add(new \DateInterval('P1D'));
        return $result;
    }

    /**
     * @return Hours[]
     */
    public function getHours(): array
    {
        return $this->hours;
    }

    /**
     * @param \App\Entity\Hours $hours
     * @return $this
     */
    public function addHours(Hours $hours)
    {
        $this->hours[] = $hours;
        return $this;
    }

    /**
     * @return int
     */
    #[Groups(["day_totals_per_employee"])]
    public function getCount()
    {
        return count($this->getHours());
    }

    /**
     * @return float|int
     * @throws \Exception
     */
    #[Groups(["day_totals_per_employee"])]
    public function getTotal()
    {
        $result = 0;
        foreach ($this->getHours() as $hours) {
            $result += $hours->getNHours();
        }
        return $result;
    }

    /**
     * @return float|int
     * @throws \Exception
     */
    #[Groups(["day_totals_per_employee"])]
    public function getOnInvoice()
    {
        $result = 0;
        foreach ($this->getHours() as $hours) {
            if ($hours->isOnInvoice()) {
                $result += $hours->getNHours();
            }
        }
        return $result;

    }

    /**
     * @return float|int|null
     * @throws \Exception
     */
    #[Groups(["day_totals_per_employee"])]
    public function getFractionBilled()
    {
        if ($this->getTotal() == 0) return null;
        return $this->getOnInvoice() / $this->getTotal();
    }
}
```

The group day_totals_per_employee will be used for serializing the report.
As you can see the $hours themselves will not be serialized but the $employee will.
To include the $label of the Employee add "day_totals_per_employee" to the Groups
attribute of the ::getLabel function of Employee, resulting in:
```php
    #[Groups(["employee_get", "employee_list", "hours_get", "hours_list", "day_totals_per_employee"])]
```

Extra Operation<a name="ExtraOperation"></a>
===============
Because the operation should return an array of DayTotalsPerEmployee it seems logical to
make DayTotalsPerEmployee an ApiResource. However, this creates a problem with the filters:
they must filter Hours, not DayTotalsPerEmployee. It is possible to wrap them*, but simpeler is
to add an extra collection operation to the Hours resource.

But wait a minute, didn't the API Platform Documentation page on [Creating Custom Operations and Controllers](https://api-platform.com/docs/core/controllers/) discourage using custom controllers with API Platform? True, but a custom
controller is not required, only an extra operation and a custom DataProvider! And it also says "For most use cases, better extension points, working both with REST and GraphQL, are available" referring to the [General Design Considerations](https://api-platform.com/docs/core/design/) page wich in turn refers to [Extending API Platform](https://api-platform.com/docs/core/extending/) where the first extension point is "Data Providers".

To create an extra operation without a custom controller, in api/src/Entities/Hours.php in the ApiResource attribute below
```php
        new Post(securityPostDenormalize: 'is_granted(\'ROLE_ADMIN\') or object.getEmployee().getUser() == user'),
add the following lines:
```php
        new GetCollection(uriTemplate: '/hours/dayreport',
            output: DayTotalsPerEmployee::class,
            normalizationContext: ['groups' => ['day_totals_per_employee']],
            paginationEnabled: false,
            provider: DayTotalsPerEmployeeCollectionProvider::class)
```
The method is GET so this operation will behave just like the built-in collectionOperation "get", except for: 
- the path being "/hours/dayreport", 
- the normalization will use the day_totals_per_employee group,
- there will be no pagination
- the state will be provided by DayTotalsPerEmployeeCollectionProvider.


State Provider<a name="StateProvider"></a>
=============
A custom state provider should fetch the hours according to filters speficied in the query string.
Then in should group them by $employee and the day in which they fall and for each group
instantiate DayTotalsPerEmployee and set $employee, $hours and the DateTime $from.

The  API Platform Documentation contains an example of a [Custom State Provider](https://api-platform.com/docs/core/state-providers/#state-provider) that also provides state for a GetCollection operation, but it does not use Doctrine. Beacause 
we placed the operation on Hours it's easy to use a decorated version of the the built-in Collection Data Provider.

Create a new folder State in api/src and add a file DayTotalsPerEmployeeCollectionProvider.php with the following content:
```php
<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Hours;
use App\Model\DayTotalsPerEmployee;

class DayTotalsPerEmployeeCollectionProvider implements ProviderInterface
{
    /** @var ProviderInterface */
    private $dataProvider;

    /**
     * DayTotalsPerEmployeeCollectionProvider constructor.
     * @param ProviderInterface $dataProvider The built-in orm CollectionDataProvider of API Platform
     */
    public function __construct(ProviderInterface $dataProvider)
    {
        $this->dataProvider = $dataProvider;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $resourceClass = $operation->getClass();
        if (!isset($context["filters"]["start"]["after"]) && !isset($context["filters"]["start"]["strictly_after"])) {
            $context["filters"]["start"]["after"] = date('Y-m-dTH:i:s', strtotime("-1 week"));
        }

        $hours = $this->dataProvider->provide($operation, $uriVariables, $context);

        $afterTime = isset($context["filters"]["start"]["after"])
            ? strtotime($context["filters"]["start"]["after"])
            : strtotime($context["filters"]["start"]["strictly_after"])+1;

        $totals = [];
        /** @var Hours $item */
        foreach ($hours as $item) {
            $startTime = $item->getStart()->getTimestamp();
            $dayIndex = floor(($startTime - $afterTime) / 86400);
            $key = str_pad($dayIndex, 9, '0', STR_PAD_LEFT)
                .  '_' . $item->getEmployee()->getLabel(). $item->getEmployee()->getId() ;
            if (isset($totals[$key])) {
                $totals[$key]->addHours($item);
            } else {
                $from = new \DateTime();
                $from->setTimestamp($afterTime + 86400 * $dayIndex);
                $total = new DayTotalsPerEmployee();
                $total->setEmployee($item->getEmployee())
                    ->addHours($item)
                    ->setFrom($from);
                $totals[$key] = $total;
            }

        }
        ksort($totals);

        return $totals;
    }
}
```
This adds a default for filter start[after] that only cicks in if start[strictly_after] is also not specified.
Its value is the start of the day (UTC) one week ago. Then it delegates the building and execution of the query to the
decorated DataProvider.

The rest of ::getCollection calculates $afterTime from the filter values mentioned above,
then loops through the resulting Hours and calculates
$dayIndex as the number of whole days the Hours started since $afterTime. If a DayTotalsPerEmployee not yet exists for
this $dayIndex and the $employee of the Hours, it creates it.
The Hours are added to the $hours of the DayTotalsPerEmployee.
Finally the resulting array of DayTotalsPerEmployee is sorted by its keys, resulting in
an ascending order by $dayIndex and within that an ascending order by Employee label.

The new service may work out of the box, but with API Platform Core 2.6 it did not,
the concrete built-in ApiPlatform\Doctrine\Orm\State\CollectionProvider service had to be injected by its service name. 
Before Symfony had auto wirering this was a common problem, usually solved by searching the configuration files. 
Those of api platform happen to be in api/vendor/api-platform/core/src/Symfony/Bundle/Resources/config so it 
helps to search all files in there for 'CollectionProvider'. In doctrine_orm.xml the following configuration is found:
```xml
        <service id="api_platform.doctrine.orm.state.collection_provider" class="ApiPlatform\Doctrine\Orm\State\CollectionProvider" public="false">
            <argument type="service" id="api_platform.metadata.resource.metadata_collection_factory" />
            <argument type="service" id="doctrine" />
            <argument type="tagged" tag="api_platform.doctrine.orm.query_extension.collection" />

            <tag name="api_platform.state_provider" priority="-100" key="ApiPlatform\Doctrine\Orm\State\CollectionProvider" />
            <tag name="api_platform.state_provider" priority="-100" key="api_platform.doctrine.orm.state.collection_provider" />
        </service>
        <service id="ApiPlatform\Doctrine\Orm\State\CollectionProvider" alias="api_platform.doctrine.orm.state.collection_provider" />
```
This looks good, it is the right class and it is specific to doctrine orm. To try it please add the following to api/config/services.yaml:
```yaml
    'App\State\DayTotalsPerEmployeeCollectionProvider':
        arguments:
            $dataProvider: '@api_platform.doctrine.orm.state.collection_provider'
```

When you start the Docker container again you should get no more errors. You can try out the operation in the swagger ui at https://localhost/docs, there is a new GET operation /hours/dayreport. After logging in (see the readme.md of
[branch chapter7-api](https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter7-api)
fill in 2019-09-18T00:00:00 for start[after] and hit Execute. You should then get a response like:
```json
{
  "@context": "/contexts/Hours",
  "@id": "/hours/dayreport",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@type": "DayTotalsPerEmployee",
      "@id": "/.well-known/genid/49b43631c45f162dbb08",
      "employee": {
        "@id": "/employees/19",
        "@type": "Employee",
        "label": "Eden, Nicky"
      },
      "from": "2019-09-18T00:00:00+00:00",
      "id": "19_2019-09-18 00:00:00",
      "label": "Eden, Nicky 2019-09-18",
      "to": "2019-09-19T00:00:00+00:00",
      "count": 2,
      "total": 8,
      "onInvoice": 8,
      "fractionBilled": 1
    },
    {
      "@type": "DayTotalsPerEmployee",
      "@id": "/.well-known/genid/107513e1c5e9a8b7535e",
      "employee": {
        "@id": "/employees/17",
        "@type": "Employee",
        "label": "Horlings, John"
      },
      "from": "2019-09-18T00:00:00+00:00",
      "id": "17_2019-09-18 00:00:00",
      "label": "Horlings, John 2019-09-18",
      "to": "2019-09-19T00:00:00+00:00",
      "count": 1,
      "total": 4,
      "onInvoice": 0,
      "fractionBilled": 0
    },
    {
      "@type": "DayTotalsPerEmployee",
      "@id": "/.well-known/genid/265c89025e59ae3b462f",
      "employee": {
        "@id": "/employees/19",
        "@type": "Employee",
        "label": "Eden, Nicky"
      },
      "from": "2019-09-20T00:00:00+00:00",
      "id": "19_2019-09-20 00:00:00",
      "label": "Eden, Nicky 2019-09-20",
      "to": "2019-09-21T00:00:00+00:00",
      "count": 1,
      "total": 8,
      "onInvoice": 8,
      "fractionBilled": 1
    }
  ],
  "hydra:totalItems": 3,
  "hydra:view": {
    "@id": "/hours/dayreport?start%5Bafter%5D=2019-09-18T00%3A00%3A00",
    "@type": "hydra:PartialCollectionView"
  },
    (...)
```

Openapi docs<a name="SwaggerDecorator"></a>
============

If you scroll back the Swagger UI to the start of the operation /hours/dayreport you will see that
despite the configuration
```php class @ApiResource
"output"=DayTotalsPerEmployee::class,
```
it did not pick up the class comment of DayTotalsPerEmployee "Totals per day per Employee"
but still shows the class comment of Hours "Registration of time worked by an Employee".
Also the openapi documentation at https://localhost/docs.json under paths./hours/dayreport.get.summary is still
"Registration of time worked by an Employee". There are several other places with a description about /hours/dayreport that
do not reflect the output being DayTotalsPerEmployee.

Adding the following to the ApiResource attribute of Hours, operation new GetCollection(uriTemplate: '/hours/dayreport',
```php
            openapiContext: [
                'summary' => 'Totals per day per Employee',
                'description' => 'Days start at time of start[after] filter',
            ]
```

This fixes the summary and description of the operation in the Swagger UI. Also the openapi documentation at https://localhost/docs.json under paths./hours/dayreport.get.summary and description should be correct. 
But under paths./hours/dayreport.get.responses.200.description it is still "Hours collection".
This could be solved by adding the following under the operations openapiContext:
```php
                'responses' => [
                    '200' => ['description' => 'DayTotalsPerEmployee collection response']
                ]
```
But this removes  paths./hours/dayreport.get.responses.200.content entirely! It probably would work to
add an entire content to the array under '200' but that is quite some work and not very DRY.

Luckily the API Platform documentation once had an example of [Overriding the OpenAPI Specification](https://api-platform.com/docs/core/swagger/#overriding-the-openapi-specification) by creating a SwaggerDecorator service.
Add a new folder Swagger to api/src and create a file SwaggerDecorator.php with the following content:

```php
<?php

namespace App\Swagger;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class SwaggerDecorator implements NormalizerInterface
{
    private $decorated;

    public function __construct(NormalizerInterface $decorated)
    {
        $this->decorated = $decorated;
    }

    public function normalize($object, string $format = null, array $context = [])
    {
        $docs = $this->decorated->normalize($object, $format, $context);

        // Set by operation openapiContext:
        // $docs['paths']['/hours/dayreport']['get']['summary'] = 'Totals per day per Employee';
        // $docs['paths']['/hours/dayreport']['get']['description'] = 'Days start at time of start[after] filter';

        $summary = $docs['paths']['/hours/dayreport']['get']['summary'];
        $docs['paths']['/hours/dayreport']['get']['responses']['200']['description'] = 'DayTotalsPerEmployee collection response';

        $responseContent = $docs['paths']['/hours/dayreport']['get']['responses']['200']['content'];
        $this->setByRef($docs, $responseContent['application/ld+json']['schema']['properties']['hydra:member']['items']['$ref'],
            'description', $summary);
        $this->setByRef($docs, $responseContent['application/json']['schema']['items']['$ref'],
            'description', $summary);

        return $docs;
    }

    public function supportsNormalization($data, string $format = null)
    {
        return $this->decorated->supportsNormalization($data, $format);
    }

    private function setByRef(&$docs, $ref, $key, $value)
    {
        $pieces = explode('/', substr($ref, 2));
        $sub =& $docs;
        foreach ($pieces as $piece) {
            $sub =& $sub[$piece];
        }
        $sub[$key] = $value;
    }
}
```
To configure the service add the following to api/config/services.yaml:
```yaml
    'App\Swagger\SwaggerDecorator':
        decorates: 'api_platform.openapi.normalizer.api_gateway'
        arguments: [ '@App\Swagger\SwaggerDecorator.inner' ]
        autoconfigure: false
```

If you retrieve https://localhost/docs.json again all descriptions about the /hours/dayreport operation should be adapted,
including those under components.schemas.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter10-api 
```
will compare your own version with code one of chapter10-api. You mau also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter9-react,
restart docker-compose, point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter9-react)
and follow the instructions. Or if you only follow the api branches: you have finished the tutorial. Congratulations!
