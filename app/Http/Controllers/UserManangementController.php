<?php

namespace App\Http\Controllers;

use App\Mail\UserCredentialsMail;
use App\Models\Dean;
use App\Models\Department;
use App\Models\Instructor;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserManangementController extends Controller
{
    public function index()
    {
        $users = User::with(['instructor.department', 'student.program'])->get();
        return Inertia::render('Admin/UserManagement', ['users' => $users]);
    }

    public function create()
    {
        return Inertia::render('Admin/UserManagementForm', [
            'departments' => Department::all(),
            'programs' => Program::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'role' => 'required|in:admin,dean,instructor,student',
            'department_id' => 'nullable|exists:departments,id',
            'instructor_type' => 'nullable|string|in:full-time,part-time',
            'max_load' => 'nullable|numeric|min:3|max:24',
            'year' => 'nullable|numeric|min:1|max:4',
            'section' => 'nullable|string|max:1',
            'program_id' => 'nullable|exists:programs,id',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'role' => $validated['role'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
        ]);

        if ($user->role === 'dean') {
            Dean::create([
                'user_id' => $user->id,
                'dept_id' => $validated['department_id'],
            ]);
        }

        if ($user->role === 'instructor') {
            Instructor::create([
                'user_id' => $user->id,
                'dept_id' => $validated['department_id'],
                'instructor_type' => $validated['instructor_type'],
                'max_load' => $validated['max_load'] ?? 3,
            ]);
        }

        if ($user->role === 'student') {
            Student::create([
                'user_id' => $user->id,
                'year' => $validated['year'] ?? 1,
                'section' => strtoupper($validated['section'] ?? 'A'),
                'program_id' => $validated['program_id'],
            ]);
        }

        // send user their email and password through email
        Mail::to($user->email)->send(new UserCredentialsMail($user->first_name, $user->email, $validated['password']));

        return redirect()->route('user-management.index')
            ->with('message', 'User created successfully');
    }

    public function edit($id)
    {
        $user = User::with(['student', 'instructor', 'dean'])->findOrFail($id);

        return Inertia::render('Admin/UserManagementForm', [
            'user' => $user,
            'departments' => Department::all(),
            'programs' => Program::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'role' => 'required|in:admin,dean,instructor,student',
            'department_id' => 'nullable|exists:departments,id',
            'instructor_type' => 'nullable|string|in:full-time,part-time',
            'max_load' => 'nullable|numeric|min:3|max:24',
            'year' => 'nullable|numeric|min:1|max:4',
            'section' => 'nullable|string|max:1',
            'program_id' => 'nullable|exists:programs,id',
        ]);

        $user->update([
          'first_name' => $validated['first_name'],
          'last_name' => $validated['last_name'],
          'role' => $validated['role'],
        ]);

        // CLEAN UP

        Instructor::where('user_id', $user->id)->delete();
        Student::where('user_id', $user->id)->delete();
        Dean::where('user_id', $user->id)->delete();

        // Clean existing role-related models
        Instructor::where('user_id', $user->id)->delete();
        Student::where('user_id', $user->id)->delete();

        if($validated['role'] === 'dean'){
          Dean::create([
            'user_id' => $user->id,
            'dept_id' => $validated['department_id']
          ]);
        } elseif($validated['role'] === 'instructor') {
            Instructor::create([
                'user_id' => $user->id,
                'dept_id' => $validated['department_id'],
                'instructor_type' => $validated['instructor_type'],
                'max_load' => $validated['max_load'] ?? 3,
            ]);
        } elseif ($validated['role'] === 'student') {
            Student::create([
                'user_id' => $user->id,
                'year' => $validated['year'] ?? 1,
                'section' => strtoupper($validated['section'] ?? 'A'),
                'program_id' => $validated['program_id'],
            ]);
        }

        return redirect()->route('user-management.index')->with('message', 'User updated successfully');
    }

    public function updateCredentials(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if (!empty($validated['email'])) {
            $user->email = strtolower($validated['email']);
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['message' => 'Credentials updated successfully']);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
