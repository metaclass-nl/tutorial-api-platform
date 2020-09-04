<?php
namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Employee;
use App\Entity\Hours;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryBuilderHelper;

class CurrentUserExtension implements QueryCollectionExtensionInterface
//   , QueryItemExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null): void
    {
        $this->addWhere($queryBuilder, $resourceClass, $queryNameGenerator);
    }

//    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void
//    {
//        $this->addWhere($queryBuilder, $resourceClass, $queryNameGenerator);
//    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass, QueryNameGeneratorInterface $queryNameGenerator): void
    {
        $user = $this->security->getUser();
        // #WORKAROUND
        // For unkown reasons $this->security->isGranted('ROLE_ADMIN') if admin was logged in
        // in combination with Employee::$user caused 502 BAD GATEWAY error
        if (null === $user || in_array('ROLE_ADMIN', $user->getRoles())) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        switch ($resourceClass) {
            case User::class:
                $queryBuilder->andWhere(sprintf('%s.id = :current_user_id', $rootAlias));
                break;
            case Employee::class:
                $queryBuilder->andWhere(sprintf('%s.user = :current_user_id', $rootAlias));
                break;
            case Hours::class:
                $alias = QueryBuilderHelper::addJoinOnce($queryBuilder, $queryNameGenerator, $rootAlias, 'employee', null);
                $queryBuilder->andWhere(sprintf('%s.user = :current_user_id', $alias));
                break;
            default:
                return;
        }
        $queryBuilder->setParameter('current_user_id', $user->getId());
    }
}