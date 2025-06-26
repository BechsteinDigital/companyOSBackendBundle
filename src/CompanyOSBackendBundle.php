<?php

namespace CompanyOS\BackendBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class CompanyOSBackendBundle extends Bundle
{
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
} 