<?php

namespace App\Http\Controllers;

use App\Models\ScheduleSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SessionController extends Controller
{
    public function index(){
      return Inertia::render('Auth/Login');
    }

    public function store(Request $request){
      $validated = $request->validate([
        'email' => 'email|required',
        'password' => 'string|required'
      ]);

      if(!Auth::attempt($validated)){
        return redirect()->back()->with(['email' => 'credentials not found']);
      }

      return redirect()->back()->with(['success' => 'credentials found']);
    }

    // public static function updateStatus(){
    //   $now = Carbon::now();
    //   \Log::info("Session update running at: {$now}");

    //   $sessions = ScheduleSession::with('schedule')
    //   ->whereDate('session_date', '>=', $now->toDateString())
    //   ->get();

    //   foreach ($sessions as $session){
    //     $startDateTime = Carbon::parse($session->session_date . ' ' . $session->schedule->start_time);
    //     $endDateTime = Carbon::parse($session->session_date . ' ' . $session->schedule->end_time);
    //      $oldStatus = $session->status;

    //     if($now->lt($startDateTime)){
    //       $session->status = 'upcoming';
    //     } elseif($now->between($startDateTime, $endDateTime)){
    //       $session->status = 'ongoing';
    //     }
    //     elseif($now->gt($endDateTime)){
    //       $session->status = 'completed';
    //     }


    //     if ($session->isDirty('status')) {
    //         $session->save();
    //         \Log::info("Updated session {$session->id}: {$oldStatus} → {$session->status} ({$session->session_date} {$session->schedule->start_time}-{$session->schedule->end_time})");
    //     }

    //     $session->save();
    //      \Log::info("Updated session {$session->id}: {$session->status}");
    //   }
    //    \Log::info("Schedule update finished at {$now}");
    // }
    public static function updateStatus(){
        $now = Carbon::now('Asia/Manila');

        $sessions = ScheduleSession::with('schedule')
            ->whereDate('session_date', '>=', $now->toDateString())
            ->get();

        foreach ($sessions as $session) {
            $startDateTime = Carbon::parse($session->session_date . ' ' . $session->schedule->start_time, 'Asia/Manila');
            $endDateTime = Carbon::parse($session->session_date . ' ' . $session->schedule->end_time, 'Asia/Manila');

            if ($now->lt($startDateTime)) {
                $session->status = 'upcoming';
            } elseif ($now->between($startDateTime, $endDateTime)) {
                $session->status = 'ongoing';
            } elseif ($now->gt($endDateTime)) {
                $session->status = 'completed';
            }

           $session->save();
        }
    }

}
