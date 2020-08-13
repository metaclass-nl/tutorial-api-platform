Chapter 4: Labels - Api
=======================

The environment is te same as in the chapter3-api branche, except:
- instructions from README.md of chapter3-api where applied

This chapter removes some columns from api lists end adds labels to referred employees.
The client section replaces ids by labels and a select widget

Schema.org/name
---------------
If the user interface an Entity it in fact shows the data from the properties of the entity. 
However, if a property of one entity conaints one or more references to other entities, 
the user interface needs a representation of the Entity itself. That could be a graphical 
representation but to keep things simple the default representation of Entities is textual. 

Currently the user interface uses the @id of the entity, but to most users the @id has little
meaning so they will find it hard to remember the @ids of entities and recognize entities 
by their @ids. Therefore ::getLabel methods where added to both the Employee and Hours class
that return a string to represent the Entity to the user. 

The Api platform Admin component supports these representations when on the 
api a property is configured as the http://schema.org/name type. This can be
done by adding an @ApiProperty tag like this:

```php
    /**
     * Represent the entity to the user in a single string
     * @return string
     * @ApiProperty(iri="http://schema.org/name")
     */
    function getLabel() {
        return $this->getLastName(). ', '. $this->getFirstName();
    }
```

Add this tag to the ::getLabel methods of Employee and Hours classes. 
To Hours class you also need to add a use statement for the tag:
```php
use ApiPlatform\Core\Annotation\ApiProperty;
```

(The getLabel method could have had any name as long as it has the annotation. 
Given the schema.org property is would have been logical to call it getName,
but experience has learnt that that a property 'name' is often already used 
as just another property, while 'label' is usually available)


Serialization groups
--------------------
By default api platform includes all own properties of entities when they are serialized
and only @ids of referred entities. Ids of entities referred to by 1 t m relations are
also included. 

This may be a good choice for generic api's, but from the point of
view of the crud client application some properties will not be shown in lists so
they can be left out from lists. Furthermore it would be nice if the labels 
of referred Employees where included so that the client does not have to fetch them one 
by one. Finally the client never uses collections of entities referred to by 
1 t m relations so they can be left out.

Using serialization groups the serialization can be more taylorized the the
clients that are consuming the api. In this case the crud client application.

Let's start with entity Hours. First add a use statement to make the
@Group annotation available:
```php
use Symfony\Component\Serializer\Annotation\Groups;
```

In order to make api platform use the serialization groups the
@ApiResource annotation needs to be adapted:
```php
 * @ApiResource(attributes={
 *     "pagination_items_per_page"=10,
 *     "order"={"start": "DESC", "description": "ASC"},
 *     },
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"hours_get"}}
 *          },
 *          "patch",
 *          "delete"
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"hours_list"}}
 *          },
 *          "post"
 *     }
 * )
```
This makes api platform use two serialization groups:
- hours_get is usef for getting individual Hours
- hours_list is used for getting collections of Hours
Because the hours_get will include all writable singe value properties
it is not necessary to set normalization contexts for patch, delete and post
(If collection property 'hours' is left out in these operations api platform
does not update their values). 

Then to specify the groups add the following to the comments of properties
$nHours, $start, $description, $employee and to the comments of methods
::getLabel and ::getDay:
```php
     * @Groups({"hours_get", "hours_list"})
```
And add the following to the comment of property $onInvoice:
```php
     * @Groups({"hours_get"})
```

You can test your configuration at https://localhost:8443/ .
When you try out Get /hours there should be response body like:
```json
{
  "@context": "/contexts/Hours",
  "@id": "/hours",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/hours/115",
      "@type": "Hours",
      "nHours": 8,
      "start": "2019-09-20T08:47:00+00:00",
      "description": "architecture for coolkids",
      "employee": {
        "@id": "/employees/55",
        "@type": "Employee",
        "label": "Eden, Nicky"
      },
      "label": "2019-09-20 architecture for coolkids",
      "day": "Fri"
    },
(..)
```
And when you fill out the number from @id from your own response at Get /hours/{id} 
there should be response body like:
```json
{
  "@context": "/contexts/Hours",
  "@id": "/hours/115",
  "@type": "Hours",
  "nHours": 8,
  "start": "2019-09-20T08:47:00+00:00",
  "onInvoice": true,
  "description": "architecture for coolkids",
  "employee": {
    "@id": "/employees/55",
    "@type": "Employee",
    "label": "Eden, Nicky"
  },
  "label": "2019-09-20 architecture for coolkids",
  "day": "Fri"
}
```

Then entity Employee. Once again add a use statement to make the
@Group annotation available:
```php
use Symfony\Component\Serializer\Annotation\Groups;
```

Then the @ApiResource annotation:
```php
 * @ApiResource(
 *     attributes={"order"={"lastName", "firstName"}},
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"employee_get"}}
 *          },
 *          "put",
 *          "patch",
 *          "delete"
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"employee_list"}}
 *          },
 *          "post"
 *     }
 * )
```

To specify the groups add the following to the comments of properties
$function, $birthDate, $arrival:
```php
     * @Groups({"employee_get", "employee_list"})
```

And add the following to the comment of properties $firstName, $lastName, 
$address, $zipcode, $city
```php
     * @Groups({"employee_get"})
```

Finally add the following to the comment of method ::getLabel
```php
     * @Groups({"employee_get", "employee_list", "hours_get", "hours_list"})
```
This makes the label not only show up in employee operations but also in hours get operations.

You can test your configuration at https://localhost:8443/.
When you try out Get //employees there should be response body like:
```json
{
  "@context": "/contexts/Employee",
  "@id": "/employees",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/employees/55",
      "@type": "Employee",
      "function": "architect",
      "birthDate": "1982-01-28T00:00:00+00:00",
      "arrival": "1970-01-01T09:30:00+00:00",
      "label": "Eden, Nicky"
    },
(..)
```
And when you fill out the number from @id from your own response at Get /employees/{id} 
there should be response body like:
```json
{
  "@context": "/contexts/Employee",
  "@id": "/employees/55",
  "@type": "Employee",
  "firstName": "Nicky",
  "lastName": "Eden",
  "function": "architect",
  "address": "Zuiderdiep 17",
  "zipcode": "9722 AB",
  "city": "Groningen",
  "birthDate": "1982-01-28T00:00:00+00:00",
  "arrival": "1970-01-01T09:30:00+00:00",
  "label": "Eden, Nicky"
}
```
