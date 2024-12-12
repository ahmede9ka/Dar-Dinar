<?php

namespace App\Controller;

use App\Entity\Revenue;
use App\Repository\RevenueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/revenues')]
class RevenueController extends AbstractController
{
    #[Route(name: 'api_revenues_index', methods: ['GET'])]
    public function index(RevenueRepository $revenueRepository): Response
    {
        return $this->json($revenueRepository->findAll(), 200, [], ['groups' => ['revenue:read']]);
    }

    #[Route(name: 'api_revenues_new', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $revenue = new Revenue();
        $revenue->setValue($data['value']);
        $revenue->setDate(new \DateTime($data['date']));

        $entityManager->persist($revenue);
        $entityManager->flush();

        return $this->json($revenue, 201);
    }

    #[Route('/{id}', name: 'api_revenues_show', methods: ['GET'])]
    public function show(Revenue $revenue): Response
    {
        return $this->json($revenue, 200);
    }

    #[Route('/{id}', name: 'api_revenues_edit', methods: ['PUT'])]
    public function update(Request $request, Revenue $revenue, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $revenue->setValue($data['value']);
        $revenue->setDate(new \DateTime($data['date']));

        $entityManager->flush();

        return $this->json($revenue, 200);
    }

    #[Route('/{id}', name: 'api_revenues_delete', methods: ['DELETE'])]
    public function delete(Revenue $revenue, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($revenue);
        $entityManager->flush();

        return $this->json(null, 204); // No content
    }
}
