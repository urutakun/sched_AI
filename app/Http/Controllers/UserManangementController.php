<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
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

    public function edit($id){
      $user = User::where('id', $id)->firstOrFail();
      $departments = Department::all();
      return Inertia::render('Admin/UserManagementForm', ['user' => $user, 'departments' => $departments]);
    }

    public function update(Request $request, $id){
      $user = User::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'role' => 'required|string|in:admin,instructor,student',
        'department_id' => 'nullable|exists:departments,id',
        'year' => 'nullable|numeric|min:1|max:4',
        'section' => 'nullable|string|max:1',
      ]);

      $user->update([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'role' => $validated['role'],
        'department_id' => $validated['department_id'] ?? null,
        'year' => $validated['year'] ?? null,
        'section' => $validated['section'] ?? null,
      ]);

      // CLEAN UP

      Instructor::where('user_id', $user->id)->delete();
      Student::where('user_id', $user->id)->delete();

      if($validated['role'] === 'admin'){
        $user->update([
          'department_id' => null,
          'year' => null,
          'section' => null
        ]);
      }

      if($validated['role'] === 'instructor'){
        Instructor::create([
          'user_id' => $user->id,
          'dept_id' => $validated['department_id']
        ]);
      }

      if($validated['role'] === 'student'){
        Student::create([
          'user_id' => $user->id,
          'year' => $validated['year'] ?? null,
          'section' => $validated['section'] ?? null,
        ]);
      }

      return redirect('/admin/user-management')->with('success', 'User updated successfully');
    }

    public function updateCredentials(Request $request, $id){
      $user = User::where('id', $id)->firstOrFail();
      \Log::info(['user' => $user]);

      $validated = $request->validate([
        'email' => [
          'nullable',
          'email',
          Rule::unique('users', 'email')->ignore($user->id),
        ],
        'password' => ['nullable', 'confirmed', Password::defaults()]
      ]);

      $user->email = strtolower($validated['email']);

      if(!empty($validated['password'])){
        $user->password = bcrypt($validated['password']);
      }

      $user->save();

      return response()->json(['message' => 'Credentials updated successfully']);
    }

    public function destroy($id){
      $user = User::where('id', $id)->first();

      if(!$user){
        return response()->json(['message' => 'Not found']);
      }

      $user->delete();

      return response()->json(['message' => 'User deleted successfully']);
    }
}
