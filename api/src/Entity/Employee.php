<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Filter\SimpleSearchFilter;

/**
 * Class defining entities with data about an Employees
 *
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
 * @ApiFilter(OrderFilter::class)
 * @ApiFilter(SimpleSearchFilter::class, properties={"lastName", "firstName", "job", "address", "zipcode", "city"}, arguments={"searchParameterName"="search"})
 * @ORM\Entity
 */
class Employee
{
    public function __construct()
    {
        $this->hours = new ArrayCollection();
    }

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
     * @Groups({"employee_get"})
     */
    private $firstName;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=80)
     * @Groups({"employee_get"})
     */
    private $lastName;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=40)
     * @Groups({"employee_get", "employee_list"})
     */
    private $job;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=80)
     * @Groups({"employee_get"})
     */
    private $address;

    /**
     * @var string|null
     * @ORM\Column(nullable=true)
     * @Assert\Length(max=10)
     * @Groups({"employee_get"})
     */
    private $zipcode;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=40)
     * @Groups({"employee_get"})
     */
    private $city;

    /**
     * @var \DateTime Date of birth
     * @ORM\Column(type="date")
     * @Assert\NotNull
     * @ApiProperty(
     *     jsonldContext={"@type"="http://www.w3.org/2001/XMLSchema#date"}
     * )
     * @Groups({"employee_get", "employee_list"})
     */
    private $birthDate;

    /**
     * @var \DateTime Time the employee usually arrives at work
     * @ORM\Column(type="time", nullable=true)
     * @ApiProperty(
     *     jsonldContext={"@type"="http://www.w3.org/2001/XMLSchema#time"}
     * )
     * @Groups({"employee_get", "employee_list"})
     */
    private $arrival;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="App\Entity\Hours", mappedBy="employee")
     */
    private $hours;

    /**
     * @var User associated with this employee
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @Groups({"employee_get"})
     */
    private $user;

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
    public function getJob(): string
    {
        return $this->job;
    }

    /**
     * @param string $job
     * @return Employee
     */
    public function setJob(string $job): Employee
    {
        $this->job = $job;
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

    /**
     * Represent the entity to the user in a single string
     * @return string
     * @ApiProperty(iri="http://schema.org/name")
     * @Groups({"employee_get", "employee_list", "hours_get", "hours_list"})
     */
    function getLabel() {
        return $this->getLastName(). ', '. $this->getFirstName();
    }

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

}
