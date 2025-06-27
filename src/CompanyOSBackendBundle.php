<?php

namespace CompanyOS\Bundle\BackendBundle;

use CompanyOS\Bundle\BackendBundle\DependencyInjection\CompanyOSBackendExtension;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class CompanyOSBackendBundle extends Bundle
{
    public function getContainerExtension(): CompanyOSBackendExtension
    {
        return new CompanyOSBackendExtension();
    }

    public function getPath(): string
    {
        return \dirname(__DIR__);
    }

    public function loadRoutes(RoutingConfigurator $routes): void
    {
        $routes->import($this->getPath() . '/Resources/config/routes.yaml');
    }
} 