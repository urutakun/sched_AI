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
        
        // Get unread notifications
        $unreadNotifications = $user->unreadNotifications()->get();
        
        // Get all notifications (or you can paginate)
        $notifications = $user->notifications()->get();
        
        return Inertia::render('Instructor/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }
    
    // Optional: Mark as read method
    public function markAsRead(Request $request, $id = null)
    {
        $user = Auth::user();
        
        if ($id) {
            // Mark specific notification as read
            $notification = $user->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        } else {
            // Mark all as read
            $user->unreadNotifications->markAsRead();
        }
        
        return response()->json(['success' => true]);
    }
}