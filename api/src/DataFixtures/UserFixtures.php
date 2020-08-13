<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
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
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                'j.horlings_password'));
        $manager->persist($entity);

        $entity = new User();
        $entity->setEmail('d.peters@leiden.nl')
            ->setRoles(['ROLE_ADMINISTRATOR'])
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                'd.peters_password'));
        $manager->persist($entity);

        $entity = new User();
        $entity->setEmail('n.eden@groningen.nl')
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                'n.eden_password'));
        $manager->persist($entity);

        $entity = new User();
        $entity->setEmail('s.jacobs@groningen.nl')
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                's.jacobs_password'));
        $manager->persist($entity);

        $manager->flush();
    }
}