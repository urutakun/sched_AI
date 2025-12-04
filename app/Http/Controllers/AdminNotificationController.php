<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get all notifications (or you can paginate)
        $notifications = $user->notifications()->get();

        return Inertia::render('Admin/Notification', [
            'notifications' => $notifications,
        ]);
    }
}
