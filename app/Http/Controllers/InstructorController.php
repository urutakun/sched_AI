<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function index(){
      return Inertia::render('Admin/Instructor');
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/InstructorForm', ['departments' => $departments]);
    }
}
