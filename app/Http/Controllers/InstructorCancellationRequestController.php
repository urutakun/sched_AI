<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CancellationRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstructorCancellationRequestController extends Controller
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
    )
    ->whereHas('schedule_session.schedule.courseAssignment.instructor.user', function ($query){
      $query->where('id', Auth::id());
    })
    ->get();

    return Inertia::render('Instructor/CancellationRequest', ['cancellation_request' => $cancellationRequest]);
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
}
