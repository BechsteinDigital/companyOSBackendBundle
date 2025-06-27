<?php

namespace CompanyOS\Bundle\BackendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;

class CompanyOSBackendExtension extends Extension
{
    public function getAlias(): string
    {
        return 'company_os_backend';
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        // Services direkt registrieren anstatt YAML-Datei zu laden
        $container->autowire('CompanyOS\Bundle\BackendBundle\EventListener\SecurityHeadersListener')
            ->setArgument('$environment', '%kernel.environment%')
            ->addTag('kernel.event_subscriber');
    }
} 