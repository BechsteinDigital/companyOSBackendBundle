<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class BackendController extends AbstractController
{
    public function index(string $route = ''): Response
    {
        return $this->render('@CompanyOSBackend/backend.html.twig');
    }
} 