<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip middleware for logout and login
        if($request->routeIs('logout') || $request->routeIs('login') || $request->routeIs('notification') ){
            return $next($request);
        }

        $user = Auth::user();

        if ($user && $user->must_change_password) {
            $currentRouteName = $request->route()->getName();

            // Allow access to change-password routes (both GET and PUT)
            if(str_contains($currentRouteName, 'change-password')){
                return $next($request);
            }

            // Redirect to change password page
            $role = $user->role;
            $changePasswordRoute = "{$role}.change-password";
            return redirect()->route($changePasswordRoute);
        }

        return $next($request);
    }
}
