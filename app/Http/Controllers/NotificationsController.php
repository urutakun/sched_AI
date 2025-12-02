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
}
