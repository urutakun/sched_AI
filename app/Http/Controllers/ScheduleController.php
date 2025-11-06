<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\CourseAssignment;
use App\Models\Department;
use App\Models\Program;
use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ScheduleController extends Controller
{
  public function index()
  {
    $schedules = Schedule::with([
      'courseAssignment.course',
      'courseAssignment.instructor.user',
      'academicYear',
      'trimester',
      'department',
      'room'
    ])->get();
    return Inertia::render('Admin/Schedule', ['schedules' => $schedules]);
  }

  public function create()
  {
    $course_assignments = CourseAssignment::with(['course', 'instructor.user'])->get();
    $departments = Department::all();
    $programs = Program::with('department')->get();
    $academic_years = AcademicYear::with('trimesters')->get();
    $rooms = Room::all();
    return Inertia::render('Admin/ScheduleForm', [
      'course_assignments' => $course_assignments,
      'academic_years' => $academic_years,
      'departments' => $departments,
      'programs' => $programs,
      'rooms' => $rooms,
    ]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'course_assignment_id' => 'required|exists:course_assignments,id',
      'academic_year_id' => 'required|exists:academic_years,id',
      'trimester_id' => 'required|exists:trimesters,id',
      'department_id' => 'required|exists:departments,id',
      'program_id' => 'required|exists:programs,id',
      'section' => 'required|string|size:1',
      'room_id' => 'required|exists:rooms,id',
      'days' => 'required|array|min:1',
      'start_time' => 'required|date_format:H:i',
      'end_time' => 'required|date_format:H:i|after:start_time',
    ]);

    $aiBaseURL = env('AI_SERVICE_URL', 'http://127.0.0.1:9000');

    $courseAssignment = CourseAssignment::with(['course', 'instructor.user'])
      ->findOrFail($validated['course_assignment_id']);

    // Get instructor name safely for NEW schedule using first_name and last_name
    $instructorName = 'Unknown Instructor';
    if ($courseAssignment->instructor && $courseAssignment->instructor->user) {
      $firstName = $courseAssignment->instructor->user->first_name ?? '';
      $lastName = $courseAssignment->instructor->user->last_name ?? '';
      $instructorName = trim("{$firstName} {$lastName}");
    }

    // Get room name for NEW schedule
    $room = Room::find($validated['room_id']);
    $roomName = $room ? $room->room_name : 'Unknown Room';

    $newSchedule = [
      'id' => 'new',
      'academic_year_id' => $validated['academic_year_id'],
      'trimester_id' => $validated['trimester_id'],
      'room_id' => $validated['room_id'],
      'room_name' => $roomName, // ✅ Added room name
      'instructor_id' => $courseAssignment->instructor_id,
      'instructor_name' => $instructorName,
      'days' => $validated['days'],
      'start_time' => $validated['start_time'],
      'end_time' => $validated['end_time'],
    ];

    $existingSchedules = Schedule::with(['courseAssignment.instructor.user', 'room'])
      ->where('academic_year_id', $validated['academic_year_id'])
      ->where('trimester_id', $validated['trimester_id'])
      ->get()
      ->map(function ($s) {
        // Get instructor name safely for EXISTING schedules using first_name and last_name
        $existingInstructorName = 'Unknown Instructor';
        if ($s->courseAssignment && $s->courseAssignment->instructor && $s->courseAssignment->instructor->user) {
          $firstName = $s->courseAssignment->instructor->user->first_name ?? '';
          $lastName = $s->courseAssignment->instructor->user->last_name ?? '';
          $existingInstructorName = trim("{$firstName} {$lastName}");
        }

        // Get room name for EXISTING schedules
        $existingRoomName = $s->room ? $s->room->room_name : 'Unknown Room';

        return [
          'id' => $s->id,
          'academic_year_id' => $s->academic_year_id,
          'trimester_id' => $s->trimester_id,
          'room_id' => $s->room_id,
          'room_name' => $existingRoomName, // ✅ Added room name
          'instructor_id' => $s->courseAssignment->instructor_id ?? null,
          'instructor_name' => $existingInstructorName,
          'days' => is_array($s->days) ? $s->days : json_decode($s->days, true),
          'start_time' => $s->start_time,
          'end_time' => $s->end_time,
        ];
      })
      ->toArray();

    try {
      $response = Http::post("{$aiBaseURL}/check_schedule_conflict", [
        'new_schedule' => $newSchedule,
        'existing_schedules' => $existingSchedules,
      ]);

      if ($response->failed()) {
        return redirect()->back()
          ->withErrors(['error' => 'AI service is unreachable. Please try again later.']);
      }

      $result = $response->json();

      if (!empty($result['conflict']) && $result['conflict'] === true) {
        return back()->withErrors([
          'message' => $result['message'] ?? 'Scheduling conflict detected.'
        ]);
      }

      // Create the schedule
      $schedule = Schedule::create([
        'course_assignment_id' => $validated['course_assignment_id'],
        'academic_year_id' => $validated['academic_year_id'],
        'trimester_id' => $validated['trimester_id'],
        'department_id' => $validated['department_id'],
        'program_id' => $validated['program_id'],
        'section' => $validated['section'],
        'room_id' => $validated['room_id'],
        'days' => $validated['days'],
        'start_time' => $validated['start_time'],
        'end_time' => $validated['end_time'],
      ]);

      return redirect()->back()->with('success', 'Schedule created successfully.');
    } catch (\Exception $e) {
      return redirect()->back()->withErrors([
        'message' => 'Failed to create schedule: ' . $e->getMessage()
      ]);
    }
  }

  public function edit($id)
  {
    $schedule = Schedule::where('id', $id)->firstOrFail();
    $course_assignments = CourseAssignment::with(['course', 'instructor.user'])->get();
    $departments = Department::all();
    $academic_years = AcademicYear::with('trimesters')->get();
    $rooms = Room::all();

    return Inertia::render('Admin/ScheduleForm', [
      'course_assignments' => $course_assignments,
      'academic_years' => $academic_years,
      'departments' => $departments,
      'rooms' => $rooms,
      'schedule' => $schedule
    ]);
  }
}
