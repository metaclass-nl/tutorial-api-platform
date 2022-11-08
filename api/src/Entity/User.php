<?php

namespace App\Entity;

use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 */
#[ORM\Entity (repositoryClass:UserRepository::class)]
#[ORM\Table (name:"`user`")]
#[ApiResource(operations: [
    new Get(normalizationContext: ['groups' => ['user_get']],
        security: 'is_granted(\'ROLE_ADMIN\') or object == user'),
    new GetCollection(normalizationContext: ['groups' => ['user_list']])],
    order: ['email'])
]
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
    #[Groups(["user_get", "user_list"])]
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

    /**
     * Represent the entity to the user in a single string
     *
     * @return string
     */
    #[Groups (["user_get", "user_list", "employee_get"])]
    #[ApiProperty(iris: ['http://schema.org/name'])]
    public function getLabel()
    {
        return $this->email;
    }

    /**
     * @return bool
     */
    #[Groups(["user_get", "user_list"])]
    public function isAdmin()
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }
}
