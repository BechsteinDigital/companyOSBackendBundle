<?php

namespace CompanyOS\Bundle\BackendBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ViteExtension extends AbstractExtension
{
    private string $buildPath;
    private bool $isDev;
    private string $projectDir;

    public function __construct(string $buildPath = '/bundles/companyosbackend/build', bool $isDev = false, string $projectDir = '')
    {
        $this->buildPath = $buildPath;
        $this->isDev = $isDev;
        $this->projectDir = $projectDir;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('vite_entry_link_tags', [$this, 'renderLinkTags'], ['is_safe' => ['html']]),
            new TwigFunction('vite_entry_script_tags', [$this, 'renderScriptTags'], ['is_safe' => ['html']]),
        ];
    }

    public function renderLinkTags(string $entryName): string
    {
        if ($this->isDev) {
            return '<link rel="stylesheet" href="http://localhost:5173/@vite/client">';
        }

        $manifestPath = $this->projectDir . '/vendor/companyos/backend/public/build/manifest.json';
        if (!file_exists($manifestPath)) {
            return '';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        if (!isset($manifest[$entryName])) {
            return '';
        }

        $entry = $manifest[$entryName];
        $cssFiles = $entry['css'] ?? [];

        $html = '';
        foreach ($cssFiles as $cssFile) {
            $html .= sprintf('<link rel="stylesheet" href="%s/%s">', $this->buildPath, $cssFile);
        }

        return $html;
    }

    public function renderScriptTags(string $entryName): string
    {
        if ($this->isDev) {
            return '<script type="module" src="http://localhost:5173/@vite/client"></script>' .
                   sprintf('<script type="module" src="http://localhost:5173/%s"></script>', $entryName);
        }

        $manifestPath = $this->projectDir . '/vendor/companyos/backend/public/build/manifest.json';
        if (!file_exists($manifestPath)) {
            return '';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        if (!isset($manifest[$entryName])) {
            return '';
        }

        $entry = $manifest[$entryName];
        $file = $entry['file'] ?? '';

        if (empty($file)) {
            return '';
        }

        return sprintf('<script type="module" src="%s/%s"></script>', $this->buildPath, $file);
    }
} 