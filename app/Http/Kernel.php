<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'web' => [
            // ...existing code...
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // ...existing code...
            // Make sure Inertia share middleware runs for web requests
            \App\Http\Middleware\HandleInertiaRequests::class,
            // ...existing code...
        ],

        // ...existing code...
    ];

	// ...existing code...
}
