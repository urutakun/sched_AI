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
    public function index(){
      $course_assignments = CourseAssignment::with(['course', 'instructor'])->get();
      return Inertia::render('Admin/CourseAssignments', ['course_assignments' => $course_assignments]);
    }

    public function create($id){
      $course = Course::where('id', $id)->firstOrFail();
      $courses = Course::with(['academic_year', 'trimester', 'department'])->get();
      $instructors = Instructor::with(['user', 'department'])->get();

      $aiBaseURL = env('AI_SERVICE_URL');

      $response = Http::post("$aiBaseURL/assign-courses", [
        'courses' => $courses,
        'instructors' => $instructors
      ]);

      $recommended = $response->json()['recommended_instructors'] ?? [];

      return Inertia::render('Admin/AssignCourseForm', [
        'course' => $course,
        'recommended_instructors' => $recommended,
      ]);
    }

    public function store(Request $request){
      dd($request);
    }
}
