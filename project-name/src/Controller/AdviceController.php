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

#[Route('/api/advice')]
final class AdviceController extends AbstractController
{
    #[Route('/', name: 'api_advice_index', methods: ['GET'])]
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

    #[Route('/new', name: 'api_advice_new', methods: ['POST'])]
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

    #[Route('/{id}', name: 'api_advice_show', methods: ['GET'])]
    public function show(Advice $advice): JsonResponse
    {
        return $this->json([
            'id' => $advice->getId(),
            'type' => $advice->getType(),
            'message' => $advice->getMessage(),
        ]);
    }

    #[Route('/{id}/edit', name: 'api_advice_edit', methods: ['PUT', 'PATCH'])]
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

    #[Route('/{id}', name: 'api_advice_delete', methods: ['DELETE'])]
    public function delete(Advice $advice, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($advice);
        $entityManager->flush();

        return $this->json(['status' => 'Advice deleted']);
    }
}
