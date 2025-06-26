<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BackendController extends AbstractController
{
    #[Route('/{route}', name: 'company_os_backend', requirements: ['route' => '.*'], defaults: ['route' => ''])]
    public function index(string $route = ''): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }
} 