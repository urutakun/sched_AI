<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CourseAssignmentController extends Controller
{
  public function index()
  {
    $course_assignments = CourseAssignment::with(['course', 'instructor.user'])->get();
    return Inertia::render('Admin/CourseAssignments', ['course_assignments' => $course_assignments]);
  }

  public function create($id)
  {
    // Get the target course
    $course = Course::with(['academic_year', 'trimester', 'department'])
      ->findOrFail($id);

    // Get all courses in same department
    $courses = Course::with(['academic_year', 'trimester', 'department'])
      ->where('dept_id', $course->dept_id)
      ->get();

    // Get instructors in same department who have less than 12 assigned units
    $instructors = Instructor::with(['user', 'department'])
      ->where('dept_id', $course->dept_id)
      ->withSum(['courseAssignments as total_units' => function ($q) {
        $q->join('courses', 'course_assignments.course_id', '=', 'courses.id');
      }], 'courses.units')
      ->get()
      // Filter using each instructor's individual max_load
      ->filter(fn($i) => ($i->total_units ?? 0) < ($i->max_load ?? 12))
      ->values();


    // AI service base URL
    $aiBaseURL = env('AI_SERVICE_URL', 'http://127.0.0.1:9000');

    $recommended = collect();

    try {
      // Prepare payload
      $payload = [
        'courses' => $courses->map(fn($c) => [
          'id' => $c->id,
          'name' => $c->name,
          'units' => $c->units,
          'dept_id' => $c->dept_id,
          'trimester_id' => $c->trimester_id,
          'academic_years_id' => $c->academic_years_id,
        ]),
        'instructors' => $instructors->map(fn($i) => [
          'id' => $i->id,
          'user_id' => $i->user_id,
          'dept_id' => $i->dept_id,
          'max_load' => $i->max_load ?? 12,
        ]),
      ];

      // Call FastAPI AI service
      $response = Http::post("$aiBaseURL/assign-courses", $payload);

      if ($response->successful()) {
        $recommended = collect($response->json()['recommended_instructors'] ?? [])
          ->map(function ($rec) use ($instructors) {
            $instructor = $instructors->firstWhere('id', $rec['id'])
              ?? $instructors->firstWhere('user_id', $rec['user_id']);

            return [
              'id' => $instructor?->id,
              'user_id' => $instructor?->user_id,
              'first_name' => $instructor?->user?->first_name ?? 'Unknown',
            ];
          })
          ->filter(fn($inst) => $inst['id'] !== null)
          ->values();
      }
    } catch (\Exception $e) {
      $recommended = collect();
    }

    // Render page
    return Inertia::render('Admin/AssignCourseForm', [
      'course' => $course,
      'recommended_instructors' => $recommended,
    ]);
  }

  public function store(Request $request)
  {
    try {
      $validated = $request->validate([
        'course_id' => 'required|exists:courses,id',
        'instructor_id' => 'required|exists:instructors,id',
        'status' => 'required|in:active,inactive',
      ]);

      $assignment = CourseAssignment::create([
        'course_id' => $validated['course_id'],
        'instructor_id' => $validated['instructor_id'],
        'status' => $validated['status'],
      ]);

      return redirect()
        ->route('course-assignments.index')
        ->with('success', 'Course assignment created successfully.');
    } catch (\Exception $e) {
      dd('Error creating course assignment: ' . $e->getMessage());
    }
  }
}
