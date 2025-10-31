<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Instructor;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(){
      $departments = Department::count();
      $instructors = Instructor::count();
      $students = Student::count();
      $rooms = Room::count();
      return Inertia::render('Admin/AdminDashboard', [
        'departments' => $departments,
        'instructors' => $instructors,
        'students' => $students,
        'rooms' => $rooms,
      ]);
    }

    public function create(){
      return Inertia::render('Admin/Create');
    }
}
