<?php

namespace CompanyOS\BackendBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class CompanyOSBackendExtension extends Extension
{
    public function getAlias(): string
    {
        return 'company_os_backend';
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__, 2) . '/Resources/config'));
        $loader->load('services.yaml');
    }
} 