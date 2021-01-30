Chapter 8: Authorization - Api
=============================

The environment is te same as in the chapter7-api branch, except:
- instructions from README.md of chapter7-api where applied,

This chapter adds Authorization: 
- Ordinary users should only be allowed to see and modify their own data*. 
- Administrators should be allowed to see and modify all data*. 
- Ordinary users are allowed to create and delete their Hours but not their Employee.
- Hours.start should be within last week unless the user is an Administrator.

* Users can not be added/modified through the api.

Employee User relationship<a name="Relationship"></a>
--------------------------

In order to know what a user is allowed to see etc a new relationship
is required between User and Employee. Because the examples in the
API Platform documentation suggest a property on the other entity
referencing one user add the following to src/api/Entity/Employee.php
below the last property:
```php
    /**
     * @var User associated with this employee
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @Groups({"employee_get"})
     */
    private $user;
```
And at the bottom of the class the getter and setter:
```php
   /**
     * @return null|User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param null|User $user
     * @return Employee
     */
    public function setUser(User $user=null): Employee
    {
        $this->user = $user;
        return $this;
    }
```
Maybe it seems odd that the user property may be null. However, it is likely
that the Employee data and his Hours registration need to be kept for several years 
after the employee has left the company. In that situation the User entity is no
longer needed and may be removed without removing the Employee entity.

After adding the User relationship to the Employee class, the 
database needs to be adapted. Generate a new migration with:
```shell
docker-compose exec php ./bin/console doctrine:migrations:diff
```
Then execute the migration with:
```shell
docker-compose exec php ./bin/console doctrine:migrations:migrate
```

The data itself also needs to be changed. In api/src/DataFixtures/EmployeeFixtures.php
on the line with
```php
            ->setFunction('programmer');
```
replace the ; by a new line with:
```php
            ->setUser($this->getReference(UserFixtures::HORLINGS_REFERENCE));
```
Make similar additions to the other Employee entities in the Fixture.

When you are done run:
```shell
docker-compose exec php ./bin/console doctrine:fixtures:load
```
and choose yes to delete all data before the fixtures are loaded.


User resource<a name="User"></a>
-------------
Administrators will have more access then ordinary users. 
In order to adapt the client needs to be able to find out wheater the
current user is an administrator or not. Furthermore, the admin client
will need to fetch the label of the user that is related to an 
Employee. 

First add some use statements to api/src/Entity/User.php:
```php
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiProperty;
```

And an @ApiResource tag :
```php class comment
 * @ApiResource(
 *     attributes={"order"={"email"}},
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"user_get"}},
 *              "security"="is_granted('ROLE_ADMIN') or object == user"
 *          }
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"user_list"}},
 *          }
 *     }
 * )
```
The "security" configuration will be explained in the next paragraph. 

Add the following to the comments of the $email property:
```php class comment
     * @Groups({"user_get", "user_list"})
```

Add a getLabel and an isAdmin method:
```php
   /** Represent the entity to the user in a single string
     * @ApiProperty(iri="http://schema.org/name")
     * @Groups({"user_get", "user_list", "employee_get"})
     * @return string
     */
    public function getLabel()
    {
        return $this->email;
    }

    /**
     * @Groups({"user_get", "user_list"})
     * @return bool
     */
    public function isAdmin()
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }
```
The getLabel method is added for consistency with the other entity classes.

The isAdmin method hides the exact role data to the clients. This is
not only for security reasons, but also to decouple the clients from
the inner workings of the server.


You can now test through https://localhost/docs 
that users can be retrieved, that their passwords are
not in the results and that the user @id and label are 
in the result of getting an individual Employee.

