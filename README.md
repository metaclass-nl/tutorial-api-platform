Chapter 2: Hours registration
=============================

The environment is te same as in the chapter1-api branche, except:
- instructions from README.md of chapter1-api where applied

This chapter adds an entity class Hours that has an n to 1 relation with Employee and adds a menu (client only).

Entity<a name="Entity"></a>
------
Before you add the Entity class 'Hours', make sure the database schema is in sync.
When you do docker compose up migrations are executed automatically, but
you can explicitly execute those that are not yet executed:
```shell
docker compose exec php ./bin/console doctrine:migrations:migrate
```

Then add the Entity class 'Hours' by copying the
following code to a new file api/src/Entity/Employee.php:
```php
<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Registration of time worked by an Employee on a day
 *
 */
#[ORM\Entity]
#[ORM\Table(indexes:[ new ORM\Index(columns: ["start", "description"]) ])]
#[ApiResource(
    paginationItemsPerPage: 10,
    order: ['start' => 'DESC', 'description' => 'ASC'])
]
class Hours
{
    /**
     * @var int The entity Id
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private $id;

    /**
     * @var float number of hours
     */
    #[ORM\Column(type:"float")]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(0.1)]
    private $nHours = 1.0;

    /**
     * @var \DateTime
     */
    #[ORM\Column(type:"datetime")]
    #[Assert\NotNull]
    private $start;

    /**
     * @var bool
     */
    #[ORM\Column(type:'boolean', nullable:true)]
    private $onInvoice = true;

    /**
     * @var string
     */
    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Length(max:255)]
    private $description;

    /**
     * @var Employee
     */
    #[ORM\ManyToOne(targetEntity:"App\Entity\Employee", inversedBy:"hours")]
    #[Assert\NotNull]
    private $employee;

    public function __construct()
    {
        // initialize start on now
        $this->setStart(new \DateTime());
    }

    public function getId() : int
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getNHours() : float
    {
        return $this->nHours;
    }

    /**
     * @param float $nHours
     * @return Hours
     */
    public function setNHours(float $nHours) : Hours
    {
        $this->nHours = $nHours;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getStart() : \DateTime
    {
        return $this->start;
    }

    /**
     * @param \DateTime $start
     * @return Hours
     */
    public function setStart(\DateTime $start) : Hours
    {
        $this->start = $start;
        return $this;
    }

    /**
     * @return bool
     */
    public function isOnInvoice() : bool
    {
        return $this->onInvoice;
    }

    /**
     * @param bool|null $onInvoice
     * @return Hours
     */
    public function setOnInvoice(?bool $onInvoice) : Hours
    {
        $this->onInvoice = (bool) $onInvoice;
        return $this;
    }

    /**
     * @return string
     */
    public function getDescription() : string
    {
        return $this->description;
    }

    /**
     * @param string $description
     * @return Hours
     */
    public function setDescription(string $description) : Hours
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return Employee|null
     */
    public function getEmployee() : ?Employee
    {
        return $this->employee;
    }

    /**
     * @param Employee $employee
     * @return Hours
     */
    public function setEmployee(Employee $employee)
    {
        $this->employee = $employee;
        return $this;
    }


    /** Represent the entity to the user in a single string
     * @return string
     */
    public function getLabel() {
        return $this->getStart()->format('Y-m-d H:i:s')
            . ' '. $this->getDescription();
    }

    /**
     * @return string
     */
    public function getDay() {
        return $this->getStart()->format('D');
    }
}
```
It's another quite common Doctrine Entity class. To see the pagination
buttons in the client an ApiResource attribute "pagination_items_per_page" was added:
```php
#[ApiResource(
    paginationItemsPerPage: 10,
    order: ['start' => 'DESC', 'description' => 'ASC'])
]
```
Once again the attribute "order" specifies the default order. This time an index
was added to improve the performance of sorting and of searching by $start:
```php
#[ORM\Table(indexes:[ new ORM\Index(columns: ["start", "description"]) ])]
```

