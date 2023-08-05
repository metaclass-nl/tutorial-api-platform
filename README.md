Chapter 5: Search - Api
=======================

The environment is te same as in the chapter4-api branche, except:
- instructions from README.md of chapter4-api where applied

This chapter adds search filters for simply searching for Hours
with fields that contain or are equal to the values in the form.

ApiFilter<a name="ApiFilter"></a>
---------
First add some imports to api/src/Entity/Hours.php:
```php
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
```

The search form should contain all persistent properties of
Hours except id and onInvoice. It should also contain the
job of the related employee.

Most of this can be implemented by adding the folowing ApiFilter attributtes
to the Entity class Hours:
```php
#[ApiFilter(filterClass: SearchFilter::class, properties: ['description' => 'ipartial', 'employee' => 'exact', 'employee.job' => 'ipartial'])]
class Hours
```
This way "description" and "employee.job" will be searched case insensitive for the
specified substring anywhere in the property, but "employee" will be searched for exactly
the specified value.

The property nHours contains floating point numbers. Searching for a rounded value
using SearchFilter may miss some values that differ a little bit due to the imprecise
nature of floating point numbers. It is better to use a RangeFilter:
```php
#[ApiFilter(filterClass: RangeFilter::class, properties: ['nHours'])]
```
This will allow the client to specify a range based on the precision it wants.
For example for searching for 2.2 with a precision of 0.1 the client would
specify "nHours[gte]=2.15&nHours[lt]2.25".

The property start contains datetimes. At the time of writing
SearchFilter probably has a bug leading to an internal server error
"Could not convert PHP value '2020-01-01T00:00:00' of type 'string' to type 'datetime'".
The alternative is to use a DateFilter:
```php
#[ApiFilter(filterClass: DateFilter::class, properties: ['start'])]
```
This will allow the client to specify a range, but it can also
be used to search for an exact value. For example for searching for
"2020-07-08T12:02:00+00:00" the client could specify
"start[before]=2020-07-08T12:02:00+00:00&start[after]2020-07-08T12:02:00+00:00".
Because both explessions are inclusive so only the exact value will match both.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter6-api 
```
will compare your own version with code one of chapter6-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter5-react, restart docker compose
and point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter5-react)
and follow the instructions. Or if you only follow the api branches chapter6-api.
