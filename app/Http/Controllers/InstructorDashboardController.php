<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorDashboardController extends Controller
{
    public function index(Request $request){
      return Inertia::render('Instructor/InstructorDashboard');
    }
}
