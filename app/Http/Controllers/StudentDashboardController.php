<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;
use App\Models\User;
use App\Models\ScheduleSession;

class StudentDashboardController extends Controller
{
  public function index(Request $request)
  {

    $sessionsRec = ScheduleSession::with([
      'schedule',
      'schedule.courseAssignment.course',
      'schedule.courseAssignment.instructor.user',
      'schedule.room',
      'schedule.program',
      'schedule.department',
    ])->get();

    $sessions = $sessionsRec->map(function ($session) {
      $courseAssignment = $session->schedule->courseAssignment;
      $course = $courseAssignment->course;
      $instructor = $courseAssignment->instructor;
      return [
        'id' => $session->id,
        'title' => $course->name,
        'start' => $session->session_date . 'T' . $session->schedule->start_time,
        'end' => $session->session_date . 'T' . $session->schedule->end_time,
        'extendedProps' => [
          'instructor' => $instructor->user->first_name . ' ' . $instructor->user->last_name,
          'instructor_id' => $instructor->user->id,
          'course_year_level' => $course->year_level,
          'department_id' => $session->schedule->department->id,
          'program_name' => $session->schedule->program->name,
          'program_id' => $session->schedule->program->id,
          'program_code' => $session->schedule->program->code,
          'section' => $session->schedule->section,
          'room' => $session->schedule->room->room_name,
          'status' => $session->status,
        ]
      ];
    });

    $events = Event::with('department')->get()->map(function ($event) {
      return [
        'id' => $event->id,
        'title' => $event->title,
        'description' => $event->description,
        'start_datetime' => $event->start_datetime,
        'end_datetime' => $event->end_datetime,
        'type' => $event->type,
        'dept_id' => $event->dept_id,
        'location' => $event->location,
        'status' => $event->status,
        'department' => $event->department ? [
          'id' => $event->department->id,
          'name' => $event->department->name,
        ] : null,
      ];
    });
    
    return Inertia::render('Student/StudentDashboard', [
      'sessions' => $sessions,
      'events' => $events
    ]);
  }
}
