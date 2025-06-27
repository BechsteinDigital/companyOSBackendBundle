<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class BackendController extends AbstractController
{
    public function getCsrfToken(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        // CSRF-Token für Authentifizierung generieren
        $token = $csrfTokenManager->getToken('authenticate')->getValue();
        
        return $this->json([
            'token' => $token,
            'tokenId' => 'authenticate'
        ]);
    }

    public function index(string $route = ''): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }
} 