<?php

namespace App\Http\Controllers;

use App\Models\CancellationRequest;
use App\Models\ScheduleSession;
use App\Models\User;
use App\Notifications\CancellationRequestStatusNotification;
use App\Notifications\InstructorCancellationRequestNotification;
use App\Notifications\InstructorSubmittedCancellationRequestNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;

class CancellationRequestController extends Controller
{
  public function index()
  {
    $cancellationRequest = CancellationRequest::with(
      'schedule_session',
      'schedule_session.schedule',
      'schedule_session.schedule.department',
      'schedule_session.schedule.program',
      'schedule_session.schedule.courseAssignment',
      'schedule_session.schedule.courseAssignment.instructor.user',
      'schedule_session.schedule.courseAssignment.course',
    )->get();

    return Inertia::render('Admin/CancellationRequest', ['cancellation_request' => $cancellationRequest]);
  }

  public function store(Request $request, $id)
  {
    $validated = $request->validate([
      'type' => 'required|string|in:personal,medical,weather,event,others',
      'reason' => 'required|string',
      'attachment' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:5120'
    ]);

    $attachmentPath = null;
    if ($request->hasFile('attachment')) {
      $attachmentPath = $request->file('attachment')->store('cancellation-attachments', 'public');
    }

    $validated['session_id'] = $id;
    $validated['attachment'] = $attachmentPath;

    $cancellationRequest = CancellationRequest::create($validated);

    // Load related data
    $cancellationRequest->load(
      'schedule_session.schedule.courseAssignment.instructor.user',
      'schedule_session.schedule.courseAssignment.course'
    );

    // Get the instructor user model
    $instructorUser = $cancellationRequest->schedule_session
      ->schedule
      ->courseAssignment
      ->instructor
      ->user;

    // Notify admin(s)
    Notification::send(
      User::where('role', 'admin')->get(),
      new InstructorCancellationRequestNotification($cancellationRequest)
    );

    // Notify the instructor themselves
    $instructorUser->notify(
      new InstructorSubmittedCancellationRequestNotification($cancellationRequest)
    );

    return back()->with('success', 'Cancellation request submitted successfully');
  }


  public function show($id)
  {

    $cancellationRequest = CancellationRequest::where('id', $id)
      ->with(
        'schedule_session',
        'schedule_session.schedule',
        'schedule_session.schedule.department',
        'schedule_session.schedule.program',
        'schedule_session.schedule.room',
        'schedule_session.schedule.courseAssignment',
        'schedule_session.schedule.courseAssignment.instructor.user',
        'schedule_session.schedule.courseAssignment.course',
      )->get();

    return Inertia::render('Components/ShowCancellationRequest', ['cancellation_request' => $cancellationRequest]);
  }

  public function accept($id)
  {
    $request = CancellationRequest::where('id', $id)
      ->with('schedule_session.schedule.courseAssignment.instructor.user')
      ->firstOrFail();

    // Update status
    $request->update(['status' => 'approved']);

    // Cancel the session
    $session = ScheduleSession::findOrFail($request->schedule_session->id);
    $session->update(['status' => 'cancelled']);

    // Notify ALL users
    Notification::send(
      User::all(),
      new CancellationRequestStatusNotification($request)
    );

    return redirect()->route('cancel.request.index')
      ->with('message', 'Cancellation request approved');
  }

  public function deny(Request $request, $id)
  {
    $validated = $request->validate([
      'denial_reason' => 'string|max:500'
    ]);

    $cancellationRequest = CancellationRequest::where('id', $id)
      ->with('schedule_session.schedule.courseAssignment.instructor.user')
      ->firstOrFail();

    $cancellationRequest->update([
      'status' => 'denied',
      'denial_reason' => $validated['denial_reason'] ?? null
    ]);

    // Notify ALL users
    Notification::send(
      User::all(),
      new CancellationRequestStatusNotification($cancellationRequest)
    );

    return redirect()->route('cancel.request.index')
      ->with('message', 'Cancellation denied');
  }

  public function destroy($id)
  {
    $request = CancellationRequest::where('id', $id)->firstOrFail();

    if (!$request) {
      return response()->json(['message' => 'Not found']);
    }

    $request->delete();

    return response()->json(['message' => 'Cancellation request deleted successfully']);
  }
}
