<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public const HORLINGS_REFERENCE = 'User_Horlings';
    public const PETERS_REFERENCE = 'User_Peters';
    public const EDEN_REFERENCE = 'User_Eden';
    public const JACOBS_REFERENCE = 'User_Jacobs';

    private $passwordEncoder;

    public function __construct(UserPasswordHasherInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        // Create Users
        $entity = new User();
        $entity->setEmail('j.horlings@amsterdam.nl')
            ->setPassword($this->passwordEncoder->hashPassword(
                $entity,
                'j.horlings_password'));
        $manager->persist($entity);
        $this->addReference(self::HORLINGS_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('d.peters@leiden.nl')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->passwordEncoder->hashPassword(
                $entity,
                'd.peters_password'));
        $manager->persist($entity);
        $this->addReference(self::PETERS_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('n.eden@groningen.nl')
            ->setPassword($this->passwordEncoder->hashPassword(
                $entity,
                'n.eden_password'));
        $manager->persist($entity);
        $this->addReference(self::EDEN_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('s.jacobs@groningen.nl')
            ->setPassword($this->passwordEncoder->hashPassword(
                $entity,
                's.jacobs_password'));
        $manager->persist($entity);
        $this->addReference(self::JACOBS_REFERENCE, $entity);

        $manager->flush();
    }
}
