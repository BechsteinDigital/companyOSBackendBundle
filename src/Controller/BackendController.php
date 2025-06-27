<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class BackendController extends AbstractController
{
    #[Route('/{route}', name: 'company_os_backend', requirements: ['route' => '.*'], defaults: ['route' => ''])]
    public function index(string $route = ''): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }

    #[Route('/api/csrf-token', name: 'api_csrf_token', methods: ['GET'])]
    public function getCsrfToken(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        // CSRF-Token für Authentifizierung generieren
        $token = $csrfTokenManager->getToken('authenticate')->getValue();
        
        return $this->json([
            'token' => $token,
            'tokenId' => 'authenticate'
        ]);
    }
} 