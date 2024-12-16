<?php

namespace App\Controller;

use App\Entity\Goals;
use App\Entity\User;
use App\Repository\GoalsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Controller\MasroufController;
use App\Controller\RevenueController;


class GoalsController extends AbstractController
{
    private $masroufContoller;
    private $revenueController;

    public function __construct(MasroufController $masroufController, RevenueController $revenueController)
    {
        $this->masroufContoller = $masroufController;
        $this->revenueController = $revenueController;
    }


    #[Route('/api/goals', name: 'api_goals_index', methods: ['GET'])]
    public function index(GoalsRepository $goalsRepository, Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if ($user) {
            $goals = $goalsRepository->findBy(['user' => $user]); // Use the current authenticated user's ID
        } else {
            $goals = $goalsRepository->findAll(); // Get all goals if no user is authenticated
        }

        return $this->json($goals, 200);
    }

    #[Route('/api/goals/{id}', name: 'api_goals_show', methods: ['GET'])]
    public function show(Goals $goal): JsonResponse
    {
        return $this->json($goal, 200);
    }

    #[Route('/api/goals', name: 'api_goals_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        #[CurrentUser] ?User $user
    ): JsonResponse {


        if (!$user) {
            return $this->json(['message' => $user], 401);
        }

        $data = json_decode($request->getContent(), true);

        $goal = new Goals();
        $goal->setGoal($data['goal'] ?? '');
        $goal->setDesiredSum($data['desiredSum'] ?? 0.0);
        $goal->setActualSum($data['actualSum'] ?? 0.0);
        $goal->setReached($data['reached'] ?? false);
        $goal->setUser($user); // Associate the goal with the user

        // Validate the goal entity
        $errors = $validator->validate($goal);
        if (count($errors) > 0) {
            return $this->json(['message' => 'Validation failed', 'errors' => (string) $errors], 400);
        }

        $entityManager->persist($goal);
        $entityManager->flush();

        return $this->json($goal, 201);
    }

    #[Route('/api/goals/{id}', name: 'api_goals_update', methods: ['PUT'])]
    public function update(
        Request $request,
        Goals $goal,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        #[CurrentUser] ?User $user
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

    #[Route('/api/goals/{id}', name: 'api_goals_delete', methods: ['DELETE'])]
    public function delete(Goals $goal, EntityManagerInterface $entityManager,#[CurrentUser] ?User $user): JsonResponse
    {
        $entityManager->remove($goal);
        $entityManager->flush();

        return $this->json(['message' => 'Goal deleted successfully'], 200);
    }

    #[Route('/api/zidflouslelgoal/{id}', name: 'api_zid_flous_goal', methods: ['GET'])]
    public function zidFlousLelGoal(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator,#[CurrentUser] ?User $user): JsonResponse
    {
        // Extract ID from route parameter
        $id = $request->get('id');
        $goal = $entityManager->find(Goals::class, $id);

        if (!$goal) {
            return $this->json(['status' => false, 'message' => 'Goal not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['zyeda'])) {
            return $this->json(['status' => false, 'message' => 'Missing "zyeda" parameter'], 400);
        }

        $output = $this->masroufContoller->getAllMasrouf();
        $input = $this->revenueController->getAllRevenue();
        $somme = json_decode($input->getContent(), true)[0]['total_value'] - json_decode($output->getContent(), true)[0]['total_value'];

        $zyeda = (float) $data['zyeda'];

        // Adjust 'zyeda' if it exceeds the remaining desired amount
        if ($zyeda + $goal->getActualSum() > $goal->getDesiredSum()) {
            $zyeda = $goal->getDesiredSum() - $goal->getActualSum();
        }
        $data['value'] = $zyeda;
        $data['date'] = (new \DateTime())->format('Y-m-d H:i:s');
        $data['type'] = "goal";
        $data['goal'] = $goal->getGoal();
        $data['desiredSum'] = $goal->getDesiredSum();
        $data['actualSum'] = $goal->getDesiredSum();
        $data['reached'] = true;
// Create a new request with updated JSON body
        $newRequest = new Request(
            $request->query->all(),
            [], // POST/form data
            $request->attributes->all(),
            $request->cookies->all(),
            $request->files->all(),
            $request->server->all(),
            json_encode($data) // Pass updated JSON body as the content
        );

        if ($zyeda <= $somme) {

            $this->masroufContoller->create($newRequest, $entityManager, $validator); // Ensure proper arguments for the update method
            if($zyeda + $goal->getActualSum() == $goal->getDesiredSum()){
                $this->update($newRequest,$goal,$entityManager, $validator,$user);
            }
            return $this->json(["status" => true], 200);
        }

        return $this->json(['status' => false, 'message' => 'too much zyeda'], 500);
    }





}
