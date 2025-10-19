<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
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

    public function store(Request $request){
      $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'role' => 'required|string|in:admin,instructor,student',
        'department_id' => 'nullable|exists:departments,id',
        'year' => 'nullable|numeric|min:1|max:4',
        'section' => 'nullable|string|max:1',
        'email' => 'required|email|unique:users,email',
        'password' => ['required', 'confirmed', Password::defaults()]
      ]);

      $email = strtolower($validated['email']);

      $user = User::create([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'role' => $validated['role'],
        'department_id' => $validated['department_id'] ?? null,
        'year' => $validated['year'] ?? null,
          'section' => $validated['section'] ?? null,
        'email' => $email,
        'password' => $validated['password'],
      ]);

      if($user->role === 'instructor'){
        Instructor::create([
          'user_id' => $user->id,
          'dept_id' => $validated['department_id']
        ]);
      }

      if($user->role === 'student'){
        Student::create([
          'user_id' => $user->id,
          'year' => $validated['year'] ?? null,
          'section' => $validated['section'] ?? null,
        ]);
      }

      if(!$user){
        return redirect()->back()->with('error', 'Failed to create user');
      }

      return redirect()
        ->route('user-management.index')
        ->with('message', 'User created successfully');
    }
}
