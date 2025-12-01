<?php

namespace App\Http\Controllers;

use App\Models\CancellationRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\ScheduleSession;
use Illuminate\Support\Facades\Log;

class ScheduleSessionController extends Controller
{
    public function update(Request $request, $id){
      $session = ScheduleSession::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'status' => 'required|string|in:upcoming,ongoing,completed,cancelled',
      ]);

      $session->update(['status' => $validated['status']]);

      return response()->json(['message' => 'Status updated successfully']);
    }

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
