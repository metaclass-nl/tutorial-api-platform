<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Hours;
use App\Model\DayTotalsPerEmployee;

class DayTotalsPerEmployeeCollectionProvider implements ProviderInterface
{
    /** @var ProviderInterface */
    private $dataProvider;

    /**
     * DayTotalsPerEmployeeCollectionProvider constructor.
     * @param ProviderInterface $dataProvider The built-in orm CollectionDataProvider of API Platform
     */
    public function __construct(ProviderInterface $dataProvider)
    {
        $this->dataProvider = $dataProvider;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $resourceClass = $operation->getClass();
        if (!isset($context["filters"]["start"]["after"]) && !isset($context["filters"]["start"]["strictly_after"])) {
            $context["filters"]["start"]["after"] = date('Y-m-dTH:i:s', strtotime("-1 week"));
        }

        $hours = $this->dataProvider->provide($operation, $uriVariables, $context);

        $afterTime = isset($context["filters"]["start"]["after"])
            ? strtotime($context["filters"]["start"]["after"])
            : strtotime($context["filters"]["start"]["strictly_after"])+1;

        $totals = [];
        /** @var Hours $item */
        foreach ($hours as $item) {
            $startTime = $item->getStart()->getTimestamp();
            $dayIndex = floor(($startTime - $afterTime) / 86400);
            $key = str_pad($dayIndex, 9, '0', STR_PAD_LEFT)
                .  '_' . $item->getEmployee()->getLabel(). $item->getEmployee()->getId() ;
            if (isset($totals[$key])) {
                $totals[$key]->addHours($item);
            } else {
                $from = new \DateTime();
                $from->setTimestamp($afterTime + 86400 * $dayIndex);
                $total = new DayTotalsPerEmployee();
                $total->setEmployee($item->getEmployee())
                    ->addHours($item)
                    ->setFrom($from);
                $totals[$key] = $total;
            }

        }
        ksort($totals);

        return $totals;
    }
}
