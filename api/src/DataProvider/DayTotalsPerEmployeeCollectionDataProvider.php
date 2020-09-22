<?php

namespace App\DataProvider;

use ApiPlatform\Core\Api\OperationType;
use App\Model\DayTotalsPerEmployee;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\CollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Hours;

class DayTotalsPerEmployeeCollectionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    /** @var CollectionDataProviderInterface */
    private $dataProvider;

    /**
     * DayTotalsPerEmployeeCollectionDataProvider constructor.
     * @param CollectionDataProviderInterface $dataProvider The built-in orm CollectionDataProvider of API Platform
     */
    public function __construct(CollectionDataProviderInterface $dataProvider)
    {
        $this->dataProvider = $dataProvider;
    }

    /**
     * {@inheritdoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Hours::class === $resourceClass
            && $operationName == 'get_day_report';
    }

    /**
     * {@inheritdoc}
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): array
    {
        if (!isset($context["filters"]["start"]["after"]) && !isset($context["filters"]["start"]["strictly_after"])) {
            $context["filters"]["start"]["after"] = date('Y-m-dTH:i:s', strtotime("-1 week"));
        }

        $hours = $this->dataProvider->getCollection($resourceClass, $operationName, $context);

        $afterTime = isset($context["filters"]["start"]["after"])
            ? strtotime($context["filters"]["start"]["after"])
            : strtotime($context["filters"]["start"]["strictly_after"])+1;

        $totals = [];
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