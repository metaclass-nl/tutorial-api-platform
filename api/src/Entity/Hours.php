<?php

namespace App\Entity;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\State\DayTotalsPerEmployeeCollectionProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Validator\Constraints\CommonUserHoursStartConstraint;
use App\Model\DayTotalsPerEmployee;

/**
 * Registration of time worked by an Employee
 */
#[ORM\Entity]
#[ORM\Table(indexes:[ new ORM\Index(columns: ["start", "description"]) ])]
#[ApiResource(operations: [
        new Get(normalizationContext: ['groups' => ['hours_get']],
            security: 'is_granted(\'ROLE_ADMIN\') or object.getEmployee().getUser() == user',
            requirements: ['id' => '\d+']),
        new Put(securityPostDenormalize: 'is_granted(\'ROLE_ADMIN\') or
                   (object.getEmployee().getUser() == user and previous_object.getEmployee().getUser() == user)'),
        new Delete(security: 'is_granted(\'ROLE_ADMIN\') or object.getEmployee().getUser() == user'),
        new GetCollection(normalizationContext: ['groups' => ['hours_list']]),
        new Post(securityPostDenormalize: 'is_granted(\'ROLE_ADMIN\') or object.getEmployee().getUser() == user'),
        new GetCollection(uriTemplate: '/hours/dayreport',
            output: DayTotalsPerEmployee::class,
            normalizationContext: ['groups' => ['day_totals_per_employee']],
            paginationEnabled: false,
            provider: DayTotalsPerEmployeeCollectionProvider::class,
            openapiContext: [
                'summary' => 'Totals per day per Employee',
                'description' => 'Days start at time of start[after] filter',
            ]
        )
    ],
    paginationItemsPerPage: 10,
    order: ['start' => 'DESC', 'description' => 'ASC'])
]
#[ApiFilter(filterClass: SearchFilter::class, properties: ['description' => 'ipartial', 'employee' => 'exact', 'employee.job' => 'ipartial'])]
#[ApiFilter(filterClass: DateFilter::class, properties: ['start'])]
#[ApiFilter(filterClass: RangeFilter::class, properties: ['nHours'])]
#[ApiFilter(filterClass: OrderFilter::class, properties: ['start', 'description', 'nHours', 'employee.firstName', 'employee.lastName'])]
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
    #[Groups(["hours_get", "hours_list"])]
    private $nHours = 1.0;

    /**
     * @var \DateTime
     */
    #[ORM\Column(type:"datetime")]
    #[Assert\NotNull]
    #[Groups(["hours_get", "hours_list"])]
    #[CommonUserHoursStartConstraint]
    private $start;

    /**
     * @var bool
     */
    #[ORM\Column(type:'boolean', nullable:true)]
    #[Groups(["hours_get"])]
    private $onInvoice = true;

    /**
     * @var string
     */
    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Length(max:255)]
    #[Groups(["hours_get", "hours_list"])]
    private $description;

    /**
     * @var Employee
     */
    #[ORM\ManyToOne(targetEntity:"App\Entity\Employee", inversedBy:"hours")]
    #[Assert\NotNull]
    #[Groups(["hours_get", "hours_list"])]
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

    /**
     * Represent the entity to the user in a single string
     *
     * @return string
     */
    #[Groups (["hours_get", "hours_list"])]
    #[ApiProperty(iris: ['http://schema.org/name'])]
    public function getLabel()
    {
        return $this->getStart()->format('Y-m-d H:i:s') . ' ' . $this->getDescription();
    }

    /**
     * @return string
     */
    #[Groups (["hours_get", "hours_list"])]
    public function getDay()
    {
        return $this->getStart()->format('D');
    }
}
