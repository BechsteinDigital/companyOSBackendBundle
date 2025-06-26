<?php

namespace CompanyOS\Bundle\BackendBundle;

use CompanyOS\Bundle\BackendBundle\DependencyInjection\CompanyOSBackendExtension;
use Symfony\Component\HttpKernel\Bundle\Bundle;

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
} 