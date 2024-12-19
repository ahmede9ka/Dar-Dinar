<?php

namespace App\Controller;

use App\Entity\Masrouf;
use App\Entity\User;
use App\Repository\MasroufRepository;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\DBAL\Connection;


class MasroufController extends AbstractController
{
    private $masroufRepository;
    private $connection;

    public function __construct(MasroufRepository $masroufRepository, Connection $connection)
    {
        $this->masroufRepository = $masroufRepository;
        $this->connection = $connection;
    }

    /**
     * @throws Exception
     */
    #[Route('/api/masrouf', name: 'api_masrouf_index', methods: ['GET'])]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([], 200); // If no user is authenticated, return an empty array or some other appropriate response
        }

        // Fetch all Masrouf records belonging to the authenticated user
        $masroufs = $this->masroufRepository->findBy(['user' => $user]);

        // Transform the entities into an array for JSON response
        $data = array_map(function ($masrouf) {
            return [
                'id' => $masrouf->getId(),
                'value' => $masrouf->getValue(),
                'date' => $masrouf->getDate()?->format('Y-m-d'),
                'type' => $masrouf->getType(),
            ];
        }, $masroufs);

        return $this->json($data, 200);
    }


    #[Route('/api/masrouf/{id}', name: 'api_masrouf_show', methods: ['GET'])]
    public function show(Masrouf $masrouf): JsonResponse
    {
        return $this->json($masrouf, 200);
    }

    #[Route('/api/masrouf', name: 'api_masrouf_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $masrouf = new Masrouf();
        $masrouf->setValue($data['value'] ?? null);
        $masrouf->setDate(isset($data['date']) ? new \DateTime($data['date']) : null);
        $masrouf->setType($data['type'] ?? null);

        // Set the user to the currently authenticated user
        if ($user) {
            $masrouf->setUser($user); // Associate the Masrouf with the authenticated user
        }

        // Validate the entity
        $errors = $validator->validate($masrouf);
        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $entityManager->persist($masrouf);
        $entityManager->flush();

        return $this->json($masrouf, 201);
    }


    #[Route('/api/masrouf/{id}', name: 'api_masrouf_update', methods: ['PUT'])]
    public function update(
        Request $request,
        Masrouf $masrouf,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        // Check if the authenticated user is the owner of the masrouf
        if ($masrouf->getUser() !== $user) {
            return $this->json([
                'message' => 'Unauthorized action',
            ], 403); // Forbidden
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['value'])) {
            $masrouf->setValue($data['value']);
        }
        if (isset($data['date'])) {
            $masrouf->setDate(new \DateTime($data['date']));
        }
        if (isset($data['type'])) {
            $masrouf->setType($data['type']);
        }

        // Validate the updated entity
        $errors = $validator->validate($masrouf);
        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $entityManager->flush();

        return $this->json($masrouf, 200);
    }


    #[Route('/api/masrouf/{id}', name: 'api_masrouf_delete', methods: ['DELETE'])]
    public function delete(
        Masrouf $masrouf,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if(!$user){
            return $this->json(['message' => 'Unauthorized delete'], 404);
        }
        $entityManager->remove($masrouf);
        $entityManager->flush();

        return $this->json(['message' => 'Masrouf deleted successfully'], 200);
    }

    /**
     * @return JsonResponse
     * @throws Exception
     */
    #[Route('/api/getmonthmasroufbytype', name: 'api_masrouf_monthly_by_type', methods: ['GET'])]
    public function getMonthMasroufByType(#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            // Get the current year and month
            $currentYear = date('Y');
            $currentMonth = date('m');

            // Execute the query to fetch data grouped by type
            $result = $this->connection->fetchAllAssociative('
            SELECT 
                m.type AS type,
                SUM(m.value) AS total_value
            FROM masrouf m
            WHERE YEAR(m.date) = :year AND MONTH(m.date) = :month AND m.user_id=:user
            GROUP BY m.type
            ORDER BY m.type;
        ', ['year' => $currentYear, 'month' => $currentMonth,'user'=>$user->getId()]);

            // If no data is found, return an empty array
            if (!$result) {
                return $this->json([], 200);
            }

            // Format the result
            $formattedResult = array_map(function ($row) {
                return [
                    'type' => $row['type'],
                    'total_value' => (int) $row['total_value'],
                ];
            }, $result);

            return $this->json($formattedResult, 200);
        } catch (\Exception $e) {
            // Log the error and return an error response
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/api/getallmasroufmonth', name: 'api_masrouf_monthly_all', methods: ['GET'])]
    public function getAllMonthMasrouf(Request $request,#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            $year = $request->query->get('year', date('Y'));
            $month = $request->query->get('month', date('m'));

            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM masrouf m
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


    #[Route('/api/getallmasroufyear', name: 'api_masrouf_year_all', methods: ['GET'])]
    public function getAllYearMasrouf(Request $request,#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            $year = $request->query->get('year', date('Y'));


            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM masrouf m
            WHERE YEAR(m.date) = :year AND m.user_id=:user', ['year' => $year,'user'=>$user->getId()]);

            $totalValue = $result;

            return $this->json($totalValue, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching yearly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/api/getallmasrouf', name: 'api_masrouf_all', methods: ['GET'])]
    public function getAllMasrouf(#[CurrentUser] ?User $user): JsonResponse
    {
        try {


            $result = $this->connection->fetchAllAssociative('SELECT 
                SUM(m.value) AS total_value
            FROM masrouf m WHERE m.user_id=:user',['user'=>$user->getId()]);

            $totalValue = $result;

            return $this->json($totalValue, 200);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'An error occurred while fetching monthly data',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    #[Route('/api/getmasroufmonth', name: 'api_masrouf_month', methods: ['GET'])]
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
            FROM masrouf m WHERE m.user_id = :user
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
