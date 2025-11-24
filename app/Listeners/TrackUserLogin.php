<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Authenticated;
use Carbon\Carbon;

class TrackUserLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Authenticated $event): void
    {
        $user = $event->user;

        // If first_login_at is null, create it

        if(is_null($user->first_login_at)){
          $user->first_login_at = Carbon::now();
        }

        // Update last login

        $user->last_login_at = Carbon::now();

        $user->save(); 

    }
}
