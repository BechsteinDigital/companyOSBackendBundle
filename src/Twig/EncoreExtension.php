<?php

namespace CompanyOS\Bundle\BackendBundle\Twig;

use Symfony\Component\Asset\Packages;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class EncoreExtension extends AbstractExtension
{
    private Packages $packages;
    private string $publicDir;

    public function __construct(Packages $packages, string $publicDir)
    {
        $this->packages = $packages;
        $this->publicDir = $publicDir;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('encore_entry_exists', [$this, 'entryExists']),
        ];
    }

    public function entryExists(string $entryName): bool
    {
        $entrypointsPath = $this->publicDir . '/bundles/companyosbackend/build/entrypoints.json';
        
        if (!file_exists($entrypointsPath)) {
            return false;
        }

        try {
            $entrypoints = json_decode(file_get_contents($entrypointsPath), true);
            return isset($entrypoints['entrypoints'][$entryName]);
        } catch (\Exception $e) {
            return false;
        }
    }
} 