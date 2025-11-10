<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default with Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
              'user' => fn() => function () use ($request){
                $user = $request->user();

                if(!$user){
                  return null;
                }

                if($user->role === 'instructor'){
                  return $user->load('instructor');
                }

                if($user->role === 'student'){
                  return $user->load('student.program');
                }

                return $user;
              }
            ],
        ]);
    }
}
