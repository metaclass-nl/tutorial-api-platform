Chapter 1: Employee base
========================

The environment is te same as in the master branche, except:
- Entity Greetings was removed
- A migration was added to adjust the database
- Switched off mercure to avoid it's viral agpl license
- Changed client/public/index.html title to "Tutorial for API Platform"

This chapter adds an entity class Employee.

Api
---
Your first task is to add the Entity class 'Employee', but before you do so,
make sure the database schema is in sync. 
When you do docker-compose up migrations are executed automatically, but 
you can explicitly execute those that are not yet executed: 
```shell
docker-compose exec php ./bin/console doctrine:migrations:migrate
```

Then add the Entity class 'Employee' by copying the 
following code to a new file api/src/Entity/Employee.php:
```php
<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class defining entities with data about an Employees
 *
 * @ApiResource(
 *     attributes={"order"={"lastName", "firstName"}}
 * )
 * @ORM\Entity
 */
class Employee
{
    /**
     * @var int The entity Id
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(nullable=true)
     * @Assert\Length(max=20)
     */
    private $firstName;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=80)
     */
    private $lastName;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=40)
     */
    private $function;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=80)
     */
    private $address;

    /**
     * @var string|null
     * @ORM\Column(nullable=true)
     * @Assert\Length(max=10)
     */
    private $zipcode;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=40)
     */
    private $city;

    /**
     * @var \DateTime Date of birth
     * @ORM\Column(type="date")
     * @Assert\NotNull
     */
    private $birthDate;

    /**
     * @var \DateTime Time the employee usually arrives at work
     * @ORM\Column(type="time", nullable=true)
     */
    private $arrival;

    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string|null $firstName
     * @return Employee
     */
    public function setFirstName(?string $firstName): Employee
    {
        $this->firstName = $firstName;
        return $this;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     * @return Employee
     */
    public function setLastName(string $lastName): Employee
    {
        $this->lastName = $lastName;
        return $this;
    }

    /**
     * @return string
     */
    public function getFunction(): string
    {
        return $this->function;
    }

    /**
     * @param string $function
     * @return Employee
     */
    public function setFunction(string $function): Employee
    {
        $this->function = $function;
        return $this;
    }

    /**
     * @return string
     */
    public function getAddress(): string
    {
        return $this->address;
    }

    /**
     * @param string $address
     * @return Employee
     */
    public function setAddress(string $address): Employee
    {
        $this->address = $address;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    /**
     * @param string $zipcode|null
     * @return Employee
     */
    public function setZipcode(?string $zipcode): Employee
    {
        $this->zipcode = $zipcode;
        return $this;
    }

    /**
     * @return string
     */
    public function getCity(): string
    {
        return $this->city;
    }

    /**
     * @param string $city
     * @return Employee
     */
    public function setCity(string $city): Employee
    {
        $this->city = $city;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getBirthDate(): \DateTime
    {
        return $this->birthDate;
    }

    /**
     * @param \DateTime $birthDate
     * @return Employee
     */
    public function setBirthDate(\DateTime $birthDate): Employee
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getArrival(): ?\DateTime
    {
        return $this->arrival;
    }

    /**
     * @param \DateTime|null $arrival
     * @return Employee
     */
    public function setArrival(\DateTime $arrival=null): Employee
    {
        $this->arrival = $arrival;
        return $this;
    }

    /**
     * Represent the entity to the user in a single string
     * @return string
     */
    function getLabel() {
        return $this->getLastName(). ', '. $this->getFirstName();
    }

}
```
It's a quite common Doctrine Entity class for registering employees. 
One thing specific to api-platform is the annotation
```php
  * @ApiResource(
  *     attributes={"order"={"lastName", "firstName"}}
  * )
```
This tells api-platform to make the class accessable in the api and sets 
a default ordering for Employee by lastName, undersorting by firstName. 

Now you have the new entity class you can generate a database migration:
```shell
docker-compose exec php ./bin/console doctrine:migrations:diff
```

