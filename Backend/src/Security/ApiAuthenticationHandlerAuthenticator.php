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

/**
 * ApiAuthenticationHandlerAuthenticator handles email and password authentication.
 */
class ApiAuthenticationHandlerAuthenticator extends AbstractAuthenticator
{
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * Check if the authenticator supports this request based on content type and body.
     */
    public function supports(Request $request): ?bool
    {
        return $request->isMethod('POST') && $request->getPathInfo() === '/login';
    }

    /**
     * Perform the actual authentication using the provided email and password.
     */
    public function authenticate(Request $request): Passport
    {
        // Parse the request body to extract email and password
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            throw new CustomUserMessageAuthenticationException('Email and password are required.');
        }

        $email = $data['email'];
        $password = $data['password'];

        // Retrieve the user by email
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            throw new CustomUserMessageAuthenticationException('Invalid credentials.');
        }

        // Validate the password
        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new CustomUserMessageAuthenticationException('Invalid credentials.');
        }

        // Return a Passport with the authenticated user's email
        return new SelfValidatingPassport(new UserBadge($email));
    }

    /**
     * Called after successful authentication.
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
{
    // Extract email from the request body
    $data = json_decode($request->getContent(), true);

    if (!isset($data['email'])) {
        return new JsonResponse([
            'status' => 'error',
            'message' => 'Email is missing from the request.',
        ], Response::HTTP_BAD_REQUEST);
    }

    $email = $data['email'];

    // Fetch the user from the database
    $user = $this->userRepository->findOneBy(['email' => $email]);

    if (!$user) {
        return new JsonResponse([
            'status' => 'error',
            'message' => 'User not found.',
        ], Response::HTTP_NOT_FOUND);
    }

    // Return a success response with user data
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
        return new JsonResponse([
            'status' => 'error',
            'message' => 'Authentication failed.',
            'error' => $exception->getMessage(),
        ], Response::HTTP_UNAUTHORIZED);
    }
}
