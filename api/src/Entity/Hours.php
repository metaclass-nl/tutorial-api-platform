<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Validator\Constraints\CommonUserHoursStartConstraint;

/**
 * Registration of time worked by an Employee on a day
 *
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
 * @ApiFilter(SearchFilter::class, properties={"description": "ipartial", "employee": "exact", "employee.function": "ipartial"})
 * @ApiFilter(DateFilter::class, properties={"start"})
 * @ApiFilter(RangeFilter::class, properties={"nHours"})
 * @ApiFilter(OrderFilter::class, properties={"start", "description", "nHours", "employee.firstName", "employee.lastName"})
 * @ORM\Entity
 * @ORM\Table(indexes={ @ORM\Index(columns={"start", "description"}) })
 */
class Hours
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
     * @var float number of hours
     * @ORM\Column(type="float")
     * @Assert\NotNull
     * @Assert\GreaterThanOrEqual(0.1)
     * @Groups({"hours_get", "hours_list"})
     */
    private $nHours = 1.0;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetime")
     * @Assert\NotNull
     * @Groups({"hours_get", "hours_list"})
     * @CommonUserHoursStartConstraint
     */
    private $start;

    /**
     * @var bool
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"hours_get"})
     */
    private $onInvoice = true;

    /**
     * @var string
     * @ORM\Column
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     * @Groups({"hours_get", "hours_list"})
     */
    private $description;

    /**
     * @var Employee
     * @ORM\ManyToOne(targetEntity="App\Entity\Employee", inversedBy="hours")
     * @Assert\NotNull
     * @Groups({"hours_get", "hours_list"})
     */
    private $employee;

    public function __construct()
    {
        // initialize start on now
        $this->setStart(new \DateTime());
    }

    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getNHours(): float
    {
        return $this->nHours;
    }

    /**
     * @param float $nHours
     * @return Hours
     */
    public function setNHours(float $nHours): Hours
    {
        $this->nHours = $nHours;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getStart(): \DateTime
    {
        return $this->start;
    }

    /**
     * @param \DateTime $start
     * @return Hours
     */
    public function setStart(\DateTime $start): Hours
    {
        $this->start = $start;
        return $this;
    }

    /**
     * @return bool
     */
    public function isOnInvoice(): bool
    {
        return $this->onInvoice;
    }

    /**
     * @param bool|null $onInvoice
     * @return Hours
     */
    public function setOnInvoice(?bool $onInvoice): Hours
    {
        $this->onInvoice = (bool) $onInvoice;
        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     * @return Hours
     */
    public function setDescription(string $description): Hours
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return Employee|null
     */
    public function getEmployee(): ? Employee
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
     * @ApiProperty(iri="http://schema.org/name")
     * @Groups({"hours_get", "hours_list"})
     * @return string
     */
    public function getLabel() {
        return $this->getStart()->format('Y-m-d H:i:s')
            . ' '. $this->getDescription();
    }

    /**
     * @return string
     * @Groups({"hours_get", "hours_list"})
     */
    public function getDay() {
        return $this->getStart()->format('D');
    }
}
