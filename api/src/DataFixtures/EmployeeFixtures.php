<?php

namespace App\DataFixtures;

use App\Entity\Employee;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class EmployeeFixtures extends Fixture
{
    public const HORLINGS_REFERENCE = 'Employee_Horlings';
    public const PETERS_REFERENCE = 'Employee_Peters';
    public const EDEN_REFERENCE = 'Employee_Eden';
    public const JACOBS_REFERENCE = 'Employee_Jacobs';

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        // Create Employees
        $entity = new Employee();
        $entity->setFirstname('John')
            ->setLastname('Horlings')
            ->setAddress('Wezelstraat 32')
            ->setZipcode('')
            ->setCity('Amsterdam')
            ->setBirthDate(new \DateTime('1971-02-18'))
            ->setArrival(new \DateTime('08:30'))
            ->setFunction('programmer');
        $manager->persist($entity);
        $this->addReference(self::HORLINGS_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Debby')
            ->setLastname('Peters')
            ->setAddress('Hoofdweg 71')
            ->setZipcode('1537 WL')
            ->setCity('Leiden')
            ->setBirthDate(new \DateTime('1965-09-03'))
            ->setArrival(new \DateTime('08:00'))
            ->setFunction('director');
        $manager->persist($entity);
        $this->addReference(self::PETERS_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Nicky')
            ->setLastname('Eden')
            ->setAddress('Zuiderdiep 17')
            ->setZipcode('9722 AB')
            ->setCity('Groningen')
            ->setBirthDate(new \DateTime('1982-01-28'))
            ->setArrival(new \DateTime('09:30'))
            ->setFunction('architect');
        $manager->persist($entity);
        $this->addReference(self::EDEN_REFERENCE, $entity);

        $entity = new Employee();
        $entity->setFirstname('Simon')
            ->setLastname('Jacobs')
            ->setAddress('Theresiastraat 40')
            ->setZipcode('3214 CW')
            ->setCity('Utrecht')
            ->setBirthDate(new \DateTime('1958-12-16'))
            ->setArrival(new \DateTime('12:30'))
            ->setFunction('designer');
        $manager->persist($entity);
        $this->addReference(self::JACOBS_REFERENCE, $entity);

        $manager->flush();
    }

}