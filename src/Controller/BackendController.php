<?php

namespace CompanyOS\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BackendController extends AbstractController
{
    #[Route('/', name: 'companyos_backend')]
    public function index(): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }
} 