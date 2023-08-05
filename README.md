Chapter 7: Authentication - Api
===============================

The environment is te same as in the chapter6-api branche, except:
- instructions from README.md of chapter6-api where applied,

This chapter adds JWT authentication


Installing LexikJWTAuthenticationBundle
---------------------------------------
Please follow the instruction in [the api platform documentation](https://api-platform.com/docs/core/jwt/#installing-lexikjwtauthenticationbundle)
under "Installing LexikJWTAuthenticationBundle".

This will add the following to api/.env:
```shell environment
###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=9fe20a8b7757fa9e800b6eb23dfb0145
###< lexik/jwt-authentication-bundle ###
```

The JWT_PASSPHRASE corresponds to the secret and public keys in the key files that where
also generated. The key files are not in git, so if the JWT_PASSPHRASE is in git and
you switch to another branch it gets replaced by our version and that will not work.

Cut the line with JWT_PASSPHRASE, Create a new file api/.env.local
and paste the line there. Because the file api/.env.local is not in git, it will
not be replaced by our version when you switch to some other branch.

The downside may be that if you install the app in production using git the passphrase will
nog get installed. But this tutorial is not meant for production so that should be no problem.

User classes<a name="User"></a>
------------

You can follow the instructions in [the symfon docs](https://symfony.com/doc/current/security.html#a-create-your-user-class)
but then afterwards you may need to chown the files that where created and
api/config/packages/security.yaml to your own user so that you
can edit them and git can add, remove and replace them. Or you can add them
manually following the instructions below.

Add a new file User.php in folder api/src/Entity with content:
```php
<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

/**
 */
#[ORM\Entity (repositoryClass:UserRepository::class)]
#[ORM\Table (name:"`user`")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @var int
     */
    #[ORM\Id()]
    #[ORM\GeneratedValue()]
    #[ORM\Column(type:"integer")]
    private $id;

    /**
     * @var string
     */
    #[ORM\Column(type:"string", length:180, unique:true)]
    private $email;


    /**
     * @var array
     */
    #[ORM\Column(type:"json")]
    private $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column(type:"string")]
    private $password;

    public function getId() : ?int
    {
        return $this->id;
    }

    public function getEmail() : ?string
    {
        return $this->email;
    }

    public function setEmail(string $email) : self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername() : string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles() : array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles) : self
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword() : string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password) : self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /** {@inheritdoc} */
    public function getUserIdentifier() : string
    {
        return $this->getEmail();
    }
```

Create a new folder Repository under api/src/ and add the
file UserRepository.ph to it with the following content:
```php
<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newEncodedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }
}

```

To migrate the database execute the following on the shell prompt:
```shell
docker compose exec php bin/console doctrine:migrations:diff
docker compose exec php bin/console doctrine:migrations:migrate
```


User Fixtures<a name="Fixtures"></a>
-------------

And to add the users, create a new file api/src/DataFixtures/UserFixtures.php
with the following content:
```php
<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    public const HORLINGS_REFERENCE = 'User_Horlings';
    public const PETERS_REFERENCE = 'User_Peters';
    public const EDEN_REFERENCE = 'User_Eden';
    public const JACOBS_REFERENCE = 'User_Jacobs';

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
        $this->addReference(self::HORLINGS_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('d.peters@leiden.nl')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                'd.peters_password'));
        $manager->persist($entity);
        $this->addReference(self::PETERS_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('n.eden@groningen.nl')
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                'n.eden_password'));
        $manager->persist($entity);
        $this->addReference(self::EDEN_REFERENCE, $entity);

        $entity = new User();
        $entity->setEmail('s.jacobs@groningen.nl')
            ->setPassword($this->passwordEncoder->encodePassword(
                $entity,
                's.jacobs_password'));
        $manager->persist($entity);
        $this->addReference(self::JACOBS_REFERENCE, $entity);

        $manager->flush();
    }
}
```

To clear the database and execute all fixtures enter the following command:
```shell
docker compose exec php bin/console doctrine:fixtures:load
```
Say yes to 'Careful, database "api" will be purged. Do you want to continue?'
(You will loose all data in the database of your api-platform install).


Configuring the Symfony SecurityBundle<a name="Configuration"></a>
--------------------------------------
Please follow the instruction in [the api platform documentation](https://api-platform.com/docs/core/jwt/#configuring-the-symfony-securitybundle) under "update the security configuration" except for the dev: firewall and
"declare the route used for /authentication_token".

To enable testing the api through https://localhost/docs
you also need to add the configuration from
[Documenting the Authentication Mechanism with Swagger/Open API](https://api-platform.com/docs/core/jwt/#configuring-api-platform).

You can now test the authentication by going to https://localhost/docs
and executing an operation. Each operation should result in 401 Unauthorized with:
```json
{
  "code": 401,
  "message": "JWT Token not found"
}
```

Getting a token and testing it<a name="GetToken"></a>
------------------------------

You can continue with the instructions on [Adding endpoint to SwaggerUI to retrieve a JWT token](https://api-platform.com/docs/core/jwt/#adding-endpoint-to-swaggerui-to-retrieve-a-jwt-token) or you can simply run the following shell command:
```shell
curl -X POST -H "Content-Type: application/json" https://localhost/auth -d '{"email":"d.peters@leiden.nl","password":"d.peters_password"}' -k
```
this should output something like:
```json
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1OTU5NTA0MjUsImV4cCI6MTU5NTk1NDAyNSwicm9sZXMiOlsiUk9MRV9BRE1JTklTVFJBVE9SIiwiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZC5wZXRlcnNAbGVpZGVuLm5sIn0.vT2QoRL5jc9MEtCFeqK6TRoG2oA5miV8NUFr3rp3k7TLwWEa32wak9V9ufN5h-tmsXLGG3FyLjGQ9Nw5mBU0O66O7t20VEUarTR2mCqx-Opmli55-0ka6BlsfP6Oy4t-ZUEMXB_d_HB0joOYXc6zt27ZUbUuVoJ-AFg3SX8BET7Q1QjoMChwFA2Asuh7b7V6w0E3FmDUdpQn2AEawz7jdwClbdl6MftlBqYsc1Xmq4pFw6tB7-ogVP4xfP-mAJuBgQcFRjktAj3ksqPtNwQX4fHKZc5IUltqlrZf5mOnW-Eo67MhzA4wS5vh_vTrjmlJC4Cfg2tm8yFqTEsYnAQORjBlvFeNjko2nnOeEs0Aq9xO5CGKTPrg9L9TqCK-SbevjHjLgfUDRfh1L54Xwww2g4aEN0jqMo-mFjl6DtNVw9j4lze3g9I1QhNvscZ_i7SfeFnt7fy0IWxzH75b811LGryEK0vSvcqLc6nI71ZsNToUcRNczsJOql_TGBV_aLCxNNIq0ODd6IMSfuAns6l3GbDhs-3u6Y7N-8H8SSJMo4k3zW-V28Rldq-TQogXrEk0pIxk9QmSCYBGZHzKfxZbAy8jndzcea1CGRnlazLaYAEqvfgtqwjgJjNbG6f5UCuf8dGGGUa14uwBsUlPgGs3B8aiTzeUAMzqIyZYAHhlJFA"}
```

If you go to https://localhost/docs there should be a button "Authorize".
Press it an type "Bearer " (without the quotes but with the space) and then paste the token
from your curl output (without the quotes) and press "Authorize". This does not send the token
to the api so it is not yet get validated. But as soon as you try to execute anything in the
Swagger UI it will send what you entered as Authorization header to the api so that you should
get the normal response instead of 401 Unauthorized.

Next
----
Let git compare your own code with the branche of the next chapter
so that you can see the differences right away. For example:
```shell
git diff origin/chapter8-api 
```
will compare your own version with code one of chapter8-api. You may also add the path
to a folder of file to make the diff more specific.

After committing your changes you may check out branch chapter7-react,
restart docker compose, point your browser to the [same branch on github](https://github.com/metaclass-nl/tutorial-api-platform/tree/chapter7-react)
and follow the instructions. Or if you only follow the api branches chapter8-api.
