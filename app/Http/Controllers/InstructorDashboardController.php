<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScheduleSession;

class InstructorDashboardController extends Controller
{
    public function index(){
      $sessionsRec = ScheduleSession::with([
      'schedule',
      'schedule.courseAssignment.course',
      'schedule.courseAssignment.instructor.user',
      'schedule.room',
      'schedule.program',
      'schedule.department',
      ])->get();
      $programs = Program::all();

      $sessions = $sessionsRec->map(function($session){
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

        return Inertia::render('Instructor/InstructorDashboard', [
          'sessions' => $sessions,
          'programs' => $programs,
        ]);
    }
}
