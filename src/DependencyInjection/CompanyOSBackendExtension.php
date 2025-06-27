<?php

namespace CompanyOS\Bundle\BackendBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class CompanyOSBackendExtension extends Extension
{
    public function getAlias(): string
    {
        return 'company_os_backend';
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        // Korrekter Pfad für Composer-Package
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yaml');

        // Security Headers Listener registrieren
        $container->autowire('CompanyOS\Bundle\BackendBundle\EventListener\SecurityHeadersListener')
            ->setArgument('$environment', '%kernel.environment%')
            ->addTag('kernel.event_subscriber');
    }
} 