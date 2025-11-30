<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class ForgotPassword
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(($request->routeIs('submit.otp')
          || $request->routeIs('reset.password'))
          && !$request->session()->has('email')){
            return redirect()->route('forgot')
            ->with('error', 'Email not found.');
          }

        return $next($request);
    }
}
