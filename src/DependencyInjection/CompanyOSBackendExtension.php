<?php

namespace CompanyOS\Bundle\BackendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\Config\FileLocator;

class CompanyOSBackendExtension extends Extension
{
    public function getAlias(): string
    {
        return 'company_os_backend';
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        // Services aus YAML-Datei laden
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../../Resources/config'));
        $loader->load('services.yaml');

        // Nur Services registrieren, die tatsächlich existieren
        // SecurityHeadersListener registrieren (falls vorhanden)
        if (class_exists('CompanyOS\Bundle\BackendBundle\EventListener\SecurityHeadersListener')) {
            $container->autowire('CompanyOS\Bundle\BackendBundle\EventListener\SecurityHeadersListener')
                ->setArgument('$environment', '%kernel.environment%')
                ->addTag('kernel.event_subscriber');
        }

        // BackendController registrieren (falls vorhanden)
        if (class_exists('CompanyOS\Bundle\BackendBundle\Controller\BackendController')) {
            $container->autowire('CompanyOS\Bundle\BackendBundle\Controller\BackendController')
                ->addTag('controller.service_arguments')
                ->addTag('container.service_subscriber');
        }

        // Asset-Konfiguration für Webpack Encore
        $container->setParameter('company_os_backend.assets_path', 'bundles/companyosbackend');
    }
} 