A Doctrine attribute defines the relationship with Employee:
```php
    #[ORM\ManyToOne(targetEntity:"App\Entity\Employee", inversedBy:"hours")]
```

It also refers to a property 'hours' on Employee you need to add to Employee:
```php
    /**
     * @var Collection
     */
    #[ORM\OneToMany(targetEntity:"App\Entity\Hours", mappedBy:"employee")]
    private $hours;
```
And of course the corresponding methods:
```php
    /**
     * @return Collection
     */
    public function getHours(): Collection
    {
        return $this->hours;
    }

    /**
     * @param mixed $hours
     * @return Employee
     */
    public function setHours($hours)
    {
        $this->hours = $hours;
        return $this;
    }
```

Now you have the new entity class you can generate a database migration:
```shell
docker compose exec php ./bin/console doctrine:migrations:diff
```

And execute it by:
```shell
docker compose exec php ./bin/console doctrine:migrations:migrate
```

To test the new Hours class point your browser at https://localhost/docs.
You should see a new model Hours. When you try out Get /hours there should
be an example value model like
```json
{
  "hydra:member": [
    {
      "@context": "string",
      "@id": "string",
      "@type": "string",
      "id": 0,
      "NHours": 0,
      "start": "2020-02-21T16:34:31.774Z",
      "onInvoice": true,
      "description": "string",
      "employee": "string",
      "label": "string",
      "day": "string"
    },
```

Fixtures<a name="Fixtures"></a>
--------
To add data create a new file api/src/DataFixtures/HoursFixtures.php.
(also create the necessary folders). Then copy the following to the file:

```php
<?php

namespace App\DataFixtures;

use App\Entity\Hours;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class HoursFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies()
    {
        return array(
            EmployeeFixtures::class,
        );
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $entity = new Hours();
        $entity->setDescription('developoment invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(6.15)
            ->setStart(new \DateTime('2019-09-13T09:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('unit tests invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-16T14:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('new requirements invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-17T10:10:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('debugging invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-18T13:12:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('starting project coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(9.00)
            ->setStart(new \DateTime('2019-09-10T08:54:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('meeting with customer')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-12T22:09:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('handling issues with invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(6.00)
            ->setStart(new \DateTime('2019-09-11T07:37:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('bookkeeper')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-12T15:01:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('presentation invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(10.00)
            ->setStart(new \DateTime('2019-09-13T10:21:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(6.00)
            ->setStart(new \DateTime('2019-09-18T09:09:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('conference on Kubernetes')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(2.00)
            ->setStart(new \DateTime('2019-09-18T08:16:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('lecture on package design')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(2.00)
            ->setStart(new \DateTime('2019-09-13T16:33:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(8.00)
            ->setStart(new \DateTime('2019-09-20T08:47:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-10T10:27:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('meeting with customer')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(5.00)
            ->setStart(new \DateTime('2019-09-12T11:18:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('study')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-11T14:15:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-11T05:18:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(9.00)
            ->setStart(new \DateTime('2019-09-12T08:34:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('adapting layout of invoices')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(5.00)
            ->setStart(new \DateTime('2019-09-13T12:27:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(8.00)
            ->setStart(new \DateTime('2019-09-16T09:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('wireframe for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-17T14:54:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-13T15:03:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);
        $manager->flush();
    }
}
```

To clear the database and execute the fixtures enter the following command:
```shell
docker compose exec php bin/console doctrine:fixtures:load
```
Say yes to "Careful, database "api" will be purged. Do you want to continue?"
(You will loose all data in the database of your api-platform install).

To test the new Entity class point your browser at https://localhost/docs.
When you try out Get /hours the response body should contain the data of the hours.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter3-api 
```
will compare your own version with code one of chapter3-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch [chapter2-react](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-react) or [chapter2-next](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter2-next)  
and point your browser to the same branch on github and follow the instructions. 
Or if you only follow the api branches [chapter3-api](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter3-api) .
