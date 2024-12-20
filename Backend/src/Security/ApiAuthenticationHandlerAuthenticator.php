<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Doctrine\ORM\EntityManagerInterface;
/**
 * ApiAuthenticationHandlerAuthenticator handles email and password authentication.
 */
class ApiAuthenticationHandlerAuthenticator extends AbstractAuthenticator
{
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager; // Inject the EntityManagerInterface

    
    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher,EntityManagerInterface $entityManager)
    {
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    /**
     * Check if the authenticator supports this request based on content type and body.
     */
    public function supports(Request $request): ?bool
    {
        //dd($request);
        return $request->isMethod('POST') && ($request->getPathInfo() === '/login' || $request->getPathInfo() === '/register');
    }

    /**
     * Perform the actual authentication using the provided email and password.
     */
    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        

        if (!isset($data['email'], $data['password'])) {
            throw new CustomUserMessageAuthenticationException('Email and password are required.');
        }

        $email = $data['email'];
        $password = $data['password'];

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new CustomUserMessageAuthenticationException('Invalid credentials.');
        }

        return new SelfValidatingPassport(new UserBadge($email));
    }

    

    /**
     * Called after successful authentication.
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return new JsonResponse(['status' => 'error', 'message' => 'Email is missing from the request.'], Response::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['status' => 'error', 'message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Called after authentication failure.
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        if ($request->getPathInfo() === '/register') {
            $data = json_decode($request->getContent(), true);
            //dd($data);
            if (!isset($data['email'], $data['username'], $data['password'], $data['date'], $data['sex'])) {
                return new JsonResponse(['error' => $request], Response::HTTP_BAD_REQUEST);
            }

            try {
                $providedDate = new \DateTime($data['date']);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Invalid date format.'], Response::HTTP_BAD_REQUEST);
            }

            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return new JsonResponse(['error' => 'Email is already in use.'], Response::HTTP_CONFLICT);
            }

            // File upload handling
            

            $user = new User();
            $user->setEmail($data['email']);
            $user->setUsername($data['username']);
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
            $user->setIsVerified(false);
            $user->setSex($data['sex']);
            $user->setDate($providedDate);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'User registered successfully.'], Response::HTTP_CREATED);
        }

        return new JsonResponse([
            'status' => 'error',
            'message' => 'Authentication failed.',
            'error' => $exception->getMessage(),
        ], Response::HTTP_UNAUTHORIZED);
    }
}