And execute it by:
```shell
docker-compose exec php ./bin/console doctrine:migrations:migrate
```

To test the new Entity class point your browser at https://localhost:8443/. 
You may need to make a security exception for the self-signed certificate that your
browser may report as not safe.

You should see Employee as the only model. When you try out Get /employees there should
be an example value model like
```json
{
  "hydra:member": [
    {
      "@context": "string",
      "@id": "string",
      "@type": "string",
      "id": 0,
      "firstName": "string",
      "lastName": "string",
      "function": "string",
      "address": "string",
      "zipcode": "string",
      "city": "string",
      "birthDate": "2020-02-21T14:52:39.004Z",
      "arrival": "2020-02-21T14:52:39.004Z"
    }
...
```

To add data we will use the [DoctrineFixturesBundle](https://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html).
You can install it from the command line:
```shell
docker-compose exec php composer req --dev orm-fixtures
```

Create a new file api/src/DataFixtures/EmployeeFixtures.php.
(also create the necessary folders). Then copy the following to the file:

```php
<?php

namespace App\DataFixtures;

use App\Entity\Employee;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class EmployeeFixtures extends Fixture
{
    public const HORLINGS_REFERENCE = 'Employee_Horlings';
    public const PETERS_REFERENCE = 'Employee_Peters';
    public const EDEN_REFERENCE = 'Employee_Eden';
    public const JACOBS_REFERENCE = 'Employee_Jacobs';

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        // Create Employees
        $entity = new Employee();
        $entity->setFirstname('John')
            ->setLastname('Horlings')
            ->setAddress('Wezelstraat 32')
            ->setZipcode('')
            ->setCity('Amsterdam')
            ->setBirthDate(new \DateTime('1971-02-18'))
            ->setArrival(new \DateTime('08:30'))
            ->setFunction('programmer');
        $manager->persist($entity);
        $this->addReference(self::HORLINGS_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Debby')
            ->setLastname('Peters')
            ->setAddress('Hoofdweg 71')
            ->setZipcode('1537 WL')
            ->setCity('Leiden')
            ->setBirthDate(new \DateTime('1965-09-03'))
            ->setArrival(new \DateTime('08:00'))
            ->setFunction('director');
        $manager->persist($entity);
        $this->addReference(self::PETERS_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Nicky')
            ->setLastname('Eden')
            ->setAddress('Zuiderdiep 17')
            ->setZipcode('9722 AB')
            ->setCity('Groningen')
            ->setBirthDate(new \DateTime('1982-01-28'))
            ->setArrival(new \DateTime('09:30'))
            ->setFunction('architect');
        $manager->persist($entity);
        $this->addReference(self::EDEN_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Simon')
            ->setLastname('Jacobs')
            ->setAddress('Theresiastraat 40')
            ->setZipcode('3214 CW')
            ->setCity('Utrecht')
            ->setBirthDate(new \DateTime('1958-12-16'))
            ->setArrival(new \DateTime('12:30'))
            ->setFunction('designer');
        $manager->persist($entity);
        $this->addReference(self::JACOBS_REFERENCE, $entity);

        $manager->flush();
    }

}
```

To clear the database and execute the fixtures enter the following command:
```shell
docker-compose exec php bin/console doctrine:fixtures:load
```
Say yes to 'Careful, database "api" will be purged. Do you want to continue?'
(You will loose all data in the database of your api-platform install).

To test the new Entity class point your browser at https://localhost:8443/. 
When you try out Get /employees the response body should contain the data of the 
four employees.

Next
----
Let git compare your own code with the branche of the next chapter 
so that you can see the differences right away. For example:
```shell
git diff chapter2-api ./api/src/Entity/Employee.php
```
will compare your own version of ./api/src/Entity/Employee.php with
the one of chapter2-api.

After committing your changes check out branch chapter1-react. 
Point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter1-react) 
and follow the instructions.
