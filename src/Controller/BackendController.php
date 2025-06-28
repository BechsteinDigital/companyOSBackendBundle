<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin")
 */
class BackendController extends AbstractController
{

    #[Route('/{route}', name: 'company_os_backend', requirements: ['route' => '.*'], defaults: ['route' => ''])]
    public function index(): Response
    {
        return $this->render('@CompanyOSBackend/backend/base.html.twig');
    }
} 