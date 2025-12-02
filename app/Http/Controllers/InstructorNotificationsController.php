<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InstructorNotificationsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get all notifications (or you can paginate)
        $notifications = $user->notifications()->get();
        
        return Inertia::render('Instructor/Notification', [
            'notifications' => $notifications,
        ]);
    }
    
}