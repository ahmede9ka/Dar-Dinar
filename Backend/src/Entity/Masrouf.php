<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\MasroufRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MasroufRepository::class)]
#[ApiResource(
    collectionOperations: ['get', 'post'], // Collection operations
    itemOperations: ['get', 'put', 'delete'] // Item operations
)]
class Masrouf
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'float')]
    private ?float $value = null;

    #[ORM\Column(type: 'date')]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    /**
     * Get the ID of the Masrouf entity.
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the value of the Masrouf.
     */
    public function getValue(): ?float
    {
        return $this->value;
    }

    /**
     * Set the value of the Masrouf.
     */
    public function setValue(?float $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get the date of the Masrouf.
     */
    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    /**
     * Set the date of the Masrouf.
     */
    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get the type of the Masrouf.
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * Set the type of the Masrouf.
     */
    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
