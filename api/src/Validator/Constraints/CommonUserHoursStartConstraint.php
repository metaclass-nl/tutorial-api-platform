<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
#[\Attribute]
class CommonUserHoursStartConstraint extends Constraint
{
    public $message = 'app.datetime.must_be_in_last_week'; // 'The Hours must start within last week';
}
