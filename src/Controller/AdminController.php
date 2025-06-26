<?php

namespace CompanyOS\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'companyos_admin')]
    public function index(): Response
    {
        return $this->render('@CompanyOSBackend/admin.html.twig');
    }
} 