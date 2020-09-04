<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @Annotation
 */
class CommonUserHoursStartConstraintValidator extends ConstraintValidator
{
    private $authorizationChecker;

    public function __construct(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
    }

    public function validate($value, Constraint $constraint): void
    {
        if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return;
        }

        $now = new \DateTime();
        $oneWeekAgo = new \DateTime("1 week ago");
        if ($value < $oneWeekAgo || $value > $now) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}