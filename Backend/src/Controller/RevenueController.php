<?php

namespace App\Controller;

use App\Entity\Revenue;
use App\Entity\User;
use App\Repository\RevenueRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;


class RevenueController extends AbstractController
{

    private $connection;

    public function __construct(Connection $connection)
    {

        $this->connection = $connection;
    }


    #[Route('/api/revenues',name: 'api_revenues_index', methods: ['GET'])]
    public function index(RevenueRepository $repository, #[CurrentUser] ?User $user): JsonResponse
    {
        if ($user === null) {
            return $this->json(['error' => 'User not authenticated'], 401); // Unauthorized
        }

        $revenues = $repository->findBy(['user' => $user]); // Filter by user

        return $this->json($revenues, 200);
    }

    #[Route('/api/revenues',name: 'api_revenues_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $revenue = new Revenue();
        $revenue->setValue($data['value']);
        $revenue->setDate(new \DateTime($data['date']));
        $revenue->setType($data['type']);
        $revenue->setUser($user); // Associate the revenue with the authenticated user

        $em->persist($revenue);
        $em->flush();

        return $this->json($revenue, 201);
    }


    #[Route('/api/revenues/{id}', name: 'api_revenues_show', methods: ['GET'])]
    public function show(Revenue $revenue): JsonResponse
    {
        return $this->json($revenue);
    }

    #[Route('/api/revenues/{id}', name: 'api_revenues_update', methods: ['PUT'])]
    public function update(Request $request, Revenue $revenue, EntityManagerInterface $em, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user || $revenue->getUser() !== $user) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['value'])) {
            $revenue->setValue($data['value']);
        }
        if (isset($data['date'])) {
            $revenue->setDate(new \DateTime($data['date']));
        }
        if (isset($data['type'])) {
            $revenue->setType($data['type']);
        }

        $em->flush();

        return $this->json($revenue);
    }


    #[Route('/api/revenues/{id}', name: 'api_revenues_delete', methods: ['DELETE'])]
    public function delete(Revenue $revenue, EntityManagerInterface $em,#[CurrentUser] ?User $user): JsonResponse
    {
        if(!$user){
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        $em->remove($revenue);
        $em->flush();

        return $this->json(null, 204); // No content
    }


    #[Route('/api/getmonthlyrevenue', name: 'api_revenues_monthly', methods: ['GET'])]
    public function monthlyRevenue(Request $request,#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            $year = $request->query->get('year', date('Y'));
            $month = $request->query->get('month', date('m'));

            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM revenue m
            WHERE YEAR(m.date) = :year AND MONTH(m.date) = :month AND m.user_id=:user', ['year' => $year, 'month' => $month,'user'=>$user->getId()]);

            $totalValue = $result;

            return $this->json($totalValue, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    #[Route('/api/getyearlyyrevenue', name: 'api_revenues_yearly', methods: ['GET'])]
    public function yearlyRevenue(Request $request,#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            $year = $request->query->get('year', date('Y'));


            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM revenue m
            WHERE YEAR(m.date) = :year AND m.user_id=:user', ['year' => $year,'user'=>$user->getId()]);

            $totalValue = $result;

            return $this->json($totalValue, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/api/getallrevenue', name: 'api_revenues_all', methods: ['GET'])]
    public function getAllRevenue(#[CurrentUser] ?User $user): JsonResponse
    {
        try {


            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM revenue m AND m.user_id=:user', ['user'=>$user->getId()]);

            $totalValue = $result;

            return $this->json($totalValue, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    #[Route('/api/getrevenuemonth', name: 'api_revenue_month', methods: ['GET'])]
    public function getMasroufBymonth(#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            // Generate a list of all months
            $months = [
                1 => 'January',
                2 => 'February',
                3 => 'March',
                4 => 'April',
                5 => 'May',
                6 => 'June',
                7 => 'July',
                8 => 'August',
                9 => 'September',
                10 => 'October',
                11 => 'November',
                12 => 'December',
            ];

            // Query to fetch the sum of values by month
            $result = $this->connection->fetchAllAssociative('
            SELECT 
                MONTH(m.date) AS month, 
                COALESCE(SUM(m.value), 0) AS total_value
            FROM revenue m WHERE m.user_id=:user
            GROUP BY MONTH(m.date)
            ORDER BY month
        ', ['user'=>$user->getId()]);

            // Merge result with all months ensuring all months are included
            $fullResult = [];
            foreach ($months as $monthNumber => $monthName) {
                $found = false;
                foreach ($result as $row) {
                    if ($row['month'] == $monthNumber) {
                        $fullResult[] = [
                            'month' => $monthNumber,
                            'month_name' => $monthName,
                            'total_value' => $row['total_value'],
                        ];
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $fullResult[] = [
                        'month' => $monthNumber,
                        'month_name' => $monthName,
                        'total_value' => 0,
                    ];
                }
            }

            return $this->json($fullResult, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
