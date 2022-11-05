<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Registration of time worked by an Employee on a day
 *
 * @ApiResource(attributes={
 *     "pagination_items_per_page"=10,
 *     "order"={"start": "DESC", "description": "ASC"},
 *     },
 *     itemOperations={
 *          "get"={
 *              "normalization_context"={"groups"={"hours_get"}}
 *          },
 *          "put",
 *          "delete"
 *     },
 *     collectionOperations={
 *         "get"={
 *              "normalization_context"={"groups"={"hours_list"}}
 *          },
 *          "post"
 *     }
 * )
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
     * @Groups({"hours_get", "hours_list"})
     */
    #[ORM\Column(type:"float")]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(0.1)]
    private $nHours = 1.0;

    /**
     * @var \DateTime
     *
     * @Groups({"hours_get", "hours_list"})
     */
    #[ORM\Column(type:"datetime")]
    #[Assert\NotNull]
    private $start;

    /**
     * @var bool
     * @Groups({"hours_get"})
     */
    #[ORM\Column(type:'boolean', nullable:true)]
    private $onInvoice = true;

    /**
     * @var string
     * @Groups({"hours_get", "hours_list"})
     */
    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Length(max:255)]
    private $description;

    /**
     * @var Employee
     * @Groups({"hours_get", "hours_list"})
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
