<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Event;
use App\Models\Instructor;
use App\Models\Room;
use App\Models\ScheduleSession;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
  public function index()
  {
    // Admin status
    $department_count = Department::count();
    $instructor_count = Instructor::count();
    $student_count = Student::count();
    $rooms_count = Room::count();
    $event_count = Event::count();

    $sessionsRec = ScheduleSession::with([
      'schedule',
      'schedule.courseAssignment.course',
      'schedule.courseAssignment.instructor.user',
      'schedule.room',
      'schedule.program',
      'schedule.department',
    ])->get();
    $departments = Department::with('programs')->get();

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

    return Inertia::render('Admin/AdminDashboard', [
      'department_count' => $department_count,
      'instructor_count' => $instructor_count,
      'student_count' => $student_count,
      'room_count' => $rooms_count,
      'sessions' => $sessions,
      'departments' => $departments,
      'event_count' => $event_count,
      'events' => $events
    ]);
  }

  public function create()
  {
    return Inertia::render('Admin/Create');
  }
}