Securing Operations<a name="Operations"></a>
-------------------
Please read [the Security page](https://api-platform.com/docs/core/security/) 
of the API Platform documentation (you may skip the chapters about Voters and Error Message).

The @ApiResource annotation of User already contains a security configuration:
```php class comment
 *              "security"="is_granted('ROLE_ADMIN') or object == user"
```
It is a Symfony expression that returns true if the user is granted
ROLE_ADMIN or if the object retrieved equals the user that 
is currently logged in. If this expression returns false API Platform will return a 
403 Forbidden error with "hydra:description": "Access Denied."

To secure access to Employee replace its @ApiResource annotation by the following:
```php class comment
 * @ApiResource(
 *     attributes={"order"={"lastName", "firstName"}},
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"employee_get"}},
 *               "security"="is_granted('ROLE_ADMIN') or object.getUser() == user"
 *          },
 *          "put"={"security_post_denormalize"="is_granted('ROLE_ADMIN') or
               (object.getUser() == user and previous_object.getUser() == user)"},
 *          "patch"={"security_post_denormalize"="is_granted('ROLE_ADMIN') or
               (object.getUser() == user and previous_object.getUser() == user)"},
 *          "delete"={"security"="is_granted('ROLE_ADMIN')" }
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"employee_list"}}
 *          },
 *          "post"={"security"="is_granted('ROLE_ADMIN')" }
 *     }
 * )
```
As you can see item operation "get" has a new configuration "security"
similar to the one of User "get".

The item operations "put" and "patch" both have the a configuration 
"security_post_denormalize". This is because the operation may change
the user property of the Employee and that can only be checked after denormalization.
But its value before denormalization also needs to be checked, therefore 
previous_object.getUser() is also compared to the user that is currently logged in.

The configurations for item operation "delete" and collection operation "post" are 
simpeler, they only require the user to be granted ROLE_ADMIN, so ordinary users
can not perform these operations.

Collection operation "get" does not have any security configurations, i guess because
enforcing them would require checking each entity retrieved and that could
be thousands. Instead a Filter will be added in the next paragraph.

To secure access to Hours replace its @ApiResource annotation by the following:
```php class comment
 * @ApiResource(attributes={
 *     "pagination_items_per_page"=10,
 *     "order"={"start": "DESC", "description": "ASC"},
 *     },
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"hours_get"}},
 *              "security"="is_granted('ROLE_ADMIN') or object.getEmployee().getUser() == user"
 *          },
 *          "put"={"security_post_denormalize"="is_granted('ROLE_ADMIN') or
               (object.getEmployee().getUser() == user and previous_object.getEmployee().getUser() == user)"},
 *          "delete"={"security"="is_granted('ROLE_ADMIN') or object.getEmployee().getUser() == user" }
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"hours_list"}}
 *          },
 *          "post"={"security_post_denormalize"="is_granted('ROLE_ADMIN') or object.getEmployee().getUser() == user"}
 *     }
 * )
```
This is similar to the configurations of Employee, except that "delete" and "post now allow
ordinary users to post or delete Hours.

You can now test through https://localhost/docs that the above
operations return 403 Forbidden errors if the security requirements are not met.
 
Filtering<a name="Filtering"></a>
---------

Limiting the access to collection get operations is done by
implementing an Extension service specific to the data provider. 
If you use a custom data provider, you need to implement a custom interface that 
suits the needs of your own data provider, see [the Data Providers page](https://api-platform.com/docs/core/data-providers/) 
of the API Platform documentation.

As this tutorial uses the Doctrine ORM adapter, implementing an Extension service means implementing the 
ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface. 
Create a folder api/src/Doctrine and add a file api/src/Doctrine/CurrentUserExtension.php
to it with the following content:
```php
<?php
namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Employee;
use App\Entity\Hours;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryBuilderHelper;

class CurrentUserExtension implements QueryCollectionExtensionInterface
//   , QueryItemExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null): void
    {
        $this->addWhere($queryBuilder, $resourceClass, $queryNameGenerator);
    }

//    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void
//    {
//        $this->addWhere($queryBuilder, $resourceClass, $queryNameGenerator);
//    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass, QueryNameGeneratorInterface $queryNameGenerator): void
    {
        $user = $this->security->getUser();
        // #WORKAROUND
        // For unkown reasons $this->security->isGranted('ROLE_ADMIN') if admin was logged in
        // in combination with Employee::$user caused 502 BAD GATEWAY error
        if (null === $user || in_array('ROLE_ADMIN', $user->getRoles())) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        switch ($resourceClass) {
            case User::class:
                $queryBuilder->andWhere(sprintf('%s.id = :current_user_id', $rootAlias));
                break;
            case Employee::class:
                $queryBuilder->andWhere(sprintf('%s.user = :current_user_id', $rootAlias));
                break;
            case Hours::class:
                $alias = QueryBuilderHelper::addJoinOnce($queryBuilder, $queryNameGenerator, $rootAlias, 'employee', null);
                $queryBuilder->andWhere(sprintf('%s.user = :current_user_id', $alias));
                break;
            default:
                return;
        }
        $queryBuilder->setParameter('current_user_id', $user->getId());
    }
}
```
To apply the extension the data provider calls ::applyToCollection. This in turn calls
::addWhere where the real work is done. If anything needs to be done: In this 
tutorial Administrators have access to all data so if the user is granted ROLE_ADMIN
the function returns without changing the query. 

If the user is not an Administrator the filtering depends on what type of
Entity is retrieved. This is decided by the case switch. For 
User and Employee only a criterion is added to the WHERE clause. But for
Hours a JOIN is added too for the employee relationship. This results
in an alias that then is used for the criterion added to the WHERE clause.

You can now test through https://localhost/docs that collecion GET
operations behave accordingly.

Maybe you wonder why the function ::applyToItem is in a comment. This is
because the implementation of the extension was based on [the example in
the Extensions page](https://api-platform.com/docs/core/extensions/#example)
of the API Platform documentation. If you "uncomment" the function and the
line below the extension will also be applied on queries for single items.
This will make part of the security configurations made in the @ApiResource annotations
in the previous paragraph superfluous (DRY!) because the filtering for ::applyToItem 
will lead to a 404 Error: Not Found when a user tries to access an entity 
wherefore he/she is not authorized, including for PUT and PATCH. Of course
the configurations for PUT and PATCH and POST would still be necessary 
with respect to the values that where just unserialized, otherwise any
user could add/move Hours to other users' Employees.

Whether having the ::applyToItem function active is a good idea depends
on the audience of the api. Returning 403 Forbidden errors is
more informative to the user, and therefore more user friendly, but
it does give away the (non) existence of the @ids. Furthermore, 
returning 404 Error: Not Found is consistent with the filtering of
the collection operations. For this tutorial the choice was made 
not to use the ::applyToItem function so that you learn 
more about the security configurations made in the @ApiResource annotations.


Validation<a name="Validation"></a>
----------
Usually Hours registrations are processed in some way by the administration
and then they can no longer be added or modified by ordinary users. 
Because that fact itself is not included in the current application,
ordinary users are only allowed to add or modify Hours that
start within last week. 

[The Dynamic Validation Groups section](https://api-platform.com/docs/core/validation/#dynamic-validation-groups) 
in the API Platform documentation contains an example of a service that 
selects the validation groups to apply based on the role of the current user.
That could work in combination with a [Date Range constraint](https://symfony.com/doc/current/reference/constraints/Range.html#date-ranges), but what if it was changed to somethink like
"within the current month and two working days thereafter"? 

In order to anticipate such changes a Custom Constraint is
used. Create a folder api/src/Validator and within there
another folder Constraints. Add a file CommonUserHoursStartConstraint.php
with the following content:

```php
<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class CommonUserHoursStartConstraint extends Constraint
{
    public $message = 'app.datetime.must_be_in_last_week'; // 'The Hours must start within last week';
}
```
This makes the annotation @CommonUserHoursStartConstraint available.
In order to validate it add a file CommonUserHoursStartConstraintValidator.php
to the same folder with:
```php
<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @Annotation
 */
class CommonUserHoursStartConstraintValidator extends ConstraintValidator
{
    private $authorizationChecker;

    public function __construct(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
    }

    public function validate($value, Constraint $constraint): void
    {
        if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return;
        }

        $now = new \DateTime();
        $oneWeekAgo = new \DateTime("1 week ago");
        if ($value < $oneWeekAgo || $value > $now) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
```

The error app.datetime.must_be_in_last_week of course is not the 
actual message but its translation key. Add a file
api/translations/validators.en.yaml withe the following:
```yaml
app.datetime.must_be_in_last_week: Must be within last week
```

And another file api/translations/validators.nl.yaml with:
```yaml
app.datetime.must_be_in_last_week: Moet in de laatste week vallen
```

Now to apply the Constraint to Hours add to the Entity class:
```php
use App\Validator\Constraints\CommonUserHoursStartConstraint;
```
And to the property comment of $start:
```php comment
* @CommonUserHoursStartConstraint
```

You can now test through https://localhost/docs that
adding or changing Hours that start outside last week results
in a validation error if you are logged in as an ordinary user
but not if you are logged in as an administrator.

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter9-api 
```
will compare your own version with code one of chapter9-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter8-react and point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter8-react) 
and follow the instructions. Or if you only follow the api branches chapter9-api.
