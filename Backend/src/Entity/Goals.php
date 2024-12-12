<?php

namespace App\Entity;

use App\Repository\GoalsRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

#[ORM\Entity(repositoryClass: GoalsRepository::class)]
#[ApiResource(
    collectionOperations: ['get', 'post'], // API endpoints for collections
    itemOperations: ['get', 'put', 'delete'] // API endpoints for individual items
)]
class Goals
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $goal = null;

    #[ORM\Column(type: 'float')]
    private ?float $desiredSum = null;

    #[ORM\Column(type: 'float')]
    private ?float $actualSum = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $reached = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGoal(): ?string
    {
        return $this->goal;
    }

    public function setGoal(string $goal): self
    {
        $this->goal = $goal;

        return $this;
    }

    public function getDesiredSum(): ?float
    {
        return $this->desiredSum;
    }

    public function setDesiredSum(float $desiredSum): self
    {
        $this->desiredSum = $desiredSum;

        return $this;
    }

    public function getActualSum(): ?float
    {
        return $this->actualSum;
    }

    public function setActualSum(float $actualSum): self
    {
        $this->actualSum = $actualSum;

        return $this;
    }

    public function isReached(): ?bool
    {
        return $this->reached;
    }

    public function setReached(bool $reached): self
    {
        $this->reached = $reached;

        return $this;
    }
}
