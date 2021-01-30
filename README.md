Chapter 6: Sorting - Api
========================

The environment is te same as in the chapter5-api branche, except:
- instructions from README.md of chapter5-api where applied

This chapter adds filters for sorting and a custom Filter service
for searching with a single text input in several fields.


OrderFilter<a name="OrderFilter"></a>
-----------

For a start add the following import to Employee.php and Hours.php in api/src/Entity:
```php
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
```

Most columns in the Hours list contain values from a single property of Employee.
Column "Employee" contains labels, that are made up from values from two properties of Employee:
lastName and FirstName. Api platform allows the client to specify multiple properties 
for ordering by, so the following annotation should do:
```php comment
 * @ApiFilter(OrderFilter::class)
```
This allows ordering by a combination any properties of the entity. Ordering ascending by
the labels for example can be specified by query string "order[lastName]=asc&order[firstName]=asc".
You can test this at https://localhost/docs 

The Hours list has a column Employee that holds the labels of the referred Employees. Ordering
by these labels can be specified by query string "order[employee.lastName]=asc&order[employee.firstName]=asc".
However, these are not direct properties of Hours so all properties need to be specified in the class comment
of Hours:
```php comment
 * @ApiFilter(OrderFilter::class, properties={"start", "description", "nHours", "employee.firstName", "employee.lastName"})
```

SimpleSearch Filter<a name="SimpleSearchFilter"></a>
-------------------
So far all filters the application uses standard filter services that where included with api platform. 
One limitation of those filter services is that they all combine their query expressions through AND.
For the user of the client application the consequence is that he/she has to choose a property 
in whose input to type the search term. 

SimpleSearch allows the user to type all terms in a single input. 
It searches each term in all properties specified, combining per term the resulting query expressions through OR,
but combining the terms through AND. For an entity to be found it must contain all 
search terms but it does not matter in which of the properties specified.

To do this a custom service is required. In preparation you are advised to read
[Creating Custom Filters](https://api-platform.com/docs/core/filters/#creating-custom-filters) 
in the api platform docs.

To create the class if the filter create a new folder 'Filter' in api/src 
and add a new file SimpleSearchFilter.php with the following content:
```php
<?php

namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;

/**
 * Selects entities where each search term is found somewhere
 * in at least one of the specified properties.
 * Search terms must be separated by spaces.
 * Search is case insensitive.
 * All specified properties type must be string.
 * @package App\Filter
 */
class SimpleSearchFilter extends AbstractContextAwareFilter
{
    private $searchParameterName;

    /**
     * Add configuration parameter
     * {@inheritdoc}
     * @param string $searchParameterName The parameter whose value this filter searches for
     */
    public function __construct(ManagerRegistry $managerRegistry, ?RequestStack $requestStack = null, LoggerInterface $logger = null, array $properties = null, NameConverterInterface $nameConverter = null, string $searchParameterName = 'simplesearch')
    {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);

        $this->searchParameterName = $searchParameterName;
    }

    /** {@inheritdoc} */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, array $context = [])
    {
        if (null === $value || $property !== $this->searchParameterName) {
            return;
        }

        $words = explode(' ', $value);
        foreach ($words as $word) {
            if (empty($word)) continue;

            $this->addWhere($queryBuilder, $word, $queryNameGenerator->generateParameterName($property));
        }
    }

    private function addWhere($queryBuilder, $word, $parameterName)
    {
        $alias = $queryBuilder->getRootAliases()[0];

        // Build OR expression
        $orExp = $queryBuilder->expr()->orX();
        foreach ($this->getProperties() as $prop => $ignoored) {
            $orExp->add($queryBuilder->expr()->like('LOWER('. $alias. '.' . $prop. ')', ':' . $parameterName));
        }

        $queryBuilder
            ->andWhere('(' . $orExp . ')')
            ->setParameter($parameterName, '%' . strtolower($word). '%');
    }

    /** {@inheritdoc} */
    public function getDescription(string $resourceClass): array
    {
        $props = $this->getProperties();
        if (null===$props) {
            throw new InvalidArgumentException('Properties must be specified');
        }
        return [
            $this->searchParameterName => [
                'property' => implode(', ', array_keys($props)),
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Selects entities where each search term is found somewhere in at least one of the specified properties',
                ]
            ]
        ];
    }

}
```
A constructor is included to allow the argument "searchParameterName" to be specified in the @ApiFilter tag. 
The real work is done by ::filterProperty. It explodes the value of the search parameter by a space and
calls ::addWhere for each of the resulting words. The ::addWhere method builds a OR expression adding
a LIKE expression for each property with the same parameter. Finally sets the parameter value to the word urroudend by procent cahracters and puts the entire OR expression between brackets and ANDs that to the QueryBuilder.

The getDescription method returns a description for the "hydra:search" object in the results of the api call.
It appears to have a problem with api platform assuming that each parameter in the query string is applied to a single
property. The SimpleSearch service applies its parameter to ALL of the specified properties, so 
it returns all of them as comma separated list. It is not clear from the api platform documentation
if this is allowed, but it does work and is simply returned in the results of the api call.

Due to the constructor argument "searchParameterName" the service needs configuration in api/config/services.yaml
```yaml
    'App\Filter\SimpleSearchFilter':
        arguments:
            $searchParameterName: 'ignoored'
```
This is a bit strange because the class defines the argument with a default value:
```php
 $searchParameterName = 'simplesearch'
```
but appearently Symfonies autoconfiguration does not use those defaults. The reason
to pass string 'ignoored' is because api platform on its turn does use the default value from
the constructor and ignores the value from the service configuration.

Once the service is in place the entity class Employee can use it:
```php
use App\Filter\SimpleSearchFilter;

```
and in the class comment:
```php comment
 * @ApiFilter(SimpleSearchFilter::class, properties={"lastName", "firstName", "function", "address", "zipcode", "city"}, arguments={"searchParameterName"="search"})
```
This makes the SimpleSearchFilter search in the properties "lastName", "firstName", "function", "address", "zipcode" and "city".
It will look for query parameter "search" instead of the default 'simplesearch'.

You can now test the filter at https://localhost/docs 

One limitation of the SimpleSearchFilter is that it can only search in properties that contain strings.
If you include properties that contain other types of values, it will result in an error like "An exception occurred while executing 'SELECT ...' ' with params ... SQLSTATE[42883]: Undefined function: 7 ERROR:  function lower(time without time zone) does not exist"
(For readability some lengthy pieces where replaced by ...).

Another limitation is that it allways searches case insensitive. Finally it has no default for the properties. If you do not specify any properties it will throw an InvalidArgumentException "Properties must be specified". 

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter7-api 
```
will compare your own version with code one of chapter7-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter6-react and point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter6-react) 
and follow the instructions. Or if you only follow the api branches chapter7-api.
