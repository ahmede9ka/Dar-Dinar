<?php

namespace App\Controller;

use App\Entity\Masrouf;
use App\Repository\MasroufRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/masrouf', name: 'api_masrouf_')]
class MasroufController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(MasroufRepository $masroufRepository): JsonResponse
    {
        $masroufs = $masroufRepository->findAll();

        return $this->json($masroufs, 200, [], ['groups' => 'masrouf:read']);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Masrouf $masrouf): JsonResponse
    {
        return $this->json($masrouf, 200, [], ['groups' => 'masrouf:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $masrouf = new Masrouf();
        $masrouf->setValue($data['value']);
        $masrouf->setDate(new \DateTime($data['date']));

        $entityManager->persist($masrouf);
        $entityManager->flush();

        return $this->json($masrouf, 201, [], ['groups' => 'masrouf:read']);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, Masrouf $masrouf, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['value'])) {
            $masrouf->setValue($data['value']);
        }
        if (isset($data['date'])) {
            $masrouf->setDate(new \DateTime($data['date']));
        }

        $entityManager->flush();

        return $this->json($masrouf, 200, [], ['groups' => 'masrouf:read']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Masrouf $masrouf, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($masrouf);
        $entityManager->flush();

        return $this->json(['message' => 'Masrouf deleted successfully'], 200);
    }
}
