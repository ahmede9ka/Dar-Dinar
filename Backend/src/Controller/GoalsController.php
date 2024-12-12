<?php

namespace App\Controller;

use App\Entity\Goals;
use App\Repository\GoalsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/goals', name: 'api_goals_')]
class GoalsController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(GoalsRepository $goalsRepository): JsonResponse
    {
        $goals = $goalsRepository->findAll();
        return $this->json($goals, 200);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Goals $goal): JsonResponse
    {
        return $this->json($goal, 200);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $goal = new Goals();
        $goal->setGoal($data['goal'] ?? '');
        $goal->setDesiredSum($data['desiredSum'] ?? 0.0);
        $goal->setActualSum($data['actualSum'] ?? 0.0);
        $goal->setReached($data['reached'] ?? false);

        // Validate the goal entity
        $errors = $validator->validate($goal);
        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $entityManager->persist($goal);
        $entityManager->flush();

        return $this->json($goal, 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Request $request,
        Goals $goal,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['goal'])) {
            $goal->setGoal($data['goal']);
        }
        if (isset($data['desiredSum'])) {
            $goal->setDesiredSum($data['desiredSum']);
        }
        if (isset($data['actualSum'])) {
            $goal->setActualSum($data['actualSum']);
        }
        if (isset($data['reached'])) {
            $goal->setReached($data['reached']);
        }

        // Validate the updated entity
        $errors = $validator->validate($goal);
        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $entityManager->flush();

        return $this->json($goal, 200);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Goals $goal, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($goal);
        $entityManager->flush();

        return $this->json(['message' => 'Goal deleted successfully'], 200);
    }
}
