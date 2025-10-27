<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(){
      return Inertia::render('Admin/Event');
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/EventForm', ['departments' => $departments]);
    }

    public function store(Request $request){
      dd($request);
    }
}
