<?php

namespace App\DataFixtures;

use App\Entity\Hours;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class HoursFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies()
    {
        return array(
            EmployeeFixtures::class,
        );
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $entity = new Hours();
        $entity->setDescription('developoment invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(6.15)
            ->setStart(new \DateTime('2019-09-13T09:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('unit tests invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-14T14:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('new requirements invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-15T10:10:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('debugging invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::HORLINGS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-16T13:12:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('starting project coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(9.00)
            ->setStart(new \DateTime('2019-09-10T08:54:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('meeting with customer')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-12T22:09:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('handling issues with invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(6.00)
            ->setStart(new \DateTime('2019-09-11T07:37:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('bookkeeper')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-12T15:01:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('presentation invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::PETERS_REFERENCE))
            ->setNHours(10.00)
            ->setStart(new \DateTime('2019-09-13T10:21:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(6.00)
            ->setStart(new \DateTime('2019-09-16T09:09:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('conference on Kubernetes')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(2.00)
            ->setStart(new \DateTime('2019-09-16T08:16:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('lecture on package design')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(2.00)
            ->setStart(new \DateTime('2019-09-13T16:33:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(8.00)
            ->setStart(new \DateTime('2019-09-19T08:47:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('architecture for invoice generator')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-10T10:27:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('meeting with customer')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(5.00)
            ->setStart(new \DateTime('2019-09-12T11:18:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('study')
            ->setEmployee($this->getReference(EmployeeFixtures::EDEN_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-11T14:15:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(7.00)
            ->setStart(new \DateTime('2019-09-11T05:18:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(9.00)
            ->setStart(new \DateTime('2019-09-12T08:34:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('adapting layout of invoices')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(5.00)
            ->setStart(new \DateTime('2019-09-13T12:27:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(8.00)
            ->setStart(new \DateTime('2019-09-14T09:30:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('wireframe for coolkids')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(4.00)
            ->setStart(new \DateTime('2019-09-15T14:54:00'))
            ->setOnInvoice(true);
        $manager->persist($entity);

        $entity = new Hours();
        $entity->setDescription('design eco shop')
            ->setEmployee($this->getReference(EmployeeFixtures::JACOBS_REFERENCE))
            ->setNHours(3.00)
            ->setStart(new \DateTime('2019-09-13T15:03:00'))
            ->setOnInvoice(false);
        $manager->persist($entity);
        $manager->flush();
    }
}