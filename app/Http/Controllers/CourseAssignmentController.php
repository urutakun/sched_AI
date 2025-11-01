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

    // Get all courses and instructors for AI model input
    $courses = Course::with(['academic_year', 'trimester', 'department'])
      ->where('dept_id', $course->dept_id)
      ->get();
    $instructors = Instructor::with(['user', 'department'])
      ->where('dept_id', $course->dept_id)
      ->get();

    // AI service base URL (default to local)
    $aiBaseURL = env('AI_SERVICE_URL', 'http://127.0.0.1:9000');

    $recommended = collect();

    try {
      // Prepare data payload (simple and JSON-serializable)
      $payload = [
        'courses' => $courses->map(function ($c) {
          return [
            'id' => $c->id,
            'name' => $c->name,
            'units' => $c->units,
            'dept_id' => $c->dept_id,
            'trimester_id' => $c->trimester_id,
            'academic_years_id' => $c->academic_years_id,
          ];
        }),
        'instructors' => $instructors->map(function ($i) {
          return [
            'id' => $i->id,
            'user_id' => $i->user_id,
            'dept_id' => $i->dept_id,
            'max_load' => $i->max_load ?? 12,
          ];
        }),
      ];

      // 🔹 Send data to FastAPI AI service
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

    // 🔹 Render form with AI recommendations
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
