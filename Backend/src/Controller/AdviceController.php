<?php

namespace App\Controller;

use App\Entity\Advice;
use App\Form\AdviceType;
use App\Repository\AdviceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;
final class AdviceController extends AbstractController
{
    private $connection;

    public function __construct(Connection $connection)
    {

        $this->connection = $connection;
    }
    #[Route('/api/advice', name: 'api_advice_index', methods: ['GET'])]
    public function index(AdviceRepository $adviceRepository): JsonResponse
    {
        $adviceList = $adviceRepository->findAll();
        $data = array_map(static fn(Advice $advice) => [
            'id' => $advice->getId(),
            'type' => $advice->getType(),
            'message' => $advice->getMessage(),
        ], $adviceList);

        return $this->json($data);
    }

    #[Route('/api/advice/new', name: 'api_advice_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $advice = new Advice();
        $advice->setType($data['type'] ?? '');
        $advice->setMessage($data['message'] ?? '');

        $entityManager->persist($advice);
        $entityManager->flush();

        return $this->json([
            'status' => 'Advice created',
            'id' => $advice->getId(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/advice/{id}', name: 'api_advice_show', methods: ['GET'])]
    public function show(Advice $advice): JsonResponse
    {
        return $this->json([
            'id' => $advice->getId(),
            'type' => $advice->getType(),
            'message' => $advice->getMessage(),
        ]);
    }

    #[Route('/api/advice/{id}/edit', name: 'api_advice_edit', methods: ['PUT', 'PATCH'])]
    public function edit(Request $request, Advice $advice, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['type'])) {
            $advice->setType($data['type']);
        }
        if (isset($data['message'])) {
            $advice->setMessage($data['message']);
        }

        $entityManager->flush();

        return $this->json(['status' => 'Advice updated']);
    }

    #[Route('/api/advice/{id}', name: 'api_advice_delete', methods: ['DELETE'])]
    public function delete(Advice $advice, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($advice);
        $entityManager->flush();

        return $this->json(['status' => 'Advice deleted']);
    }

    #[Route('/api/random', name: 'api_advice_random', methods: ['GET'])]
    public function random(EntityManagerInterface $entityManager): JsonResponse
    {
        // Get the Advice repository
        $adviceRepository = $entityManager->getRepository(Advice::class);

        // Generate a random ID between 1 and 75
        $randomId = rand(1, 75);

        // Find the advice by random ID
        $advice = $adviceRepository->find($randomId);

        if (!$advice) {
            return $this->json(['status' => false, 'message' => 'Advice not found'], 404);
        }

        // Return the advice details as JSON
        return $this->json([
            'id' => $advice->getId(),
            'type' => $advice->getType(),
            'message' => $advice->getMessage(),
        ]);
    }

    #[Route('/api/getAlltypes', name: 'api_advice_types', methods: ['GET'])]
public function getAlltypes(EntityManagerInterface $entityManager): JsonResponse
{
    // Query to fetch distinct types from the Advice entity
    $query = $this->connection->fetchAllAssociative(
        'SELECT DISTINCT a.type 
         FROM advice a'
    );

    

    // Extracting the 'type' field values into a flat array
    $types = array_map(fn($item) => $item['type'], $query);
   
    return new JsonResponse($types, Response::HTTP_OK);
}
}
