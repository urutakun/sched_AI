<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationsController extends Controller
{
  public function index(Request $request)
  {
    $notifications = $request->user()->notifications()
      ->orderBy('created_at', 'desc')
      ->get()
      ->map(function ($notification) {
        return [
          'id' => $notification->id,
          'data' => $notification->data,
        ];
      });

    return response()->json($notifications);
  }

  public function markAsRead($id)
  {
    $notification = Auth::user()->notifications()->where('id', $id)->first();

    if (!$notification) {
      return response()->json(['error' => 'Notification not found'], 404);
    }

    if (!$notification->read_at) {
      $notification->update(['read_at' => now()]);
    }

    return response()->json([
      'message' => 'Notification marked as read',
      'notification' => [
        'id' => $notification->id,
        'read_at' => $notification->read_at,
        'is_read' => true
      ]
    ]);
  }
}
