<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UserController extends AbstractController
{
    


    #[Route('/register', name: 'register', methods: ['POST'])]
public function register(
    Request $request,
    UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $entityManager
): Response {
    $data = $request->request->all();
    $file = $request->files->get('img'); // Retrieve the uploaded file

    // Validate required fields
    if (!isset($data['email'], $data['username'], $data['password'], $data['date'], $data['sex']) || !$file) {
        return new JsonResponse(['error' => 'Invalid data or missing image'], Response::HTTP_BAD_REQUEST);
    }

    // Validate the provided date
    try {
        $providedDate = new \DateTime($data['date']); // Convert the provided date to a DateTime object
    } catch (\Exception $e) {
        return new JsonResponse(['error' => 'Invalid date format'], Response::HTTP_BAD_REQUEST);
    }

    // Check if user already exists
    $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
    if ($existingUser) {
        return new JsonResponse(['error' => 'Email is already in use'], Response::HTTP_CONFLICT);
    }

    // Handle file upload
    $uploadsDir = $this->getParameter('uploads_directory'); // Define this parameter in your config/services.yaml
    $fileName = uniqid() . '.' . $file->guessExtension();
    $file->move($uploadsDir, $fileName);

    $user = new User();
    $user->setEmail($data['email']);
    $user->setUsername($data['username']);
    $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
    $user->setIsVerified(false); // Adjust this if needed
    $user->setImg($fileName); // Store the image file name
    $user->setSex($data['sex']); // Store the sex value

    // Use the setDate method to set the provided date
    $user->setDate($providedDate);

    // Persist user to the database
    $entityManager->persist($user);
    $entityManager->flush();

    return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
}



    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Check if required fields are provided
        if (!isset($data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        // Find the user by username
        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // Verify the password
        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }
        //$apiToken = $this->tokenGenerator->generateToken();
        // Generate a response or token (if you have a token mechanism)
        return new JsonResponse(['message' => 'Login successful'], Response::HTTP_OK);
    }
    #[Route('/logout', name: 'logout', methods: ['GET'])]
    public function logout(Request $request, TokenStorageInterface $tokenStorage): Response
    {

        return new Response('Logout successful', Response::HTTP_OK);
    }
    #[Route('/current', name: 'current', methods: ['GET'])]
    public function getCurrentUser(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No user authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
        ]);
    }
}
