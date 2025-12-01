<?php

namespace App\Http\Controllers;

use App\Models\CancellationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
