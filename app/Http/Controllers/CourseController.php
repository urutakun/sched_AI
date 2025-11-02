<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(){
      $courses = Course::with(['academic_year', 'trimester', 'department'])->get();
      return Inertia::render('Admin/Course', ['courses' => $courses]);
    }

    public function create(){
      $departments = Department::all();
      $academic_years = AcademicYear::with('trimesters')->get();
      return Inertia::render('Admin/CourseForm', [
        'departments' => $departments,
        'academic_years' => $academic_years
      ]);
    }

    public function store(Request $request){
      $validated = $request->validate([
        'academic_years_id'   => 'required|exists:academic_years,id',
        'trimester_id'   => 'required|exists:trimesters,id',
        'dept_id'   => 'required|exists:departments,id',
        'year_level'  => 'required|numeric|min:1|max:3',
        'code'  => 'required|string',
        'name'  => 'required|string',
        'units'  => 'required|numeric|min:1|max:3',
        'has_lab'  => 'required|boolean',
      ]);

      $course = Course::create($validated);

      if(!$course){
        return redirect()->back()->with([
          'message' => 'Failed to create course'
        ]);
      }

      return redirect()->route('courses.index')->with('message', 'Course created successfully');
    }

    public function edit( $id ){
      $course = Course::where('id', $id)->with(['academic_year', 'trimester', 'department'])->firstOrFail();
      $departments = Department::all();
      $academic_years = AcademicYear::with('trimesters')->get();

      return Inertia::render('Admin/CourseForm', [
        'departments' => $departments,
        'academic_years' => $academic_years,
        'course' => $course
      ]);
    }

    public function update(Request $request, $id){
      $course = Course::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'academic_years_id'   => 'nullable|exists:academic_years,id',
        'trimester_id'   => 'nullable|exists:trimesters,id',
        'dept_id'   => 'nullable|exists:departments,id',
        'year_level'  => 'required|numeric|min:1|max:3',
        'code'  => 'nullable|string',
        'name'  => 'nullable|string',
        'units'  => 'nullable|numeric|min:1|max:3',
        'has_lab'  => 'nullable|boolean',
        'is_assigned' => 'nullable|in:assigned,not_assigned'
      ]);

      $course->update($validated);
      return redirect('/admin/courses')->with('success', 'Course updated successfully');
    }

    public function destroy($id){
      $course = Course::where('id', $id)->firstOrFail();

      if(!$course){
        return response()->json(['message' => 'Not found']);
      }

      $course->delete();

      return response()->json(['message' => 'Course deleted successfully']);
    }

}
