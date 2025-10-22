<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;
use App\Models\User;

class StudentDashboardController extends Controller
{
    public function index(Request $request){
      return Inertia::render('Student/StudentDashboard');
    }
}
