<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

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
    private $job;

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

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="App\Entity\Hours", mappedBy="employee")
     */
    private $hours;

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
     */
    function getLabel() {
        return $this->getLastName(). ', '. $this->getFirstName();
    }

}
