<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(){
      $courses = Course::all();
      return Inertia::render('Admin/Course', ['courses' => $courses]);
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/CourseForm', ['departments' => $departments]);
    }

    public function store(Request $request){
      $validated = $request->validate([
        'dept_id'   => 'required|exists:departments,dept_id',
        'crs_code'  => 'required|string',
        'crs_name'  => 'required|string',
      ]);

      $course = Course::create($validated);

      if(!$course){
        return redirect()->back()->with([
          'message' => 'Failed to create course'
        ]);
      }

      return redirect()->route('courses.index')->with('message', 'courses created successfully');
    }

}
