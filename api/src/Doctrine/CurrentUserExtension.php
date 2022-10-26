<?php
namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Employee;
use App\Entity\Hours;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass, $queryNameGenerator);
    }

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
                $alias = $queryNameGenerator->generateJoinAlias('employee');
                $queryBuilder->innerJoin("$rootAlias.employee", $alias);
                $queryBuilder->andWhere(sprintf('%s.user = :current_user_id', $alias));
                break;
            default:
                return;
        }
        $queryBuilder->setParameter('current_user_id', $user->getId());
    }
}
