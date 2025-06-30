<?php

namespace CompanyOS\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AssetController extends AbstractController
{
    #[Route('/bundles/companyosbackend/{path}', name: 'companyos_backend_assets', requirements: ['path' => '.*'])]
    public function serve(string $path): Response
    {
        $assetPath = $this->getParameter('kernel.project_dir') . '/vendor/companyos/backend/public/build/' . $path;
        
        if (!file_exists($assetPath)) {
            throw $this->createNotFoundException('Asset not found');
        }

        $content = file_get_contents($assetPath);
        $mimeType = $this->getMimeType($assetPath);

        return new Response($content, 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000'
        ]);
    }

    private function getMimeType(string $filePath): string
    {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        
        return match ($extension) {
            'js' => 'application/javascript',
            'css' => 'text/css',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            default => 'application/octet-stream'
        };
    }
} 