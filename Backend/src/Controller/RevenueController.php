<?php

namespace App\Controller;

use App\Entity\Revenue;
use App\Repository\RevenueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/revenues')]
class RevenueController extends AbstractController
{
    #[Route(name: 'api_revenues_index', methods: ['GET'])]
    public function index(RevenueRepository $repository): JsonResponse
    {
        $revenues = $repository->findAll();
        return $this->json($revenues);
    }

    #[Route(name: 'api_revenues_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $revenue = new Revenue();
        $revenue->setValue($data['value']);
        $revenue->setDate(new \DateTime($data['date']));
        $revenue->setType($data['type']);

        $em->persist($revenue);
        $em->flush();

        return $this->json($revenue, 201);
    }

    #[Route('/{id}', name: 'api_revenues_show', methods: ['GET'])]
    public function show(Revenue $revenue): JsonResponse
    {
        return $this->json($revenue);
    }

    #[Route('/{id}', name: 'api_revenues_update', methods: ['PUT'])]
    public function update(Request $request, Revenue $revenue, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $revenue->setValue($data['value']);
        $revenue->setDate(new \DateTime($data['date']));
        $revenue->setType($data['type']);

        $em->flush();

        return $this->json($revenue);
    }

    #[Route('/{id}', name: 'api_revenues_delete', methods: ['DELETE'])]
    public function delete(Revenue $revenue, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($revenue);
        $em->flush();

        return $this->json(null, 204); // No content
    }
}
