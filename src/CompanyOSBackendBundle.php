<?php

namespace CompanyOS\Bundle\BackendBundle;

use CompanyOS\Bundle\BackendBundle\DependencyInjection\CompanyOSBackendExtension;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Symfony\WebpackEncoreBundle\Asset\EntrypointLookupInterface;

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

    public function boot(): void
    {
        parent::boot();

        // Webpack Encore-Konfiguration für das Bundle
        if ($this->container->has('webpack_encore.entrypoint_lookup_collection')) {
            $entrypointLookupCollection = $this->container->get('webpack_encore.entrypoint_lookup_collection');
            
            // Bundle-spezifische Entrypoint-Lookup hinzufügen
            if ($entrypointLookupCollection->has('companyosbackend')) {
                $entrypointLookupCollection->add('companyosbackend', $this->getPath() . '/public/build/entrypoints.json');
            }
        }
    }
} 