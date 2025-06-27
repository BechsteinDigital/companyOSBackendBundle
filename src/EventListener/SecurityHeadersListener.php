<?php

namespace CompanyOS\Bundle\BackendBundle\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class SecurityHeadersListener implements EventSubscriberInterface
{
    public function __construct(
        private string $environment = 'dev'
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => ['onKernelResponse', 1000],
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $request = $event->getRequest();

        // Nur für HTML-Responses Security Headers setzen
        if (!$this->shouldAddHeaders($request, $response)) {
            return;
        }

        // Basis Security Headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Umgebungsspezifische Security Headers
        if ($this->environment === 'prod') {
            $this->addProductionHeaders($response);
        } else {
            $this->addDevelopmentHeaders($response);
        }
    }

    private function shouldAddHeaders($request, $response): bool
    {
        // Nur für HTML-Responses und nicht für API-Endpunkte
        $contentType = $response->headers->get('Content-Type', '');
        $isHtml = str_contains($contentType, 'text/html');
        $isApi = str_starts_with($request->getPathInfo(), '/api');
        
        return $isHtml && !$isApi;
    }

    private function addProductionHeaders($response): void
    {
        // Strenge Security Headers für Production
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Content-Security-Policy', 
            "default-src 'self'; " .
            "script-src 'self'; " .
            "style-src 'self'; " .
            "img-src 'self' data: https:; " .
            "font-src 'self' data:; " .
            "connect-src 'self'; " .
            "frame-ancestors 'none';"
        );
        $response->headers->set('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
        );
        
        // HSTS nur in Production
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    private function addDevelopmentHeaders($response): void
    {
        // Weniger strenge Security Headers für Development
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Content-Security-Policy', 
            "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
            "style-src 'self' 'unsafe-inline'; " .
            "img-src 'self' data: https:; " .
            "font-src 'self' data:;"
        );
        $response->headers->set('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=()'
        );
    }
} 