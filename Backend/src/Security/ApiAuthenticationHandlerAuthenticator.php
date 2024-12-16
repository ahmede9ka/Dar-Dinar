<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * ApiAuthenticator handles API token-based authentication.
 */
class ApiAuthenticationHandlerAuthenticator extends AbstractAuthenticator
{
    /**
     * Check if the authenticator supports this request based on the presence of a specific header.
     */
    public function supports(Request $request): ?bool
    {
        // Here, we check if the request contains the required authentication token.
        return $request->headers->has('Authorization') && strpos($request->headers->get('Authorization'), 'Bearer ') === 0;
    }

    /**
     * Perform the actual authentication using the provided API token.
     */
    public function authenticate(Request $request): Passport
    {
        // Extract the API token from the Authorization header.
        $authorizationHeader = $request->headers->get('Authorization');
        $apiToken = substr($authorizationHeader, 7); // Remove "Bearer " prefix.

        if (null === $apiToken) {
            throw new CustomUserMessageAuthenticationException('No API token provided');
        }

        // Here, you would look up the user based on the API token.
        // For example, fetching the user from the database.
        $user = $this->findUserByToken($apiToken);

        if (!$user) {
            throw new CustomUserMessageAuthenticationException('Invalid API token');
        }

        return new SelfValidatingPassport(new UserBadge($user->getUsername())); // Authenticate with user badge.
    }

    /**
     * Find the user by API token.
     *
     * @param string $apiToken
     * @return User|null
     */
    private function findUserByToken(string $apiToken): ?User
    {
        // Assuming you have a UserRepository to fetch user by token.
        // Replace this with your actual logic to fetch the user.
        return $this->userRepository->findOneByApiToken($apiToken);
    }

    /**
     * Called after successful authentication.
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): JsonResponse
    {
        $user = $token->getUser();
        return new JsonResponse([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail()
            ]
        ], Response::HTTP_OK);
    }

    /**
     * Called after authentication failure.
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse([
            'status' => 'error',
            'message' => 'Authentication failed',
            'error' => $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }

    // Optional: If you want to handle entry point for anonymous users, uncomment and implement start() method.
    // public function start(Request $request, AuthenticationException $authException = null): Response
    // {
    //     return new JsonResponse([
    //         'status' => 'error',
    //         'message' => 'Unauthorized',
    //     ], Response::HTTP_UNAUTHORIZED);
    // }
}
