<?php

namespace CompanyOS\BundleBackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BackendController extends AbstractController
{
    #[Route('/{route}', name: 'companyos_backend', requirements: ['route' => '.*'], defaults: ['route' => ''])]
    public function index(string $route = ''): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }
} 