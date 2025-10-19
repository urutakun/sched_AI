<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManangementController extends Controller
{
    public function index(){
      $users = User::all();
      return Inertia::render('Admin/UserManagement', ['users' => $users]);
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/UserManagementForm', ['departments' => $departments]);
    }
}
