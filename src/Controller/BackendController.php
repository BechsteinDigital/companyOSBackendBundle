<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BackendController extends AbstractController
{
    #[Route('/admin', name: 'companyos_admin')]
    public function index(): Response
    {
        return $this->render('@CompanyOSBackend/backend/base.html.twig');
    }
} 