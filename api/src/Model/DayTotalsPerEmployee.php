<?php

namespace App\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\Employee;
use App\Entity\Hours;

/**
 * Totals per day per Employee
 */
class DayTotalsPerEmployee
{
    /** @var Employee
     * @Groups({"day_totals_per_employee"})
     */
    private $employee;

    /** @var \DateTime
     * @Groups({"day_totals_per_employee"})
     */
    private $from;

    /** @var Hours[] */
    private $hours = [];

    /**
     * @return Employee
     */
    public function getEmployee(): Employee
    {
        return $this->employee;
    }

    /**
     * @param Employee $employee
     * @return DayTotalsPerEmployee
     */
    public function setEmployee(Employee $employee): DayTotalsPerEmployee
    {
        $this->employee = $employee;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getFrom(): \DateTime
    {
        return $this->from;
    }

    /**
     * @param \DateTime $from
     * @return DayTotalsPerEmployee
     */
    public function setFrom(\DateTime $from): DayTotalsPerEmployee
    {
        $this->from = $from;
        return $this;
    }

    /** @ApiProperty(identifier=true)
     * @return string
     */
    public function getId()
    {
        return $this->employee->getId(). '_'. $this->from->format('Y-m-d H:i:s');
    }

    /**
     * @return string
     * @ApiProperty(iri="http://schema.org/name")
     * @Groups({"day_totals_per_employee"})
     */
    public function getLabel()
    {
        return $this->employee->getLabel(). ' '. $this->from->format('Y-m-d');
    }

    /**
     * @return \DateTime
     * @Groups({"day_totals_per_employee"})
     * @throws \Exception
     */
    public function getTo()
    {
        $result = clone $this->from;
        $result->add(new \DateInterval('P1D'));
        return $result;
    }

    /**
     * @return Hours[]
     */
    public function getHours(): array
    {
        return $this->hours;
    }

    /**
     * @param \App\Entity\Hours $hours
     * @return $this
     */
    public function addHours(Hours $hours)
    {
        $this->hours[] = $hours;
        return $this;
    }

    /**
     * @return int
     * @Groups({"day_totals_per_employee"})
     */
    public function getCount()
    {
        return count($this->getHours());
    }

    /**
     * @return float|int
     * @throws \Exception
     * @Groups({"day_totals_per_employee"})
     */
    public function getTotal()
    {
        $result = 0;
        foreach ($this->getHours() as $hours) {
            $result += $hours->getNHours();
        }
        return $result;
    }

    /**
     * @return float|int
     * @throws \Exception
     * @Groups({"day_totals_per_employee"})
     */
    public function getOnInvoice()
    {
        $result = 0;
        foreach ($this->getHours() as $hours) {
            if ($hours->isOnInvoice()) {
                $result += $hours->getNHours();
            }
        }
        return $result;

    }

    /**
     * @return float|int|null
     * @throws \Exception
     * @Groups({"day_totals_per_employee"})
     */
    public function getFractionBilled()
    {
        if ($this->getTotal() == 0) return null;
        return $this->getOnInvoice() / $this->getTotal();
    }
}