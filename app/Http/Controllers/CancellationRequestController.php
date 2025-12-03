<?php

namespace App\Http\Controllers;

use App\Models\CancellationRequest;
use App\Models\ScheduleSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CancellationRequestController extends Controller
{
  public function index(){
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

  public function store(Request $request, $id){
      $validated = $request->validate([
        'type' => 'required|string|in:personal,medical,weather,event,others',
        'reason' => 'required|string',
        'attachment' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:5120'
      ]);

      $attachmentPath = null;
      if($request->hasFile('attachment')){
        $attachmentPath = $request->file('attachment')->store('cancellation-attachments', 'public');
      }

      $validated['session_id'] = $id;
      $validated['attachment'] = $attachmentPath;

      $cancellationRequest = CancellationRequest::create($validated);

      if(!$cancellationRequest){
        return back()->with('error', 'Failed to create request');
      }

      return back()->with('success', 'Cancellation request submitted successfully');
  }

  public function show($id){

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

  public function accept($id){
    $request = CancellationRequest::where('id', $id)->with('schedule_session')->firstOrFail();

    // Update request status
    $request->update(['status' => 'approved']);

    // Update schedule session status
    $session = ScheduleSession::where('id', $request->schedule_session->id)->firstOrFail();
    $session->update(['status' => 'cancelled']);

    return redirect()->route('cancel.request.index')->with('message', 'Cancellation request approved');
  }

  public function deny(Request $request, $id){
    $validated = $request->validate([
      'denial_reason' =>  'string|max:500'
    ]);

    $request = CancellationRequest::where('id', $id)->with('schedule_session')->firstOrFail();

    // Update request status
    $request->update([
      'status' => 'denied',
      'denial_reason' => $validated['denial_reason']
    ]);

    return redirect()->route('cancel.request.index')->with('message', 'Cancellation denied');
  }

  public function destroy($id){
    $request = CancellationRequest::where('id', $id)->firstOrFail();

    if (!$request) {
      return response()->json(['message' => 'Not found']);
    }

    $request->delete();

    return response()->json(['message' => 'Cancellation request deleted successfully']);
  }
}
