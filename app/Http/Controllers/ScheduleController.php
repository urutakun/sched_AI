<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\CourseAssignment;
use App\Models\Department;
use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(){
      return Inertia::render('Admin/Schedule');
    }

    public function create(){
      $course_assignments = CourseAssignment::with(['course', 'instructor.user'])->get();
      $departments = Department::all();
      $academic_years = AcademicYear::with('trimesters')->get();
      $rooms = Room::all();
      return Inertia::render('Admin/ScheduleForm', [
        'course_assignments' => $course_assignments,
        'academic_years' => $academic_years,
        'departments' => $departments,
        'rooms' => $rooms
      ]);
    }

    public function store(Request $request){
      dd($request->all());
    }

    public function edit($id){
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
