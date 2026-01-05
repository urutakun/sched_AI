<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\CourseAssignment;
use App\Models\Department;
use App\Models\Program;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleSession;
use App\Models\Trimester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use DB;
use App\Models\User;
use App\Notifications\ScheduleCreatedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;


class ScheduleController extends Controller
{
  public function index()
  {
    $user = Auth::user();
    $role = $user->role;
    $dean = $user->load('dean');
    $deptId = optional($user->dean)->dept_id;

    if($role === 'dean'){
      $schedules = Schedule::with([
      'courseAssignment.course',
      'courseAssignment.instructor.user',
      'academicYear',
      'trimester',
      'department',
      'room'
    ])->whereHas('department', function($q) use($deptId) {
      $q->where('id', $deptId);
    })->get();
    }
    else{
      $schedules = Schedule::with([
        'courseAssignment.course',
        'courseAssignment.instructor.user',
        'academicYear',
        'trimester',
        'department',
        'room'
      ])->get();
    }
    return Inertia::render('Admin/Schedule', ['schedules' => $schedules]);
  }

  public function create()
  {
    $user = Auth::user();
    $role = $user->role;
    $dean = $user->load('dean');
    $deptId = optional($user->dean)->dept_id;
    $departments = [];
    $programs = [];

    if($role === 'dean'){
      $departments = Department::where('id', $deptId)->get();
      $programs = Program::with('department')->where('dept_id', $deptId)->get();
    }
    else{
      $departments = Department::all();
      $programs = Program::with('department')->get();
    }

    $course_assignments = CourseAssignment::with(['course', 'instructor.user'])->get();
    $academic_years = AcademicYear::with('trimesters')->get();
    $rooms = Room::all();
    $schedules = Schedule::with('courseAssignment')->get();

    return Inertia::render('Admin/ScheduleForm', [
      'course_assignments' => $course_assignments,
      'academic_years' => $academic_years,
      'departments' => $departments,
      'programs' => $programs,
      'rooms' => $rooms,
      'schedules' => $schedules,
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

    $role = Auth::user()->role;

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
        'room_name' => $roomName,
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
                'room_name' => $existingRoomName,
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
            $errors = [];

            if (!empty($result['message'])) {
                $errors['conflict_message'] = $result['message'];
            }

            if (!empty($result['suggestions'])) {
                $errors['suggestions_message'] = $result['suggestions'];
            }

            if (empty($errors)) {
                $errors['message'] = 'Scheduling conflict detected.';
            }

            return back()->withErrors($errors);
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

        // ✅ FIX: Reload the schedule with relationships BEFORE using it in notification
        $schedule->load([
            'courseAssignment.course',
            'courseAssignment.instructor.user'
        ]);

        // ✅ FIX: Get the instructor user from the reloaded schedule
        $instructorUser = $schedule->courseAssignment->instructor->user;

        // Notify Instructor
        $instructorUser->notify(new ScheduleCreatedNotification($schedule));

        // Create day mapping
        $day_map = [
            'Sun' => 0,
            'Mon' => 1,
            'Tue' => 2,
            'Wed' => 3,
            'Thu' => 4,
            'Fri' => 5,
            'Sat' => 6,
        ];

        $trimester = Trimester::find($schedule->trimester_id);
        $start = Carbon::parse($trimester->start_date);
        $end = Carbon::parse($trimester->end_date);

        $dayNames  = $schedule->days;
        $days = collect($dayNames)->map(fn($d) => $day_map[$d] ?? null)->filter()->toArray();

        DB::transaction(function () use ($schedule, $start, $end, $days) {
            $sessions = [];
            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                if (in_array($date->dayOfWeek(), $days)) {
                    $sessions[] = [
                        'id' => 'SS_' . str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT),
                        'schedule_id' => $schedule->id,
                        'session_date' => $date->toDateString(),
                        'status' => 'upcoming',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            if (!empty($sessions)) {
                ScheduleSession::upsert($sessions, ['schedule_id', 'session_date'], ['status', 'updated_at']);
            }
        });

        return redirect()->route($role . '.schedules.index')->with('success', 'Schedule created successfully.');
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
    $programs = Program::with('department')->get();
    $rooms = Room::all();

    return Inertia::render('Admin/ScheduleForm', [
      'course_assignments' => $course_assignments,
      'academic_years' => $academic_years,
      'departments' => $departments,
      'programs' => $programs,
      'rooms' => $rooms,
      'schedule' => $schedule
    ]);
  }

  public function update(Request $request, $id)
  {
    $schedule = Schedule::where('id', $id)->first();
    $role = Auth::user()->role;

    if (!$schedule) {
      return redirect()->back()->with('error', 'Schedule not found');
    }

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

    // Get instructor name safely for UPDATED schedule
    $instructorName = 'Unknown Instructor';
    if ($courseAssignment->instructor && $courseAssignment->instructor->user) {
      $firstName = $courseAssignment->instructor->user->first_name ?? '';
      $lastName = $courseAssignment->instructor->user->last_name ?? '';
      $instructorName = trim("{$firstName} {$lastName}");
    }

    // Get room name for UPDATED schedule
    $room = Room::find($validated['room_id']);
    $roomName = $room ? $room->room_name : 'Unknown Room';

    $updatedSchedule = [
      'id' => $schedule->id, // Use the actual schedule ID
      'academic_year_id' => $validated['academic_year_id'],
      'trimester_id' => $validated['trimester_id'],
      'room_id' => $validated['room_id'],
      'room_name' => $roomName,
      'instructor_id' => $courseAssignment->instructor_id,
      'instructor_name' => $instructorName,
      'days' => $validated['days'],
      'start_time' => $validated['start_time'],
      'end_time' => $validated['end_time'],
    ];

    // Get existing schedules EXCLUDING the current one being updated
    $existingSchedules = Schedule::with(['courseAssignment.instructor.user', 'room'])
      ->where('academic_year_id', $validated['academic_year_id'])
      ->where('trimester_id', $validated['trimester_id'])
      ->where('id', '!=', $schedule->id) // Exclude current schedule
      ->get()
      ->map(function ($s) {
        // Get instructor name safely for EXISTING schedules
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
          'room_name' => $existingRoomName,
          'instructor_id' => $s->courseAssignment->instructor_id ?? null,
          'instructor_name' => $existingInstructorName,
          'days' => is_array($s->days) ? $s->days : json_decode($s->days, true),
          'start_time' => $s->start_time,
          'end_time' => $s->end_time,
        ];
      })
      ->toArray();

    try {
      // Check for conflicts with AI service
      $response = Http::post("{$aiBaseURL}/check_schedule_conflict", [
        'new_schedule' => $updatedSchedule,
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

      // Update the schedule
      $schedule->update([
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

      // Update schedule sessions
      $this->updateScheduleSessions($schedule);

      return redirect()->route($role . '.schedules.index')->with('success', 'Schedule updated successfully.');
    } catch (\Exception $e) {
      return redirect()->back()->withErrors([
        'message' => 'Failed to update schedule: ' . $e->getMessage()
      ]);
    }
  }

  /**
   * Update schedule sessions when schedule is modified
   */
  private function updateScheduleSessions(Schedule $schedule)
  {
    // Delete existing sessions for this schedule
    ScheduleSession::where('schedule_id', $schedule->id)->delete();

    // Create day mapping
    $day_map = [
      'Sun' => 0,
      'Mon' => 1,
      'Tue' => 2,
      'Wed' => 3,
      'Thu' => 4,
      'Fri' => 5,
      'Sat' => 6,
    ];

    $trimester = Trimester::find($schedule->trimester_id);
    $start = Carbon::parse($trimester->start_date);
    $end = Carbon::parse($trimester->end_date);

    $dayNames = $schedule->days;
    $days = collect($dayNames)->map(fn($d) => $day_map[$d] ?? null)->filter()->toArray();

    DB::transaction(function () use ($schedule, $start, $end, $days) {
      $sessions = [];
      for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
        if (in_array($date->dayOfWeek(), $days)) {
          $sessions[] = [
            'id' => 'SS_' . str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT),
            'schedule_id' => $schedule->id,
            'session_date' => $date->toDateString(),
            'status' => 'upcoming',
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }
      }

      if (!empty($sessions)) {
        ScheduleSession::upsert($sessions, ['schedule_id', 'session_date'], ['status', 'updated_at']);
      }
    });
  }

  public function destroy($id)
  {
    $schedule = Schedule::where('id', $id)->firstOrFail();

    if (!$schedule) {
      return response()->json(['message' => 'Not found']);
    }

    $schedule->delete();

    return response()->json(['message' => 'Schedule deleted successfully']);
  }
}
